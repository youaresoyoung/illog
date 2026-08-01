# Auto Update — Feature Specification

## 1. Overview

Automatically checks for and downloads new releases, then **asks the user whether to install** once the download completes. Built on Electron's bundled updater (Squirrel).

## 2. Purpose and User Value

- Keep users on the latest version without hunting for a download page.
- Leave the install timing to the user so work is never interrupted.

## 3. Update Server Configuration

| Item            | Value                                                                 |
| --------------- | --------------------------------------------------------------------- |
| Updater         | Electron's built-in `autoUpdater`                                     |
| Server type     | `json`                                                                |
| Feed URL format | `https://<CLOUDFRONT_DOMAIN>/updates/<platform>/<arch>/RELEASES.json` |
| Distribution    | CloudFront (`CLOUDFRONT_DOMAIN` environment variable)                 |

### 3.1 Feed URL normalization

| Input                                                | Result                                               |
| ---------------------------------------------------- | ---------------------------------------------------- |
| Empty or whitespace                                  | `null` (updater disabled)                            |
| Ends with `.../RELEASES.json` or `.../releases.json` | Used as-is                                           |
| Anything else                                        | Trailing slashes stripped, `/RELEASES.json` appended |

## 4. Functional Requirements

| ID       | Feature                  | Description                                                               |
| -------- | ------------------------ | ------------------------------------------------------------------------- |
| FR-UP-01 | Initialize updater       | Sets the feed URL and registers update event listeners.                   |
| FR-UP-02 | Check for updates        | Checks once when the main window becomes ready to show.                   |
| FR-UP-03 | Notify update available  | Informs the renderer when a new version is found.                         |
| FR-UP-04 | Notify download complete | Informs the renderer with release information once the download finishes. |
| FR-UP-05 | Update dialog            | Asks whether to install once the download completes.                      |
| FR-UP-06 | Install now              | Quits the app and installs the update.                                    |
| FR-UP-07 | Later                    | Closes the dialog and continues the current session.                      |
| FR-UP-08 | Squirrel install events  | Quits immediately on Windows install/update/uninstall events.             |
| FR-UP-09 | Development simulation   | Allows testing the update dialog in development mode.                     |

### 4.1 Update flow

```
App start
  → check whether a feed URL is configured
  → initialize updater (skipped in development)
  → main window ready-to-show
      → checkForUpdates()
          → update-not-available : no action
          → update-available     : send 'update-available' to renderer
              → download (handled automatically by Squirrel)
              → update-downloaded : send 'update-downloaded' to renderer
                  → show update dialog
                      → "Update Now"  → quitAndInstall()
                      → "Later"       → close dialog
```

## 5. Screens and Interaction

### 5.1 Update dialog (`UpdateDialog`)

Shown only after a download completes.

| Element             | Content                                                            |
| ------------------- | ------------------------------------------------------------------ |
| Accessibility label | `Update Available`                                                 |
| Title               | `Update Available`                                                 |
| Release name        | Shown only when the server provides one                            |
| Body                | `A new version has been downloaded. Would you like to update now?` |
| Release notes       | Shown with original formatting preserved when provided             |
| Buttons             | `Update Now` (install immediately) / `Later` (close)               |

- The `update-available` event alone does not show the dialog; only download completion does.

## 6. Business Rules

| ID       | Rule                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| BR-UP-01 | In development mode the updater is not initialized and update checks are skipped.                          |
| BR-UP-02 | An empty feed URL disables the updater and only logs a warning.                                            |
| BR-UP-03 | Updates are checked **once** at app start; there is no periodic check.                                     |
| BR-UP-04 | Downloads proceed automatically without asking the user.                                                   |
| BR-UP-05 | Installation always requires user confirmation.                                                            |
| BR-UP-06 | Choosing `Later` suppresses further prompts for the current session.                                       |
| BR-UP-07 | On Windows, detecting a Squirrel install event quits the app immediately.                                  |
| BR-UP-08 | Errors during updater initialization, checking, or installing are logged only and never interrupt the app. |

## 7. Development Mode Support

| Aspect             | Behavior                                                                                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Updater            | Not initialized                                                                                                                                                            |
| Update check       | Skipped                                                                                                                                                                    |
| `quitAndInstall`   | Logs a warning and does nothing                                                                                                                                            |
| Simulation channel | `updater:simulateUpdate` — registered only in development; fires a download-complete event with a fake release (`Version 999.9.9 (Simulated)`) so the dialog can be tested |

The simulation can be invoked from the DevTools console via `window.api.updater.simulateUpdate()`.

## 8. Interface

### 8.1 IPC channels

| Channel                  | Direction       | Description                           |
| ------------------------ | --------------- | ------------------------------------- |
| `updater:quitAndInstall` | Renderer → Main | Quits the app and installs the update |
| `updater:simulateUpdate` | Renderer → Main | Development-only update simulation    |

### 8.2 Main → renderer events

| Event               | Payload                         | Description             |
| ------------------- | ------------------------------- | ----------------------- |
| `update-available`  | None                            | A new version was found |
| `update-downloaded` | `{ releaseNotes, releaseName }` | Download finished       |

Both are exposed through preload as subscriptions that return an unsubscribe function.

## 9. Related Features

- App lifecycle and windowing: [`app-shell`](../app-shell/spec.en.md)
- Code signing, notarization, and release pipeline: [`security`](../security/spec.en.md)

## 10. Current Limitations and Future Work

- There is no periodic check, so a long-running session never notices versions released after startup.
- There is no manual "check for updates" UI.
- Download progress is not displayed.
- The renderer receives `update-available` but renders nothing (empty callback).
- Update failures are logged only and never surfaced to the user.
- There is no update channel selection (stable/beta).
- The `app_updated` analytics event constant is defined but never emitted.
