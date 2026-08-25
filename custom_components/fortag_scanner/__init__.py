"""The Fortag Network Scanner integration."""

import asyncio
from contextlib import suppress
from datetime import datetime, timezone
import json
import logging
import time
from urllib.parse import urlencode
from uuid import uuid4

import voluptuous as vol
from homeassistant.components import frontend, mqtt, panel_custom, websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import SOURCE_IMPORT, ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN, SUPPORTED_MQTT_API_VERSION

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.empty_config_schema(DOMAIN)
PANEL_URL = "fortag-scanner"
DISCOVERY_INSTANCE_TOPIC = "fortag/discovery/+/instances/+"
STATE_TOPIC = "fortag/scanners/+/state"
PROGRESS_TOPIC = "fortag/scanners/+/progress"
ALERT_TOPIC = "fortag/scanners/+/alert"
AVAILABILITY_TOPIC = "fortag/scanners/+/availability"
COMMAND_RESULT_TOPIC = "fortag/scanners/+/command/result"
APPROVAL_INTERVAL = 15
APPROVAL_LEASE_SECONDS = 60
STALE_INSTANCE_SECONDS = 60
PRUNE_INSTANCE_SECONDS = 24 * 60 * 60


def _panel_link(mac: str, port: int | None = None, protocol: str | None = None) -> str:
    """Build a relative panel deep link for a host or port alert."""
    query: dict[str, str | int] = {"mac": mac}
    if port is not None:
        query["port"] = port
    if protocol:
        query["protocol"] = protocol
    return f"/{PANEL_URL}?{urlencode(query)}"


def _integration_data(hass: HomeAssistant) -> dict:
    """Return shared runtime data, creating it when necessary."""
    return hass.data.setdefault(
        DOMAIN,
        {
            "latest_state": None,
            "latest_progress": {"status": "idle", "target": ""},
            "unsubscribers": [],
            "globals_registered": False,
            "adopted_uuid": None,
            "active_instance": None,
            "instances": {},
            "notified_registrations": set(),
            "approval_task": None,
            "entry": None,
            "pending_commands": {},
        },
    )


def _topic_parts(topic: str) -> list[str]:
    return topic.split("/")


async def _notify_registration_rejected(
    hass: HomeAssistant, scanner_uuid: str, scanner_name: str, reason: str
) -> None:
    """Notify once for an additional scanner or UUID registration."""
    data = _integration_data(hass)
    key = (scanner_uuid, reason)
    if key in data["notified_registrations"]:
        return
    data["notified_registrations"].add(key)
    await hass.services.async_call(
        "persistent_notification",
        "create",
        {
            "title": "Fortag scanner registration rejected",
            "message": (
                f"Scanner {scanner_name or scanner_uuid} ({scanner_uuid}) requested "
                f"registration but Fortag currently supports one scanner. "
                f"Reason: {reason}."
            ),
            "notification_id": f"fortag_registration_rejected_{scanner_uuid}",
        },
    )


