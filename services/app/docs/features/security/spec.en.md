# Security — Feature Specification

## 1. Overview

Covers the Electron app's **process isolation, Content Security Policy (CSP), IPC exposure surface, PII scrubbing, and release signing**.

## 2. Purpose and User Value

- Prevent renderer code from reaching system resources directly.
- Block script injection and unexpected network traffic at the source.
- Ensure user data never leaks through the error-reporting pipeline.

## 3. Process Isolation

| Setting            | Value   | Purpose                                                     |
| ------------------ | ------- | ----------------------------------------------------------- |
| `contextIsolation` | `true`  | Fully separates the renderer and preload execution contexts |
| `nodeIntegration`  | `false` | Forbids direct Node.js API use in the renderer              |
| `sandbox`          | `false` | Required so preload can use `contextBridge`                 |

### 3.1 API exposure

The renderer can only use `window.api` and `window.theme`, both of which preload exposes through `contextBridge` as an **explicitly enumerated set of functions**.

| Exposure group                     | Capabilities                                                        |
| ---------------------------------- | ------------------------------------------------------------------- |
| `api.task`                         | Task create/read/update/delete and tag linking                      |
| `api.note`                         | Note read/autosave, AI reflection stream/read/delete                |
| `api.tag`                          | Tag CRUD                                                            |
| `api.project`                      | Project CRUD                                                        |
| `api.weeklyReflection`             | Weekly reflection read/save                                         |
| `api.taskType` / `api.taskSubtype` | Task type and subtype CRUD                                          |
| `api.crashReport`                  | Error reporting settings, submission, onboarding                    |
| `api.user`                         | Plan info and feature flags                                         |
| `api.analytics`                    | Event and page-view tracking                                        |
| `api.events`                       | Deep-link and update event subscriptions                            |
| `api.updater`                      | Update installation (plus a simulation channel in development only) |
| `theme`                            | OS theme change subscription                                        |

- No file system, child process, or arbitrary shell execution APIs are exposed.
- Event subscription functions return a no-op unsubscribe when the supplied callback is not a function.
- Errors thrown inside event callbacks are caught, logged as warnings, and not propagated.

## 4. Content Security Policy

A CSP is injected into every response header.

| Directive                   | Production                            | Development                                               |
| --------------------------- | ------------------------------------- | --------------------------------------------------------- |
| `default-src`               | `'self'`                              | `'self'`                                                  |
| `base-uri`                  | `'self'`                              | `'self'`                                                  |
| `script-src`                | `'self'`                              | `'self' 'unsafe-inline' 'unsafe-eval'`                    |
| `style-src`                 | `'self' 'unsafe-inline'`              | Same                                                      |
| `font-src`                  | `'self' data:`                        | Same                                                      |
| `img-src`                   | `'self' data: blob:`                  | Same                                                      |
| `connect-src`               | `'self'` plus Sentry ingest endpoints | Additionally allows the local dev server (HTTP/WebSocket) |
| `frame-src`                 | `'none'`                              | Same                                                      |
| `object-src`                | `'none'`                              | Same                                                      |
| `form-action`               | `'self'`                              | Same                                                      |
| `frame-ancestors`           | `'none'`                              | Same                                                      |
| `upgrade-insecure-requests` | Applied                               | Not applied                                               |

### 4.1 Scope

| Mode        | Target URLs                             |
| ----------- | --------------------------------------- |
| Production  | `https://*/*`, `file://*`               |
| Development | `http://*/*`, `https://*/*`, `file://*` |

- `chrome-extension://` and `devtools://` are excluded from the filter so DevTools extensions keep working.
- Failures while configuring CSP log a warning rather than halting the app.

### 4.2 Permitted external connections

| Destination                         | Purpose                   |
| ----------------------------------- | ------------------------- |
| Sentry ingest endpoints             | Crash report transmission |
| (Development) local Vite dev server | HMR                       |

> Usage analytics (Umami) is sent from the **main process**, not the renderer, so it is not constrained by `connect-src`.

## 5. IPC Security

| ID         | Rule                                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------------------- |
| SEC-IPC-01 | Only channels explicitly registered in preload can be invoked.                                                       |
| SEC-IPC-02 | IPC handler errors are caught and serialized by a shared wrapper, so raw stack traces never cross into the renderer. |
| SEC-IPC-03 | When IPC errors are forwarded to crash reporting, **every argument value is replaced with `[redacted]`**.            |
| SEC-IPC-04 | Crash report channels bypass the shared wrapper to prevent recursive reporting.                                      |
| SEC-IPC-05 | Development-only channels (update simulation) are registered only in development mode.                               |

## 6. PII Scrubbing

The rules applied immediately before crash reports are transmitted are documented in section 6 of [`crash-report`](../crash-report/spec.en.md). In summary:

- Default PII collection disabled
- `file://` request objects removed
- Stack frame absolute paths truncated to the filename
- `extra` keys containing `db` / `path` / `file` deleted
- User data reduced to the anonymous ID
- Breadcrumbs containing `file://` filtered out
- Performance tracing disabled

## 7. Input Validation

| Target         | Validation                                               |
| -------------- | -------------------------------------------------------- |
| Note link URLs | Converted into links only if URL parsing succeeds        |
| Task subtype   | Verified to belong to the target task type               |
| Tag linking    | Count limit (5) and duplicate checks                     |
| Name fields    | Normalized, then deduplicated via uniqueness constraints |

## 8. Release Security

| Aspect                      | Detail                                                                                                                             |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Code signing / notarization | The `main` branch release workflow signs and notarizes the Electron app.                                                           |
| Entitlements                | macOS entitlement definitions are maintained separately.                                                                           |
| Packaging scope             | Allowlist-based: everything is excluded from the package except build output, `package.json`, and the production environment file. |
| Runtime dependencies        | Only the app's runtime dependency graph is copied, not the whole workspace.                                                        |
| Update distribution         | Served over HTTPS via CloudFront; the update feed is JSON.                                                                         |

### 8.1 Environment variable handling

- Environment variables are loaded by probing several candidate paths, never overwriting values already set.
- A missing required variable **logs a warning and returns an empty string instead of throwing** — a module-load-time exception would kill the app before any error handler is registered.
- Whether the app is packaged is determined by checking for the asar archive in the executable path.

## 9. Related Features

- Scrubbing details: [`crash-report`](../crash-report/spec.en.md)
- Window and preload configuration: [`app-shell`](../app-shell/spec.en.md)
- Local data retention: [`data-storage`](../data-storage/spec.en.md)

## 10. Current Limitations and Future Work

- The database file is unencrypted, so anyone with device access can read it.
- There is no app lock (password or biometric).
- Without authentication there is no notion of per-user access control.
- CSP allows inline styles under `style-src`, as the styling approach requires it.
- The development CSP permits inline and eval scripts, so development builds must never be distributed.
- The deep-link interface is exposed but unhandled; URL validation rules must be defined alongside any future implementation.
