# Settings / Onboarding — Feature Specification

## 1. Overview

Provides the **settings dialog** for changing app settings and the **onboarding dialog** shown automatically on first launch. Both are the same component rendered in different modes.

## 2. Purpose and User Value

- Have the user explicitly choose whether anonymous error reporting is collected (opt-in) on first launch.
- Build trust by transparently listing what is and is not collected.
- Let the choice be reversed at any time afterwards.

## 3. Entry Points

| Entry           | Condition                                                                   |
| --------------- | --------------------------------------------------------------------------- |
| Settings mode   | Clicking the gear icon at the top of the left navigation panel              |
| Onboarding mode | Shown automatically at launch when the onboarding-completed flag is `false` |

## 4. The Two Modes

| Aspect              | Settings mode            | Onboarding mode                                                                                         |
| ------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------- |
| Title               | `Settings`               | `Welcome to illog`                                                                                      |
| Accessibility label | `Settings`               | `Welcome`                                                                                               |
| Intro text          | None                     | `Before getting started, please review the anonymous error reporting settings to help improve the app.` |
| Footer button       | `Close`                  | `Get Started`                                                                                           |
| On close            | Simply closes the dialog | Marks onboarding complete, then closes                                                                  |

## 5. Functional Requirements

| ID        | Feature                | Description                                                                       |
| --------- | ---------------------- | --------------------------------------------------------------------------------- |
| FR-SET-01 | Open settings          | Opens the settings dialog when the gear icon is clicked.                          |
| FR-SET-02 | Auto-show onboarding   | Opens the dialog in onboarding mode at launch when onboarding is incomplete.      |
| FR-SET-03 | Read reporting setting | Reads whether anonymous error reporting is enabled and reflects it in the toggle. |
| FR-SET-04 | Toggle reporting       | Flips the enabled state and persists it immediately.                              |
| FR-SET-05 | Disclosure lists       | Lists the information that is and is not collected.                               |
| FR-SET-06 | Complete onboarding    | Persists the completed flag on close so onboarding never reappears.               |
| FR-SET-07 | Analytics events       | Emits analytics events when the dialog opens and when the toggle changes.         |

## 6. Settings

There is currently **one** setting.

### 6.1 Anonymous Error Reporting

| Aspect              | Value                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| Control             | Toggle switch (`role="switch"`)                                                                          |
| Default             | **Off** — explicit opt-in                                                                                |
| Accessibility label | `Anonymous Error Reporting Enable` / `Anonymous Error Reporting Disable`                                 |
| Description         | `Error information that occurs during app usage is collected anonymously to help improve app stability.` |
| Persistence         | Immediately on toggle                                                                                    |
| While loading       | Rendered semi-transparent with clicks blocked                                                            |

**Collected Information**

- App version, Electron version
- Operating system type and version
- System architecture (x64, arm64, etc.)
- Error stack traces
- Error occurrence timestamps

**Information not collected**

- Personally identifiable information (email, name, etc.)
- Local database contents
- Local file paths

**Footer notice**

`This setting can be changed at any time, and collection will stop immediately when disabled. Error reports are used solely for app improvement purposes and are identified only by a randomly generated anonymous ID.`

## 7. Business Rules

| ID        | Rule                                                                                                                   |
| --------- | ---------------------------------------------------------------------------------------------------------------------- |
| BR-SET-01 | Error reporting defaults to off; collection begins only after the user explicitly enables it.                          |
| BR-SET-02 | Toggling persists and takes effect immediately — no app restart required.                                              |
| BR-SET-03 | The error reporting setting is **coupled** to usage analytics (Umami): turning reporting off also turns analytics off. |
| BR-SET-04 | Onboarding is shown once; the completion flag is stored in the app settings table in the database.                     |
| BR-SET-05 | Closing onboarding without touching the toggle still marks it complete (leaving the setting off).                      |
| BR-SET-06 | Opening the dialog emits `settings_opened`; toggling emits `crash_report_toggled`.                                     |

## 8. Interface (IPC Channels)

| Channel                             | Arguments     | Returns                    |
| ----------------------------------- | ------------- | -------------------------- |
| `crashReport.getSettings`           | —             | `{ enabled, anonymousId }` |
| `crashReport.updateSettings`        | `{ enabled }` | `{ enabled, anonymousId }` |
| `crashReport.isOnboardingCompleted` | —             | `boolean`                  |
| `crashReport.completeOnboarding`    | —             | —                          |

These channels are registered **without the shared error wrapper** so that error reporting cannot recursively report its own errors.

## 9. Related Features

- Error reporting behavior: [`crash-report`](../crash-report/spec.en.md)
- Analytics coupling: [`usage-analytics`](../usage-analytics/spec.en.md)
- Where settings are stored: [`data-storage`](../data-storage/spec.en.md)

## 10. Current Limitations and Future Work

- Error reporting is the only setting. Theme, language, week start day, data location, and similar are not configurable.
- Onboarding is a single screen with no product tour or initial project setup step.
- There is no way to replay or reset onboarding.
- The toggle switch is an inline implementation rather than a shared component (noted as a TODO in the code).
- There are no data management settings such as backup, export, or reset.
