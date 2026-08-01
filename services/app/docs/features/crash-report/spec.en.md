# Crash Reporting — Feature Specification

## 1. Overview

Collects application errors **anonymously and forwards them to Sentry**. It is off by default and transmits only after the user explicitly opts in. Personally identifiable information and local paths are stripped before sending.

## 2. Purpose and User Value

- Let users contribute to app stability without filing a report themselves.
- Reduce privacy concerns by making it explicit what is and is not transmitted.

## 3. Terminology

| Term         | Definition                                                                       |
| ------------ | -------------------------------------------------------------------------------- |
| Opt-in       | Collection begins only after explicit user consent                               |
| Anonymous ID | A randomly generated UUID used to identify a user; never linked to personal data |
| Scrubbing    | Stripping sensitive data before transmission                                     |

## 4. Data Model

Stored as key-value rows in the `app_setting` table.

| Key                    | Value         | Description                              |
| ---------------------- | ------------- | ---------------------------------------- |
| `crash_report_enabled` | `'0'` / `'1'` | Whether error reporting is enabled       |
| `anonymous_id`         | UUID string   | Anonymous user identifier                |
| `onboarding_completed` | `'0'` / `'1'` | Whether first-run onboarding is complete |

- `anonymous_id` is **generated and stored automatically the first time settings are read**.
- If `crash_report_enabled` is absent, reporting is treated as disabled.

## 5. Functional Requirements

| ID       | Feature                     | Description                                                                                    |
| -------- | --------------------------- | ---------------------------------------------------------------------------------------------- |
| FR-CR-01 | Early Sentry init           | Initializes Sentry before the app is ready; transmission is gated by a separate flag.          |
| FR-CR-02 | Apply settings              | Reads the user setting after the database connects and decides whether transmission is active. |
| FR-CR-03 | Read settings               | Returns the current enabled state and anonymous ID.                                            |
| FR-CR-04 | Update settings             | Changes the enabled state and applies it immediately.                                          |
| FR-CR-05 | Manual report               | Sends an error passed from the renderer to Sentry.                                             |
| FR-CR-06 | Automatic IPC error capture | Automatically sends errors raised in IPC handlers, tagged with the channel name.               |
| FR-CR-07 | Renderer global errors      | Detects unhandled errors and promise rejections.                                               |
| FR-CR-08 | Render crash handling       | Catches React render errors in an error boundary and shows a fallback screen.                  |
| FR-CR-09 | Crash report dialog         | Asks non-opted-in users whether to send the report.                                            |
| FR-CR-10 | Onboarding state            | Reads and records whether first-run onboarding is complete.                                    |
| FR-CR-11 | Flush on quit               | Flushes pending events for up to 2 seconds before the app exits.                               |

### 5.1 Error paths

| Origin                     | Detection                  | Opt-in ON                             | Opt-in OFF                        |
| -------------------------- | -------------------------- | ------------------------------------- | --------------------------------- |
| Main process IPC handler   | Shared error wrapper       | Sent automatically (with channel tag) | Not sent                          |
| Renderer global error      | `window` `error` event     | Sent automatically                    | Crash dialog shown                |
| Renderer promise rejection | `unhandledrejection` event | Sent automatically                    | Crash dialog shown                |
| React render error         | Error boundary             | Sent automatically                    | Crash dialog plus fallback screen |

## 6. Privacy Rules

The following are applied immediately before transmission (`beforeSend`).

