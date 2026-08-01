# Fortag Network Scanner for Home Assistant

![Fortag Network Scanner](brand/icon.png)

Fortag discovers devices and open ports on a private local network and presents
the results in a Home Assistant sidebar panel. This repository contains only the
Home Assistant integration and its compiled panel.

The separate Fortag scanner must be running and connected to the same MQTT
broker as Home Assistant.

## Requirements

- Home Assistant with the MQTT integration configured
- A running Fortag scanner
- HACS, for the recommended installation method

The scanner is available as the multi-architecture Docker image
[`matijag/fortag`](https://hub.docker.com/r/matijag/fortag). It needs host
networking for local device discovery and a persistent volume for its SQLite
database.

## Install with HACS

Until Fortag is included in HACS's default repositories, add it as a custom
repository:

1. Open **HACS** in Home Assistant.
2. Open the three-dot menu and select **Custom repositories**.
3. Enter `https://github.com/matijag/fortag-home-assistant`.
4. Select **Integration** as the category and add the repository.
5. Find **Fortag Network Scanner** in HACS and download it.
6. Restart Home Assistant.
7. Add the following to `configuration.yaml` and restart Home Assistant again:

   ```yaml
   fortag_scanner:
   ```

The **Network Scanner** panel will appear in the sidebar for administrators.

## Upgrade

Install the available update from HACS and restart Home Assistant when prompted.
The scanner container is versioned separately and should also be updated when a
compatible release is published.

## Beta testing

Fortag beta releases are opt-in. In HACS, enable the Fortag integration's
pre-release switch to receive versions such as `1.0.1b1`; leave it disabled to
stay on stable releases.

For coordinated testing, run the scanner with an immutable release-candidate
tag such as `matijag/fortag:1.0.17-rc.1`. The moving `matijag/fortag:beta` tag
points to the newest scanner beta. Beta builds never replace
`matijag/fortag:latest`.

The current coordinated testing pair is HACS integration `1.0.1b1` with scanner
`matijag/fortag:1.0.17-rc.1`. The current stable scanner remains `1.0.16` through
the `latest` tag.

## Remove

1. Remove `fortag_scanner:` from `configuration.yaml`.
2. Remove the integration through HACS.
3. Restart Home Assistant.

Removing this integration does not delete the scanner's SQLite database.

## MQTT interface

The integration listens for scanner state, progress, and security alerts under
`fortag/scanner` and forwards panel commands such as scan, rename, acknowledge,
and range changes back over MQTT. Scanner state reports MQTT API version `1`
and the scanner build version so compatibility is visible in the panel.

## Support

Report integration and panel problems through the
[GitHub issue tracker](https://github.com/matijag/fortag-home-assistant/issues).
Do not include MQTT passwords, private network inventories, or unredacted scan
results in issue reports.

## Licensing

Fortag's Home Assistant integration is released under the [MIT License](LICENSE).
The compiled panel contains third-party open-source software described in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
