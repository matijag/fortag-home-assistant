# Changelog

All notable changes to the Fortag Home Assistant integration will be documented
in this file.

## 1.0.1b5

- Fixed config-flow loading on Home Assistant versions that do not export the
  newer `ConfigFlowResult` typing helper.
- Added integration lifecycle logging for config-flow startup, MQTT readiness,
  topic subscription, panel registration, unloading, and setup failures.

## 1.0.1b4

- Added UI setup through Home Assistant Devices & services, including MQTT
  discovery and single-entry enforcement.
- Added automatic import for existing `fortag_scanner:` YAML installations.
- Added clean MQTT subscription and sidebar-panel unloading.
- Added a visible, non-blocking warning for incompatible scanner versions, MQTT
  API versions, and missing backend capabilities.

## 1.0.1b3

- Added a persistent current-hosts/all-known-hosts filter, defaulting to current
  hosts.
- Persisted the selected host filter, sort field, and sort direction in the
  browser.

## 1.0.1b2

- Added ascending and descending host sorting by name, numeric IP address,
  first-detected time, and last-detected time.

## 1.0.1b1

- Added MQTT API version 1 compatibility checking.
- Displayed the scanner build and MQTT API versions in the panel.
- Published as an opt-in beta for coordinated scanner testing.

## 1.0.1

- Added the required empty YAML configuration schema.
- Corrected manifest ordering and public repository metadata for Home Assistant
  validation.
- Aligned the panel cachebuster with the integration version.

## 1.0.0

- Initial HACS distribution.
- MQTT-backed scanner state and progress display.
- Home Assistant notifications for new hosts and ports.
- Sidebar panel with scan, rename, acknowledge, and scan-range controls.