| ID       | Rule                                                                                                           |
| -------- | -------------------------------------------------------------------------------------------------------------- |
| PR-CR-01 | When the transmission flag is off the event is **dropped**.                                                    |
| PR-CR-02 | Events without release information are dropped.                                                                |
| PR-CR-03 | Sentry's default PII collection (`sendDefaultPii`) is disabled.                                                |
| PR-CR-04 | If the request URL starts with `file://`, the entire request object is removed.                                |
| PR-CR-05 | Absolute paths in stack frames are truncated to **the filename only**, and the absolute-path field is deleted. |
| PR-CR-06 | Any `extra` entry whose key contains `db`, `path`, or `file` is deleted.                                       |
| PR-CR-07 | User data is reduced to the anonymous ID; everything else is removed.                                          |
| PR-CR-08 | Breadcrumbs containing `file://` are filtered out.                                                             |
| PR-CR-09 | When sending IPC errors, every argument value is replaced with `[redacted]`.                                   |
| PR-CR-10 | Performance tracing is disabled (sample rate 0) — the integration is crash-only.                               |
| PR-CR-11 | Breadcrumbs are capped at 50.                                                                                  |

### 6.1 Tags sent with events

| Tag                | Value                                               |
| ------------------ | --------------------------------------------------- |
| `arch`             | Process architecture                                |
| `electron_version` | Electron version                                    |
| `os`               | Platform                                            |
| `release`          | `<app name>@<app version>` (set only when opted in) |
| `ipc_channel`      | Channel name, for IPC errors                        |

## 7. Screens and Interaction

### 7.1 Crash report dialog (`CrashReportDialog`)

Shown when an error occurs while the user has not opted in.

| Element     | Content                                                                            |
| ----------- | ---------------------------------------------------------------------------------- |
| Role        | `alertdialog`                                                                      |
| Title       | `A crash has occurred`                                                             |
| Description | `Would you like to send an anonymous crash report to help improve the app?`        |
| Disclosure  | App version and OS information / crash location (stack trace) / crash time         |
| Notice      | `Personal identifiable information, local data, and file paths are not collected.` |
| Buttons     | `Don't send` / `Send report`                                                       |

Choosing `Send report` sends only that single error; it does not enable the setting.

### 7.2 Render crash fallback (`CrashErrorBoundary`)

| Element | Content                                                                                     |
| ------- | ------------------------------------------------------------------------------------------- |
| Text    | `Something went wrong` / `An unexpected error occurred. Please reload the app to continue.` |
| Button  | `Reload App` (reloads the window)                                                           |

## 8. Business Rules

| ID       | Rule                                                                                                                              |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| BR-CR-01 | Sentry is always initialized, but transmission is gated by an internal flag — initialization must happen before the app is ready. |
| BR-CR-02 | When opt-in is off, no event is ever transmitted.                                                                                 |
| BR-CR-03 | Enabling opt-in immediately sets the release tag and the anonymous user ID.                                                       |
| BR-CR-04 | The anonymous ID is generated on the first settings read, regardless of opt-in state.                                             |
| BR-CR-05 | Development mode uses a separate development DSN and sets the environment to `development`.                                       |
| BR-CR-06 | Crash report IPC channels bypass the shared error wrapper to prevent recursive reporting.                                         |
| BR-CR-07 | Pending events are flushed for up to 2 seconds on app quit.                                                                       |

## 9. Interface (IPC Channels)

| Channel                             | Arguments             | Returns                    |
| ----------------------------------- | --------------------- | -------------------------- |
| `crashReport.getSettings`           | —                     | `{ enabled, anonymousId }` |
| `crashReport.updateSettings`        | `{ enabled }`         | `{ enabled, anonymousId }` |
| `crashReport.sendReport`            | `{ message, stack? }` | —                          |
| `crashReport.isOnboardingCompleted` | —                     | `boolean`                  |
| `crashReport.completeOnboarding`    | —                     | —                          |

## 10. Related Features

- Settings UI: [`settings-onboarding`](../settings-onboarding/spec.en.md)
- Analytics coupling: [`usage-analytics`](../usage-analytics/spec.en.md)
- Error classification and toasts: [`error-handling`](../error-handling/spec.en.md)

## 11. Current Limitations and Future Work

- Users cannot review their own submission history.
- Users cannot attach extra context such as reproduction steps when an error occurs.
- Choosing to send from the crash dialog is not remembered — the next error asks again.
- There is no dedicated path for hard (native) crashes that kill the main process itself.
- There is no retry or queueing policy when transmission fails.
