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

## Run the scanner container

Create a private directory for the MQTT credentials and a persistent directory
for the scanner database:

```bash
mkdir -p "$HOME/fortag/data"
touch "$HOME/fortag/fortag.env"
chmod 600 "$HOME/fortag/fortag.env"
```

Open `$HOME/fortag/fortag.env` in an editor and add the MQTT account used by the
scanner. Keeping the password in this file avoids placing it in shell history or
the `docker run` command:

```dotenv
MQTT_USER=assistant
MQTT_PASSWORD=replace-with-your-mqtt-password
DB_PATH=/app/data/scanner.db
```

Start the scanner with the current beta image:

```bash
docker pull matijag/fortag:1.0.17-rc.2

docker run -d \
  --name fortag-scanner \
  --network host \
  --restart unless-stopped \
  --env-file "$HOME/fortag/fortag.env" \
  -v "$HOME/fortag/data:/app/data" \
  matijag/fortag:1.0.17-rc.2 \
  -db /app/data/scanner.db \
  -mqtt tcp://localhost:1883
```

Host networking is required for local-network discovery. If the MQTT broker is
not running on the Docker host, replace `localhost` with its reachable hostname
or IP address. Pinning the immutable release-candidate tag keeps a test system
on the same build; use `matijag/fortag:latest` only for the stable channel.

Check startup and scan activity with:

```bash
docker logs --tail=100 -f fortag-scanner
```

Users with access to the Docker daemon can inspect container environment values
and should be treated as root-equivalent. Never commit or share the populated
environment file.

## Install with HACS

Until Fortag is included in HACS's default repositories, add it as a custom
repository:

1. Open **HACS** in Home Assistant.
2. Open the three-dot menu and select **Custom repositories**.
3. Enter `https://github.com/matijag/fortag-home-assistant`.
4. Select **Integration** as the category and add the repository.
5. Find **Fortag Network Scanner** in HACS and download it.
6. Restart Home Assistant.
7. Open **Settings → Devices & services**. Select **Configure** on the discovered
   Fortag scanner, or select **Add integration** and choose
   **Fortag Network Scanner**.

The **Network Scanner** panel will appear in the sidebar for administrators.
No `configuration.yaml` change is required.

Existing YAML installations migrate automatically when `fortag_scanner:` is
present during the first restart on `1.0.1b5`. After Fortag appears under
Devices & services, remove that YAML entry to complete the migration.

## Upgrade

Install the available update from HACS and restart Home Assistant when prompted.
The scanner container is versioned separately and should also be updated when a
compatible release is published.

## Beta testing

Fortag beta releases are opt-in. In HACS, enable the Fortag integration's
pre-release switch to receive versions such as `1.0.1b5`; leave it disabled to
stay on stable releases.

For coordinated testing, run the scanner with an immutable release-candidate
tag such as `matijag/fortag:1.0.17-rc.2`. The moving `matijag/fortag:beta` tag
points to the newest scanner beta. Beta builds never replace
`matijag/fortag:latest`.

The next coordinated testing pair is HACS integration `1.0.1b5` with scanner
`matijag/fortag:1.0.17-rc.2`. The current stable scanner remains `1.0.16` through
the `latest` tag.

## Remove

1. Remove Fortag from **Settings → Devices & services**.
2. Remove any legacy `fortag_scanner:` entry from `configuration.yaml`.
3. Remove the integration through HACS.
4. Restart Home Assistant.

Removing this integration does not delete the scanner's SQLite database.

## MQTT interface

The integration listens for scanner state, progress, and security alerts under
`fortag/scanner` and forwards panel commands such as scan, rename, acknowledge,
and range changes back over MQTT. Scanner state reports MQTT API version `1`
and the scanner build version so compatibility is visible in the panel.

The host list defaults to devices identified in the latest scan and can be
switched to all historically known devices. The chosen host view, sort field,
and sort direction persist in that browser across reloads and Home Assistant
restarts; preferences are not synchronized between browsers or user profiles.

## Support

Report integration and panel problems through the
[GitHub issue tracker](https://github.com/matijag/fortag-home-assistant/issues).
Do not include MQTT passwords, private network inventories, or unredacted scan
results in issue reports.

For temporary setup diagnostics, add the following to `configuration.yaml` and
restart Home Assistant:

```yaml
logger:
  logs:
    custom_components.fortag_scanner: debug
```

The resulting lifecycle messages show whether the config flow loaded, MQTT was
available, topic subscriptions completed, and the sidebar panel registered.

## Licensing

Fortag's Home Assistant integration is released under the [MIT License](LICENSE).
The compiled panel contains third-party open-source software described in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
