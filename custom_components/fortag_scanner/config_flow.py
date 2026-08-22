"""Config flow for the Fortag Network Scanner integration."""

import logging
from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


class FortagConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Fortag."""

    VERSION = 1

    def __init__(self) -> None:
        """Initialize discovery state."""
        self._discovered_uuid: str | None = None

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        """Return the Fortag options flow."""
        return FortagOptionsFlow()

    async def _async_prepare_entry(self) -> None:
        """Assign the single integration unique ID and reject duplicates."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ):
        """Handle setup initiated by a user."""
        _LOGGER.debug("Starting Fortag user config flow")
        await self._async_prepare_entry()
        if user_input is not None:
            return self.async_create_entry(title="Fortag Network Scanner", data={})
        return self.async_show_form(step_id="user")

    async def async_step_import(
        self, import_data: dict[str, Any]
    ):
        """Import a legacy YAML configuration."""
        _LOGGER.info("Creating Fortag config entry from legacy YAML")
        await self._async_prepare_entry()
        return self.async_create_entry(title="Fortag Network Scanner", data={})

    async def async_step_mqtt(self, discovery_info: Any):
        """Handle discovery from Fortag MQTT registration traffic."""
        if isinstance(discovery_info, dict):
            self._discovered_uuid = discovery_info.get("scanner_uuid")
        else:
            self._discovered_uuid = getattr(discovery_info, "scanner_uuid", None)
        _LOGGER.info("Fortag scanner %s discovered from MQTT", self._discovered_uuid)
        await self._async_prepare_entry()
        return await self.async_step_confirm()

    async def async_step_confirm(
        self, user_input: dict[str, Any] | None = None
    ):
        """Ask the user to confirm MQTT discovery."""
        if user_input is not None:
            data = {}
            if self._discovered_uuid:
                data["scanner_uuid"] = self._discovered_uuid
            return self.async_create_entry(title="Fortag Network Scanner", data=data)
        return self.async_show_form(step_id="confirm")


class FortagOptionsFlow(config_entries.OptionsFlow):
    """Handle scanner replacement options."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None):
        """Confirm forgetting the currently adopted scanner."""
        if user_input is not None:
            if user_input.get("forget_scanner"):
                runtime = self.hass.data.get(DOMAIN, {})
                adopted_uuid = runtime.get("adopted_uuid")
                active_instance = runtime.get("active_instance")
                if adopted_uuid and active_instance:
                    from . import _publish_approval

                    await _publish_approval(
                        self.hass,
                        adopted_uuid,
                        active_instance,
                        False,
                        "scanner_forgotten",
                    )
                new_data = dict(self.config_entry.data)
                new_data.pop("scanner_uuid", None)
                self.hass.config_entries.async_update_entry(
                    self.config_entry, data=new_data
                )
                runtime["adopted_uuid"] = None
                runtime["active_instance"] = None
                runtime["latest_state"] = None
                runtime["latest_progress"] = {"status": "idle", "target": ""}
            return self.async_create_entry(title="", data={})
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({vol.Required("forget_scanner", default=False): bool}),
        )
