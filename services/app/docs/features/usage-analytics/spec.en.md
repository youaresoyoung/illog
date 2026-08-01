# Usage Analytics — Feature Specification

## 1. Overview

Collects app usage events and sends them to **Umami Cloud**. There is no separate consent control — it follows the crash reporting opt-in setting.

## 2. Purpose and User Value

- Understand which features are actually used, to prioritize product work.
- Collect aggregate usage patterns only, without personal identification.

## 3. Terminology

| Term            | Definition                                                                |
| --------------- | ------------------------------------------------------------------------- |
| Event           | A record of one user action, consisting of a name and optional properties |
| Page view       | A record of a screen being viewed                                         |
| Opt-in coupling | Reusing the crash reporting consent state for analytics                   |

## 4. Destination and Configuration

| Item              | Value                                                                         |
| ----------------- | ----------------------------------------------------------------------------- |
| Collector         | Umami Cloud                                                                   |
| Default host      | `https://cloud.umami.is` (override via the `UMAMI_HOST` environment variable) |
| Site ID           | `UMAMI_WEBSITE_ID` environment variable                                       |
| Transport         | HTTP tracker (`HttpTracker` from `@illog/analytics`)                          |
| User-Agent        | `illog/<app version> (<platform>; <arch>)`                                    |
| Hostname context  | `illog-electron`                                                              |
| Language          | App locale                                                                    |
| Screen resolution | `0x0` (not collected)                                                         |

## 5. Functional Requirements

| ID       | Feature                  | Description                                                             |
| -------- | ------------------------ | ----------------------------------------------------------------------- |
| FR-UA-01 | Initialize tracker       | Creates the tracker and sets base context at app start.                 |
| FR-UA-02 | Sync opt-in              | Enables or disables the tracker based on the crash reporting setting.   |
| FR-UA-03 | React to setting changes | Changing the crash reporting setting immediately toggles analytics too. |
| FR-UA-04 | Track event              | Sends an event with a name and optional properties.                     |
| FR-UA-05 | Track page view          | Sends a page view with a URL and optional title.                        |
| FR-UA-06 | Flush on quit            | Flushes pending events before the app exits.                            |

## 6. Events Actually Emitted

These are the events the code **actually sends** today.

| Event                  | Trigger                                 | Properties                    |
| ---------------------- | --------------------------------------- | ----------------------------- |
| `app_launched`         | Once at app start                       | `version`, `platform`, `arch` |
| `task_created`         | On successful task creation             | None                          |
| `reflection_generated` | When AI reflection generation completes | None                          |
| `settings_opened`      | When the settings dialog opens          | None                          |
| `crash_report_toggled` | When error reporting is toggled         | `enabled`                     |

## 7. Defined but Unused Events

`@illog/analytics` defines the following event constants, none of which the desktop app emits.

| Category          | Events                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| App lifecycle     | `app_updated`                                                                                                       |
| Navigation        | `page_viewed`, `tab_switched`                                                                                       |
| Task              | `task_completed`, `task_deleted`, `task_time_started`, `task_time_stopped`                                          |
| Project           | `project_created`, `project_deleted`                                                                                |
| Tag               | `tag_created`, `tag_deleted`                                                                                        |
| Task type         | `task_type_created`, `task_subtype_created`                                                                         |
| Note / reflection | `note_auto_saved`, `reflection_deleted`                                                                             |
| Weekly reflection | `weekly_reflection_saved`                                                                                           |
| Settings          | `theme_changed`                                                                                                     |
| Filter            | `filter_applied`                                                                                                    |
| Web-only          | `download_clicked`, `header_nav_clicked`, `footer_link_clicked`, `feature_section_viewed`, `carousel_slide_changed` |

> The web-only events belong to the marketing site (`services/web`) and are unrelated to the desktop app.

## 8. Business Rules

| ID       | Rule                                                                                            |
| -------- | ----------------------------------------------------------------------------------------------- |
| BR-UA-01 | Analytics has **no independent consent control**; it inherits the crash reporting opt-in state. |
| BR-UA-02 | When crash reporting is disabled the tracker is disabled and no events are sent.                |
| BR-UA-03 | Changing the crash reporting setting synchronizes analytics immediately through a callback.     |
| BR-UA-04 | Screen resolution is always sent as `0x0`; the real value is never collected.                   |
| BR-UA-05 | Event property values may only be strings, numbers, or booleans.                                |
| BR-UA-06 | On quit, the tracker is flushed before the crash reporting service shuts down.                  |

## 9. Interface (IPC Channels)

| Channel              | Arguments            | Returns |
| -------------------- | -------------------- | ------- |
| `analytics.track`    | `eventName`, `data?` | —       |
| `analytics.pageView` | `url`, `title?`      | —       |

The renderer calls these through the `useAnalytics()` hook (`trackEvent`, `trackPageView`) or `window.api.analytics`.

## 10. Related Features

- Opt-in setting: [`settings-onboarding`](../settings-onboarding/spec.en.md)
- Owner of the opt-in state: [`crash-report`](../crash-report/spec.en.md)

## 11. Current Limitations and Future Work

- **Page-view tracking is disabled on every screen.** The `usePageView` hook exists but is commented out as a TODO on the Today, This Week, and History screens.
- Most defined event constants are never emitted (see section 7).
- Analytics has no independent consent control, so users cannot enable crash reporting while disabling analytics.
- The settings dialog's disclosure lists only crash information and does not mention analytics events.
- Users have no way to review what was sent or request deletion.
- No retry policy is defined for failed event transmission.
