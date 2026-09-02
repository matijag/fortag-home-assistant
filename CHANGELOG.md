# Changelog

All notable changes to the Fortag Home Assistant integration will be documented
in this file.

## 1.1.1b5

- Re-handle notification deep links whenever Home Assistant navigates while
  the Network Scanner panel is already open, so every notification click
  expands, highlights, and scrolls to the relevant host or port.
- Display the user-assigned host name in new-host and new-port notifications
  when available, while retaining MAC and IP address fallbacks.

## 1.1.1b3

- Load the panel from a release-specific module filename and register a
  release-specific web component, preventing an already-open Home Assistant
  browser session from continuing to use an older Fortag component after an
  upgrade and restart.
- Add subtle alternating background tones to host entries, including their
  expanded detail rows, while preserving notification-link highlighting.

## 1.1.1b2

- Updated the lockstep backend requirement to scanner `1.1.0-rc.2`.
- Added **Use auto-detect** to remove a persisted range override safely and
  display the newly detected private network.
- Added actionable range errors for malformed targets, IPv6, public addresses,
  CIDRs crossing private-network boundaries, and failed local detection.
- Fixed false range-change errors after the backend had already persisted a
  valid update.
- Display only ports reported with exact Nmap state `open`; closed and filtered
  observations remain backend history rather than appearing as open services.
- Treat a reopened port as a fresh security exposure requiring acknowledgement.

## 1.1.1b1

- Added lockstep MQTT API v2 support for scanner `1.1.0-rc.1`, using persistent
  scanner UUIDs and UUID-scoped topics. MQTT API v1 backends are not compatible
  with this beta.
- Added first-scanner adoption, renewable Home Assistant approval leases,
  collision rejection, stale-presence cleanup, and notifications for additional
  or changed scanner registrations.
- Added QoS 1 command correlation with accepted and terminal results.
- Added scanner name, range, details, and online/scanning/offline state to the
  panel header, including persistent scanner renaming.
- Added a confirmed **Forget current scanner** integration option for scanner
  replacement.
- Updated the frontend compatibility check to require scanner `1.1.0-rc.1`,
  MQTT API v2, and the matching `1.1.1b1` integration.

## 1.1.0

- Added UI setup through Devices & services, MQTT discovery, legacy YAML
  migration, and clean config-entry unloading.
- Added sorting by name, numeric IP address, first detection, and last detection
  in both directions.
- Added persistent current-host and all-known-host views.
- Added compatibility warnings for scanner versions, MQTT API versions, and
  missing backend capabilities.
- Fixed config-flow loading on Home Assistant releases without the
  `ConfigFlowResult` typing export and added lifecycle diagnostics.
- Added notification links that reveal, expand, highlight, and scroll to the
  affected host or port.
- Promoted scanner `1.0.17` as the stable compatible backend.

## 1.0.1b6

- Added links from new-host and new-port notifications to the matching Network
  Scanner entry.
- Added validated host and port deep links that reveal, expand, highlight, and
  scroll to the affected entry after scanner state loads.

## Scanner 1.0.17-rc.3 compatibility

- Updated the documented beta pairing to HACS integration `1.0.1b5` and scanner
  `1.0.17-rc.3`.
- Documented the scanner's pre-scan retained-state publication and additive
  MQTT `schema_version` field.

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
