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
docker pull matijag/fortag:1.1.0-rc.1

docker run -d \
  --name fortag-scanner \
  --network host \
  --restart unless-stopped \
  --env-file "$HOME/fortag/fortag.env" \
  -v "$HOME/fortag/data:/app/data" \
  matijag/fortag:1.1.0-rc.1 \
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

Fortag beta releases are opt-in. Enable the integration's pre-release switch in
HACS only when testing a documented beta pair; leave it disabled to receive
stable releases such as `1.1.0`.

The current beta is a lockstep pair: HACS integration `1.1.1b1` requires
scanner `matijag/fortag:1.1.0-rc.1`, and that scanner requires the beta
integration. MQTT API v1 components cannot be mixed with this MQTT API v2
pair. Pin the immutable scanner tag while testing. The moving
`matijag/fortag:beta` tag points to the newest scanner beta; beta builds never
replace `matijag/fortag:latest`.

The current stable pair is HACS integration `1.1.0` with scanner
`matijag/fortag:1.0.17`. The `1.0` and `latest` Docker tags point to the same
stable scanner build.

Scanner `1.0.17` upgrades existing unversioned SQLite databases in place
to schema version `1`. It publishes the migrated database state and its compiled
scanner and schema versions before starting the first scan, so Home Assistant
does not temporarily display a retained payload from an older container.

## Remove

1. Remove Fortag from **Settings → Devices & services**.
2. Remove any legacy `fortag_scanner:` entry from `configuration.yaml`.
3. Remove the integration through HACS.
4. Restart Home Assistant.

Removing this integration does not delete the scanner's SQLite database.

## MQTT interface

Stable integration `1.1.0` uses MQTT API v1 under `fortag/scanner`. Beta
integration `1.1.1b1` uses MQTT API v2 UUID-scoped topics under
`fortag/scanners/{scanner_uuid}` and requires scanner `1.1.0-rc.1`. It adopts
one scanner, renews that scanner's approval lease, and prevents scanning when
Home Assistant or MQTT approval is unavailable. Additional scanners are
reported but are not yet supported in the panel.

The beta scanner stores a persistent identity in SQLite schema version `2`.
The panel header displays its name, scan range, and online/scanning/offline
status; selecting the header reveals full scanner details. Scanner replacement
is available through the integration's **Forget current scanner** option.

The host list defaults to devices identified in the latest scan and can be
switched to all historically known devices. The chosen host view, sort field,
and sort direction persist in that browser across reloads and Home Assistant
restarts; preferences are not synchronized between browsers or user profiles.

New-host and new-port notifications include an **Open in Network Scanner**
link. It opens the matching host, includes historical hosts when needed,
expands and highlights the entry, and highlights the affected port for port
alerts.

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