async def _publish_approval(
    hass: HomeAssistant,
    scanner_uuid: str,
    instance_id: str,
    approved: bool,
    error_code: str | None = None,
) -> None:
    """Publish a non-retained, instance-scoped approval decision."""
    payload = {
        "scanner_uuid": scanner_uuid,
        "instance_id": instance_id,
        "approved": approved,
        "lease_seconds": APPROVAL_LEASE_SECONDS if approved else 0,
        "issued_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    if error_code:
        payload["error_code"] = error_code
    await mqtt.async_publish(
        hass,
        f"fortag/scanners/{scanner_uuid}/instances/{instance_id}/approval",
        json.dumps(payload),
        qos=1,
        retain=False,
    )


async def _approval_loop(hass: HomeAssistant) -> None:
    """Renew approval and prune abandoned retained instance records."""
    data = _integration_data(hass)
    while True:
        try:
            now = time.monotonic()
            adopted_uuid = data["adopted_uuid"]
            active_instance = data["active_instance"]
            if adopted_uuid and active_instance:
                record = data["instances"].get((adopted_uuid, active_instance))
                if record and now - record["received_at"] < STALE_INSTANCE_SECONDS:
                    await _publish_approval(hass, adopted_uuid, active_instance, True)

            for key, record in list(data["instances"].items()):
                if now < record["prune_at"]:
                    continue
                scanner_uuid, instance_id = key
                await mqtt.async_publish(
                    hass,
                    f"fortag/discovery/{scanner_uuid}/instances/{instance_id}",
                    "",
                    qos=1,
                    retain=True,
                )
                del data["instances"][key]
                if key == (data["adopted_uuid"], data["active_instance"]):
                    data["active_instance"] = None
        except asyncio.CancelledError:
            raise
        except Exception:  # MQTT outages must not terminate lease renewal forever.
            _LOGGER.exception("Fortag approval maintenance failed; retrying")
        await asyncio.sleep(APPROVAL_INTERVAL)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up global resources and import legacy YAML configuration."""
    _LOGGER.info("Loading Fortag integration")
    data = _integration_data(hass)

    if not data["globals_registered"]:
        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    "/fortag_scanner/static",
                    hass.config.path("custom_components/fortag_scanner/www"),
                    True,
                )
            ]
        )
        websocket_api.async_register_command(hass, websocket_get_state)
        websocket_api.async_register_command(hass, websocket_rename_host)
        websocket_api.async_register_command(hass, websocket_rename_scanner)
        websocket_api.async_register_command(hass, websocket_acknowledge)
        websocket_api.async_register_command(hass, websocket_set_range)
        websocket_api.async_register_command(hass, websocket_scan_now)
        data["globals_registered"] = True

    if DOMAIN in config:
        _LOGGER.warning(
            "Importing legacy Fortag YAML configuration; remove 'fortag_scanner:' "
            "from configuration.yaml after the config entry is created"
        )
        hass.async_create_task(
            hass.config_entries.flow.async_init(
                DOMAIN, context={"source": SOURCE_IMPORT}, data={}
            )
        )
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Fortag from a config entry."""
    _LOGGER.info("Setting up Fortag config entry %s", entry.entry_id)
    data = _integration_data(hass)
    data["entry"] = entry
    data["adopted_uuid"] = entry.data.get("scanner_uuid")

    if not await mqtt.async_wait_for_mqtt_client(hass):
        raise ConfigEntryNotReady("Home Assistant MQTT client is not available")

    async def instance_received(msg) -> None:
        """Register presence and arbitrate the single active scanner."""
        parts = _topic_parts(msg.topic)
        if len(parts) != 5:
            return
        scanner_uuid, instance_id = parts[2], parts[4]
        key = (scanner_uuid, instance_id)
        if not msg.payload:
            data["instances"].pop(key, None)
            if key == (data["adopted_uuid"], data["active_instance"]):
                data["active_instance"] = None
            return
        try:
            payload = json.loads(msg.payload)
        except (TypeError, json.JSONDecodeError):
            _LOGGER.warning("Ignoring invalid Fortag presence on %s", msg.topic)
            return
        if payload.get("scanner_uuid") != scanner_uuid or payload.get("instance_id") != instance_id:
            _LOGGER.warning("Ignoring Fortag presence whose payload IDs do not match its topic")
            return

        now = time.monotonic()
        if payload.get("status") == "offline":
            updated_at = payload.get("updated_at")
            age = 0.0
            if updated_at:
                with suppress(ValueError):
                    timestamp = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
                    age = max(0.0, (datetime.now(timezone.utc) - timestamp).total_seconds())
            data["instances"][key] = {
                "payload": payload,
                "received_at": now,
                "prune_at": now + max(0.0, PRUNE_INSTANCE_SECONDS - age),
            }
            if key == (data["adopted_uuid"], data["active_instance"]):
                data["active_instance"] = None
                state = dict(data["latest_state"] or {"hosts": []})
                state["scanner_status"] = "offline"
                state["availability_updated_at"] = payload.get("updated_at")
                data["latest_state"] = state
            return

        data["instances"][key] = {
            "payload": payload,
            "received_at": now,
            "prune_at": now + PRUNE_INSTANCE_SECONDS,
        }
        adopted_uuid = data["adopted_uuid"]
        if adopted_uuid is None:
            data["adopted_uuid"] = scanner_uuid
            adopted_uuid = scanner_uuid
            hass.config_entries.async_update_entry(
                entry, data={**entry.data, "scanner_uuid": scanner_uuid}
            )
            _LOGGER.info("Adopted first Fortag scanner %s", scanner_uuid)

        if scanner_uuid != adopted_uuid:
            await _publish_approval(
                hass, scanner_uuid, instance_id, False, "additional_scanner"
            )
            await _notify_registration_rejected(
                hass,
                scanner_uuid,
                payload.get("scanner_name", scanner_uuid),
                "an active scanner is already adopted",
            )
            return

        active_instance = data["active_instance"]
        if active_instance and active_instance != instance_id:
            active = data["instances"].get((scanner_uuid, active_instance))
            if active and now - active["received_at"] < STALE_INSTANCE_SECONDS:
                await _publish_approval(
                    hass, scanner_uuid, instance_id, False, "uuid_in_use"
                )
                await _notify_registration_rejected(
                    hass,
                    scanner_uuid,
                    payload.get("scanner_name", scanner_uuid),
                    "the scanner UUID is already active",
                )
                return

        data["active_instance"] = instance_id
        await _publish_approval(hass, scanner_uuid, instance_id, True)

    async def operational_message_received(msg) -> None:
        """Cache operational messages only for the adopted scanner."""
        parts = _topic_parts(msg.topic)
        if len(parts) != 4 or parts[2] != data["adopted_uuid"]:
            return
        try:
            payload = json.loads(msg.payload)
        except (json.JSONDecodeError, TypeError):
            _LOGGER.warning("Ignoring invalid JSON on Fortag topic %s", msg.topic)
            return
        if payload.get("instance_id") not in (None, data["active_instance"]):
            return
        message_type = parts[3]
        if message_type == "state":
            if payload.get("api_version") != SUPPORTED_MQTT_API_VERSION:
                _LOGGER.warning(
                    "Fortag MQTT API version %s is unsupported; expected %s",
                    payload.get("api_version"),
                    SUPPORTED_MQTT_API_VERSION,
                )
            data["latest_state"] = payload
        elif message_type == "progress":
            data["latest_progress"] = payload
            hass.bus.async_fire("fortag_scanner_progress", payload)
        elif message_type == "availability":
            state = dict(data["latest_state"] or {"hosts": []})
            state["scanner_status"] = payload.get("status", "offline")
            state["availability_updated_at"] = payload.get("updated_at")
            data["latest_state"] = state
        elif message_type == "alert":
            await _handle_alert(hass, payload)

    async def command_result_received(msg) -> None:
        """Resolve the WebSocket request correlated to a scanner command."""
        parts = _topic_parts(msg.topic)
        if len(parts) != 5 or parts[2] != data["adopted_uuid"]:
            return
        try:
            payload = json.loads(msg.payload)
        except (json.JSONDecodeError, TypeError):
            _LOGGER.warning("Ignoring invalid Fortag command result JSON")
            return
        if payload.get("status") == "accepted":
            return
        command_id = payload.get("command_id")
        future = data["pending_commands"].get(command_id)
        if future and not future.done():
            future.set_result(payload)

    unsubscribers = []
    try:
        unsubscribers.append(
            await mqtt.async_subscribe(hass, DISCOVERY_INSTANCE_TOPIC, instance_received, qos=1)
        )
        for topic in (ALERT_TOPIC, STATE_TOPIC, PROGRESS_TOPIC, AVAILABILITY_TOPIC):
            unsubscribers.append(
                await mqtt.async_subscribe(hass, topic, operational_message_received)
            )
        unsubscribers.append(
            await mqtt.async_subscribe(
                hass, COMMAND_RESULT_TOPIC, command_result_received, qos=1
            )
        )
        await panel_custom.async_register_panel(
            hass,
            frontend_url_path=PANEL_URL,
            webcomponent_name="fortag-scanner-panel",
            sidebar_title="Network Scanner",
            sidebar_icon="mdi:shield-search",
            module_url="/fortag_scanner/static/fortag-panel.js?v=1.1.1b2",
            config={},
            require_admin=True,
        )
    except Exception:
        for unsubscribe in unsubscribers:
            unsubscribe()
        raise

    data["unsubscribers"] = unsubscribers
    data["approval_task"] = hass.async_create_task(_approval_loop(hass))
    return True


async def _handle_alert(hass: HomeAssistant, payload: dict) -> None:
    """Create a persistent notification for a scanner alert."""
    alert_type = payload.get("type")
    mac = payload.get("mac")
    if alert_type == "new_host":
        ip = payload.get("ip", "unknown")
        title = "Security Alert: New Host"
        message = f"New device detected on network: {ip} ({mac})"
        notification_id = f"fortag_new_host_{mac}"
        panel_link = _panel_link(mac)
    elif alert_type == "new_port":
        port = payload.get("port")
        protocol = payload.get("protocol")
        title = "Security Alert: New Port"
        message = f"New open port detected on {mac}: {port}/{protocol}"
        notification_id = f"fortag_new_port_{mac}_{port}"
        panel_link = _panel_link(mac, port, protocol)
    else:
        return
    await hass.services.async_call(
        "persistent_notification",
        "create",
        {
            "message": f"{message}\n\n[Open in Network Scanner]({panel_link})",
            "title": title,
            "notification_id": notification_id,
        },
    )


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a Fortag config entry."""
    data = _integration_data(hass)
    task = data.get("approval_task")
    if task:
        task.cancel()
        with suppress(asyncio.CancelledError):
            await task
    data["approval_task"] = None
    for unsubscribe in data["unsubscribers"]:
        unsubscribe()
    data["unsubscribers"] = []
    frontend.async_remove_panel(hass, PANEL_URL)
    return True


def _command_topic(hass: HomeAssistant, command: str) -> str | None:
    scanner_uuid = _integration_data(hass).get("adopted_uuid")
    if not scanner_uuid:
        return None
    return f"fortag/scanners/{scanner_uuid}/command/{command}"


async def _publish_command(
    hass: HomeAssistant, command: str, payload: dict
) -> tuple[bool, str | None]:
    topic = _command_topic(hass, command)
    if topic is None:
        return False, "No scanner adopted"
    command_id = str(uuid4())
    payload["command_id"] = command_id
    data = _integration_data(hass)
    future = asyncio.get_running_loop().create_future()
    data["pending_commands"][command_id] = future
    try:
        await mqtt.async_publish(hass, topic, json.dumps(payload), qos=1, retain=False)
        result = await asyncio.wait_for(future, timeout=15)
    except TimeoutError:
        return False, "Scanner did not acknowledge the command"
    finally:
        data["pending_commands"].pop(command_id, None)
    if result.get("status") != "completed":
        return False, result.get("message", "Scanner rejected the command")
    return True, None


async def _publish_desired_config(hass: HomeAssistant, changes: dict) -> bool:
    """Publish retained desired configuration for the adopted scanner."""
    scanner_uuid = _integration_data(hass).get("adopted_uuid")
    if not scanner_uuid:
        return False
    state = _integration_data(hass).get("latest_state") or {}
    payload = {
        "scanner_uuid": scanner_uuid,
        "scanner_name": state.get("scanner_name"),
        "scan_range": state.get("scan_range"),
        **changes,
        "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    await mqtt.async_publish(
        hass,
        f"fortag/scanners/{scanner_uuid}/desired/config",
        json.dumps(payload),
        qos=1,
        retain=True,
    )
    return True


@websocket_api.websocket_command({"type": "fortag_scanner/get_state"})
@websocket_api.async_response
async def websocket_get_state(hass, connection, msg):
    """Return cached scanner state, progress, and registration information."""
    data = _integration_data(hass)
    instance = data["instances"].get((data["adopted_uuid"], data["active_instance"]))
    connection.send_result(
        msg["id"],
        {
            "state": data["latest_state"] or {"hosts": []},
            "progress": data["latest_progress"],
            "scanner": instance["payload"] if instance else None,
        },
    )


@websocket_api.websocket_command(
    {"type": "fortag_scanner/rename", "mac": str, "name": str}
)
@websocket_api.async_response
async def websocket_rename_host(hass, connection, msg):
    success, error = await _publish_command(
        hass, "rename", {"mac": msg["mac"], "name": msg["name"]}
    )
    if not success:
        connection.send_error(msg["id"], "command_failed", error)
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {"type": "fortag_scanner/rename_scanner", "name": str}
)
@websocket_api.async_response
async def websocket_rename_scanner(hass, connection, msg):
    await _publish_desired_config(hass, {"scanner_name": msg["name"]})
    success, error = await _publish_command(
        hass, "rename_scanner", {"name": msg["name"]}
    )
    if not success:
        connection.send_error(msg["id"], "command_failed", error)
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        "type": "fortag_scanner/acknowledge",
        "mac": str,
        vol.Optional("port"): int,
        vol.Optional("protocol"): str,
    }
)
@websocket_api.async_response
async def websocket_acknowledge(hass, connection, msg):
    payload = {"mac": msg["mac"]}
    if "port" in msg:
        payload["port"] = msg["port"]
        payload["protocol"] = msg.get("protocol", "tcp")
    success, error = await _publish_command(hass, "acknowledge", payload)
    if not success:
        connection.send_error(msg["id"], "command_failed", error)
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command({"type": "fortag_scanner/set_range", "range": str})
@websocket_api.async_response
async def websocket_set_range(hass, connection, msg):
    success, error = await _publish_command(hass, "set_range", {"range": msg["range"]})
    if not success:
        connection.send_error(msg["id"], "command_failed", error)
        return
    await _publish_desired_config(hass, {"scan_range": msg["range"] or None})
    connection.send_result(msg["id"])


@websocket_api.websocket_command({"type": "fortag_scanner/scan_now"})
@websocket_api.async_response
async def websocket_scan_now(hass, connection, msg):
    success, error = await _publish_command(hass, "scan_now", {})
    if not success:
        connection.send_error(msg["id"], "command_failed", error)
        return
    connection.send_result(msg["id"])
