"""The Fortag Network Scanner integration."""
import json
import logging
from urllib.parse import urlencode

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
STATE_TOPIC = "fortag/scanner/state"
PROGRESS_TOPIC = "fortag/scanner/progress"
ALERT_TOPIC = "fortag/scanner/alert"


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
        },
    )


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
        websocket_api.async_register_command(hass, websocket_acknowledge)
        websocket_api.async_register_command(hass, websocket_set_range)
        websocket_api.async_register_command(hass, websocket_scan_now)
        data["globals_registered"] = True
        _LOGGER.debug("Registered Fortag static path and WebSocket commands")

    if DOMAIN in config:
        _LOGGER.warning(
            "Importing legacy Fortag YAML configuration; remove 'fortag_scanner:' "
            "from configuration.yaml after the config entry is created"
        )
        hass.async_create_task(
            hass.config_entries.flow.async_init(
                DOMAIN,
                context={"source": SOURCE_IMPORT},
                data={},
            )
        )

    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Fortag from a config entry."""
    _LOGGER.info("Setting up Fortag config entry %s", entry.entry_id)
    data = _integration_data(hass)

    if not await mqtt.async_wait_for_mqtt_client(hass):
        _LOGGER.warning("Fortag setup is waiting for the Home Assistant MQTT client")
        raise ConfigEntryNotReady("Home Assistant MQTT client is not available")

    _LOGGER.debug("Home Assistant MQTT client is available to Fortag")

    async def message_received(msg):
        """Handle new MQTT messages."""
        try:
            # Handle state
            if msg.topic == STATE_TOPIC:
                _LOGGER.info("Received Fortag Scanner state update")
                payload = json.loads(msg.payload)
                api_version = payload.get("api_version")
                if api_version != SUPPORTED_MQTT_API_VERSION:
                    _LOGGER.warning(
                        "Fortag scanner MQTT API version %s is not supported; expected %s",
                        api_version,
                        SUPPORTED_MQTT_API_VERSION,
                    )
                data["latest_state"] = payload
                return

            # Handle progress
            if msg.topic == PROGRESS_TOPIC:
                payload = json.loads(msg.payload)
                data["latest_progress"] = payload
                # Broadcast progress to all WS clients
                hass.bus.async_fire("fortag_scanner_progress", payload)
                return

            # Handle alerts
            if msg.topic == ALERT_TOPIC:
                payload = json.loads(msg.payload)
                alert_type = payload.get("type")
                mac = payload.get("mac")
                
                if alert_type == "new_host":
                    ip = payload.get("ip", "unknown")
                    panel_link = _panel_link(mac)
                    await hass.services.async_call(
                        "persistent_notification",
                        "create",
                        {
                            "message": (
                                f"New device detected on network: {ip} ({mac})\n\n"
                                f"[Open in Network Scanner]({panel_link})"
                            ),
                            "title": "Security Alert: New Host",
                            "notification_id": f"fortag_new_host_{mac}",
                        }
                    )
                elif alert_type == "new_port":
                    port = payload.get("port")
                    proto = payload.get("protocol")
                    panel_link = _panel_link(mac, port, proto)
                    await hass.services.async_call(
                        "persistent_notification",
                        "create",
                        {
                            "message": (
                                f"New open port detected on {mac}: {port}/{proto}\n\n"
                                f"[Open in Network Scanner]({panel_link})"
                            ),
                            "title": "Security Alert: New Port",
                            "notification_id": f"fortag_new_port_{mac}_{port}",
                        }
                    )
        except Exception:
            _LOGGER.exception("Error handling Fortag MQTT message on %s", msg.topic)

    unsubscribers = []
    try:
        unsubscribers.extend(
            [
                await mqtt.async_subscribe(hass, ALERT_TOPIC, message_received),
                await mqtt.async_subscribe(hass, STATE_TOPIC, message_received),
                await mqtt.async_subscribe(hass, PROGRESS_TOPIC, message_received),
            ]
        )
        _LOGGER.info(
            "Subscribed to Fortag MQTT topics: %s, %s, %s",
            STATE_TOPIC,
            PROGRESS_TOPIC,
            ALERT_TOPIC,
        )

        await panel_custom.async_register_panel(
            hass,
            frontend_url_path=PANEL_URL,
            webcomponent_name="fortag-scanner-panel",
            sidebar_title="Network Scanner",
            sidebar_icon="mdi:shield-search",
            module_url="/fortag_scanner/static/fortag-panel.js?v=1.0.1b6",
            config={},
            require_admin=True,
        )
        _LOGGER.info("Registered Fortag sidebar panel at /%s", PANEL_URL)
    except Exception:
        for unsubscribe in unsubscribers:
            unsubscribe()
        _LOGGER.exception("Failed to set up Fortag config entry %s", entry.entry_id)
        raise

    data["unsubscribers"] = unsubscribers

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a Fortag config entry."""
    data = _integration_data(hass)
    for unsubscribe in data["unsubscribers"]:
        unsubscribe()
    data["unsubscribers"] = []
    frontend.async_remove_panel(hass, PANEL_URL)
    _LOGGER.info("Unloaded Fortag config entry %s", entry.entry_id)
    return True


@websocket_api.websocket_command({
    "type": "fortag_scanner/get_state",
})
@websocket_api.async_response
async def websocket_get_state(hass, connection, msg):
    """Return the cached state and current progress."""
    state = hass.data[DOMAIN].get("latest_state")
    progress = hass.data[DOMAIN].get("latest_progress")
    connection.send_result(msg["id"], {
        "state": state or {"hosts": []},
        "progress": progress
    })

@websocket_api.websocket_command({
    "type": "fortag_scanner/rename",
    "mac": str,
    "name": str,
})
@websocket_api.async_response
async def websocket_rename_host(hass, connection, msg):
    await mqtt.async_publish(hass, "fortag/scanner/command/rename", json.dumps({"mac": msg["mac"], "name": msg["name"]}))
    connection.send_result(msg["id"])

@websocket_api.websocket_command({
    "type": "fortag_scanner/acknowledge",
    "mac": str,
    vol.Optional("port"): int,
    vol.Optional("protocol"): str,
})
@websocket_api.async_response
async def websocket_acknowledge(hass, connection, msg):
    payload = {"mac": msg["mac"]}
    if "port" in msg:
        payload["port"] = msg["port"]
        payload["protocol"] = msg.get("protocol", "tcp")
    await mqtt.async_publish(hass, "fortag/scanner/command/acknowledge", json.dumps(payload))
    connection.send_result(msg["id"])

@websocket_api.websocket_command({
    "type": "fortag_scanner/set_range",
    "range": str,
})
@websocket_api.async_response
async def websocket_set_range(hass, connection, msg):
    await mqtt.async_publish(hass, "fortag/scanner/command/set_range", json.dumps({"range": msg["range"]}))
    connection.send_result(msg["id"])

@websocket_api.websocket_command({
    "type": "fortag_scanner/scan_now",
})
@websocket_api.async_response
async def websocket_scan_now(hass, connection, msg):
    await mqtt.async_publish(hass, "fortag/scanner/command/scan_now", "")
    connection.send_result(msg["id"])
