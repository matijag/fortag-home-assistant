"""The Fortag Network Scanner integration."""
import json
import logging
import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType
from homeassistant.components import mqtt, websocket_api, panel_custom, frontend
from homeassistant.components.http import StaticPathConfig

_LOGGER = logging.getLogger(__name__)

DOMAIN = "fortag_scanner"
CONFIG_SCHEMA = cv.empty_config_schema(DOMAIN)
SUPPORTED_MQTT_API_VERSION = 1

async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Fortag Scanner component."""
    
    _LOGGER.info("--- INITIALIZING FORTAG NETWORK SCANNER ---")
    
    if DOMAIN not in hass.data:
        hass.data[DOMAIN] = {
            "latest_state": None,
            "latest_progress": {"status": "idle", "target": ""}
        }

    async def message_received(msg):
        """Handle new MQTT messages."""
        try:
            # Handle state
            if msg.topic == "fortag/scanner/state":
                _LOGGER.info("Received Fortag Scanner state update")
                payload = json.loads(msg.payload)
                api_version = payload.get("api_version")
                if api_version != SUPPORTED_MQTT_API_VERSION:
                    _LOGGER.warning(
                        "Fortag scanner MQTT API version %s is not supported; expected %s",
                        api_version,
                        SUPPORTED_MQTT_API_VERSION,
                    )
                hass.data[DOMAIN]["latest_state"] = payload
                return

            # Handle progress
            if msg.topic == "fortag/scanner/progress":
                payload = json.loads(msg.payload)
                hass.data[DOMAIN]["latest_progress"] = payload
                # Broadcast progress to all WS clients
                hass.bus.async_fire("fortag_scanner_progress", payload)
                return

            # Handle alerts
            if msg.topic == "fortag/scanner/alert":
                payload = json.loads(msg.payload)
                alert_type = payload.get("type")
                mac = payload.get("mac")
                
                if alert_type == "new_host":
                    ip = payload.get("ip", "unknown")
                    await hass.services.async_call(
                        "persistent_notification",
                        "create",
                        {
                            "message": f"New device detected on network: {ip} ({mac})",
                            "title": "Security Alert: New Host",
                            "notification_id": f"fortag_new_host_{mac}",
                        }
                    )
                elif alert_type == "new_port":
                    port = payload.get("port")
                    proto = payload.get("protocol")
                    await hass.services.async_call(
                        "persistent_notification",
                        "create",
                        {
                            "message": f"New open port detected on {mac}: {port}/{proto}",
                            "title": "Security Alert: New Port",
                            "notification_id": f"fortag_new_port_{mac}_{port}",
                        }
                    )
        except Exception as e:
            _LOGGER.error("CRITICAL error in Fortag MQTT listener: %s", e)

    # Subscriptions
    await mqtt.async_subscribe(hass, "fortag/scanner/alert", message_received)
    await mqtt.async_subscribe(hass, "fortag/scanner/state", message_received)
    await mqtt.async_subscribe(hass, "fortag/scanner/progress", message_received)

    # Static Path
    await hass.http.async_register_static_paths([
        StaticPathConfig(
            "/fortag_scanner/static",
            hass.config.path("custom_components/fortag_scanner/www"),
            True,
        )
    ])

    # WebSocket Commands
    websocket_api.async_register_command(hass, websocket_get_state)
    websocket_api.async_register_command(hass, websocket_rename_host)
    websocket_api.async_register_command(hass, websocket_acknowledge)
    websocket_api.async_register_command(hass, websocket_set_range)
    websocket_api.async_register_command(hass, websocket_scan_now)

    # Register Sidebar Panel
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path="fortag-scanner",
        webcomponent_name="fortag-scanner-panel",
        sidebar_title="Network Scanner",
        sidebar_icon="mdi:shield-search",
        module_url="/fortag_scanner/static/fortag-panel.js?v=1.0.1b2",
        config={},
        require_admin=True,
    )

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
