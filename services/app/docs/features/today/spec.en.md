# Today Screen — Feature Specification

## 1. Overview

The app's default landing screen. It shows the **logs that fall within today** and lets the user create new ones. Card view and calendar view can be toggled.

## 2. Purpose and User Value

- Let the user see today's work and add a record immediately after opening the app.
- Switch to the calendar to visualize how the day's time was distributed for logs that have times.

## 3. Entry Point

| Item            | Value                           |
| --------------- | ------------------------------- |
| Route           | `/` (index route)               |
| Left navigation | `Today` (icon `calendar_today`) |
| Screen title    | `Today's Log`                   |

## 4. Query Range

The today list is fetched with the following range filter.

| Item  | Value                                |
| ----- | ------------------------------------ |
| Start | Today at `00:00:00.000` (local time) |
| End   | Today at `23:59:59.999` (local time) |

- The filter matches on **range overlap**, so a log that started yesterday and continues into today is included.
- Deleted logs are excluded.
- Sorting is created-at descending.

## 5. Functional Requirements

| ID          | Feature               | Description                                                                                  |
| ----------- | --------------------- | -------------------------------------------------------------------------------------------- |
| FR-TODAY-01 | List today's logs     | Fetches logs overlapping today's range.                                                      |
| FR-TODAY-02 | Create log            | The `Add log` button creates an empty log immediately — no form or dialog.                   |
| FR-TODAY-03 | Toggle view           | Switches between card view and calendar view.                                                |
| FR-TODAY-04 | Open detail           | Clicking a card or a calendar block opens the right-hand detail panel.                       |
| FR-TODAY-05 | Inline editing        | Title, description, status, time, project, type, and tags are editable directly on the card. |
| FR-TODAY-06 | Delete log            | Right-click context menu → `Delete` → confirmation dialog.                                   |
| FR-TODAY-07 | Empty state           | Shows guidance text when there are no logs.                                                  |
| FR-TODAY-08 | Loading / error state | Shows a loading message, and a retry button on error.                                        |

## 6. Layout

```
┌─────────────────────────────────────────────────────────┐
│ Today's Log            [card│calendar]    [+ Add log]   │  ← ContentHeader
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Card view]                    or    [Calendar view]   │
│  ┌───────────────────────┐           00 ─────────────   │
│  │ status  ·  start–end   │           01 ─────────────   │
│  │ [project][type][sub]   │           ...               │
│  │ Title                  │           09 ┌──────────┐   │
│  │ Description            │              │ log block│   │
│  │ [tag][tag]   2/5 used  │           10 └──────────┘   │
│  └───────────────────────┘           ...               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 6.1 View toggle

| Value      | Icon             | Accessibility label |
| ---------- | ---------------- | ------------------- |
| `card`     | `list`           | `Card view`         |
| `calendar` | `calendar_today` | `Calendar view`     |

The default is `card`. The selection lives in local screen state only, so it resets when the user navigates away.

## 7. State Rendering

| State                         | Content                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------- |
| Loading                       | `Loading tasks...` (`role="status"`, `aria-busy="true"`)                                      |
| Error                         | User-facing message for the error code plus a `Retry` button                                  |
| No logs (card view)           | `No tasks for today.` / `Let's add some logs to track your progress and reflect on your day!` |
| No timed logs (calendar view) | `No time-tracked tasks for today. Add start & end times to see them here.`                    |

## 8. Business Rules

| ID          | Rule                                                                                                                          |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| BR-TODAY-01 | `Add log` creates a log immediately with no input. It appears at the top of the list with title `Untitled` and status `todo`. |
| BR-TODAY-02 | Calendar view shows only logs that have **both a start and an end time**.                                                     |
| BR-TODAY-03 | Clicking a card opens the detail panel unless the click landed on an interactive element (input, button, selector, etc.).     |
| BR-TODAY-04 | List sorting is fixed to created-at descending and cannot be changed by the user.                                             |
| BR-TODAY-05 | Creating a log emits the `task_created` analytics event.                                                                      |

## 9. Related Features

- Task CRUD and card behavior: [`task`](../task/spec.en.md)
- Calendar rendering rules: [`calendar-view`](../calendar-view/spec.en.md)
- Detail panel composition: [`app-shell`](../app-shell/spec.en.md)

## 10. Current Limitations and Future Work

- Page-view analytics tracking is disabled and left as a TODO comment in the code.
- The view mode (card/calendar) is not persisted and resets when leaving the screen.
- There is no date navigation to view yesterday or a specific date (week navigation exists only on the weekly summary screen).
- There is no search or filter UI.
- The user cannot sort or group the log list.
