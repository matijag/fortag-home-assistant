"""Config flow for the Fortag Network Scanner integration."""

import logging
from typing import Any

from homeassistant import config_entries

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


class FortagConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Fortag."""

    VERSION = 1

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
        """Handle discovery from Fortag MQTT state traffic."""
        _LOGGER.info("Fortag scanner discovered from retained MQTT state")
        await self._async_prepare_entry()
        return await self.async_step_confirm()

    async def async_step_confirm(
        self, user_input: dict[str, Any] | None = None
    ):
        """Ask the user to confirm MQTT discovery."""
        if user_input is not None:
            return self.async_create_entry(title="Fortag Network Scanner", data={})
        return self.async_show_form(step_id="confirm")
