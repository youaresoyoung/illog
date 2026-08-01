# Weekly Summary — Feature Specification

## 1. Overview

An analytics screen that aggregates a week's logs into **statistics, distribution, and a daily breakdown**. It supports progressive drill-down along the project / task type / subtype axes.

## 2. Purpose and User Value

- Quantify where the week's time went.
- Let the user narrow down hierarchically — "within Project A, what kind of work dominated?"

## 3. Entry Point

| Item            | Value                              |
| --------------- | ---------------------------------- |
| Route           | `/this-week`                       |
| Left navigation | `This Week` (icon `calendar_week`) |
| Screen title    | `Weekly Summary`                   |

## 4. Week Definition and Navigation

| Item        | Value                                                                            |
| ----------- | -------------------------------------------------------------------------------- |
| Week start  | Fixed to **Monday**                                                              |
| Time zone   | The user's system time zone (`Intl.DateTimeFormat().resolvedOptions().timeZone`) |
| Query range | Start to end of the week (range-overlap matching)                                |
| Date label  | `MMMM d - d, yyyy` format (e.g. `July 20 - 26, 2026`)                            |

- `Prev` / `Next` buttons move one week at a time.
- On the current week the `Next` button is disabled — **navigating into the future is not allowed**.
- Changing weeks resets the drill-down filter.

## 5. Functional Requirements

| ID         | Feature                 | Description                                                                         |
| ---------- | ----------------------- | ----------------------------------------------------------------------------------- |
| FR-WEEK-01 | Weekly stats            | Shows completed count, total logged time, project count, and average tasks per day. |
| FR-WEEK-02 | Analysis axis           | Chooses the top-level axis: `By Project` / `By Task Type` / `By Sub Type`.          |
| FR-WEEK-03 | Productivity cards      | Renders the current level's segments as a card list.                                |
| FR-WEEK-04 | Time distribution chart | Renders the current level's segments as a donut chart.                              |
| FR-WEEK-05 | Drill-down              | Clicking a segment descends to the next level.                                      |
| FR-WEEK-06 | Breadcrumb navigation   | Shows the current path and allows returning to an upper level.                      |
| FR-WEEK-07 | Daily breakdown         | Lists logs and total time per weekday.                                              |
| FR-WEEK-08 | Weekly calendar view    | Switches to a 7-day time grid.                                                      |
| FR-WEEK-09 | Week navigation         | Moves to the previous or next week.                                                 |

### 5.1 Weekly statistics (FR-WEEK-01)

| Metric              | Calculation                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| `Tasks Completed`   | Number of logs with a completion timestamp (`doneAt`)                                                |
| `Total Time Logged` | Sum of (end − start) across all logs, shown as hours with one decimal                                |
| `Projects`          | Count of distinct projects appearing in the logs                                                     |
| `Avg Tasks/Day`     | Completed count ÷ day count. Past weeks use 7; the current week uses **days elapsed** (min 1, max 7) |

### 5.2 Drill-down hierarchy (FR-WEEK-05)

| Top axis       | Level 1      | Level 2                                  | Level 3 (leaf)                         |
| -------------- | ------------ | ---------------------------------------- | -------------------------------------- |
| `By Project`   | By project   | By task type within the selected project | By subtype within the selected type    |
| `By Task Type` | By task type | By project within the selected type      | By subtype within the selected project |
| `By Sub Type`  | By subtype   | By project within the selected subtype   | — (level 2 is the leaf)                |

- Segment clicks are disabled at the leaf level.
- The breadcrumb root label reads `All Projects` / `All Task Types` / `All Sub Types` depending on the axis.

### 5.3 Segment aggregation rules

| Aspect       | Rule                                                                                |
| ------------ | ----------------------------------------------------------------------------------- |
| Aggregates   | Log count and total minutes per segment                                             |
| Percentage   | Segment minutes ÷ total minutes × 100; 0% when the total is 0                       |
| Sorting      | Total minutes descending                                                            |
| Unclassified | Logs with no project/type/subtype are grouped into an `etc` segment, colored `gray` |
| Color        | The color assigned to the project / type / subtype                                  |

### 5.4 Daily breakdown (FR-WEEK-07)

- Displays 7 days in order starting from Monday.
- Grouping is based on the **date of the log's start time**.
- Days with no logs are omitted.
- Day label format: `EEEE, MMM d` (e.g. `Monday, Jul 20`)
- The total time per day is shown alongside.

## 6. Layout

```
┌────────────────────────────────────────────────────────────┐
│ Weekly Summary       [card│calendar]  [< Prev] [Next >]    │
│ July 20 - 26, 2026                                         │
├────────────────────────────────────────────────────────────┤
│ [completed] [total time] [projects] [avg/day]              │  ← StatsSummary
├────────────────────────────────────────────────────────────┤
│ By Project | By Task Type | By Sub Type                    │  ← ViewModeSelector
├────────────────────────────────────────────────────────────┤
│ All Projects > Project: illog > Task Type: Development     │  ← breadcrumb
├──────────────────────────────────┬─────────────────────────┤
│ [productivity card list]         │ [time distribution]     │
├──────────────────────────────────┴─────────────────────────┤
│ Daily Breakdown                                            │
│  Monday, Jul 20   ─ 3h 20m                                 │
│  Tuesday, Jul 21  ─ 5h 10m                                 │
└────────────────────────────────────────────────────────────┘
```

Switching to calendar view replaces the stats, analysis, and daily breakdown with a 7-day time grid.

## 7. State Rendering

| State                     | Content                                               |
| ------------------------- | ----------------------------------------------------- |
| Loading                   | Screen title plus `Loading...` (`aria-busy="true"`)   |
| Error                     | Screen title plus a user message and a `Retry` button |
| No segments               | Current level title plus `No data available`          |
| No time data (donut)      | `No time data available`                              |
| No logs (daily breakdown) | `No tasks logged for this week`                       |

## 8. Business Rules

| ID         | Rule                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| BR-WEEK-01 | The week starts on Monday and is not user-configurable.                                                       |
| BR-WEEK-02 | Navigation into future weeks is blocked.                                                                      |
| BR-WEEK-03 | Changing the week resets the drill-down selection.                                                            |
| BR-WEEK-04 | Elapsed time is computed only when **both** start and end times exist; otherwise the log counts as 0 minutes. |
| BR-WEEK-05 | Completed count is determined by the presence of `doneAt`, not by status.                                     |
| BR-WEEK-06 | For the current week, the daily average divides by days elapsed rather than 7.                                |
| BR-WEEK-07 | No further drill-down is possible at the leaf level.                                                          |
| BR-WEEK-08 | The view mode (card/calendar) is local screen state and is not persisted.                                     |

## 9. Related Features

- Source data: [`task`](../task/spec.en.md)
- Weekly calendar rendering: [`calendar-view`](../calendar-view/spec.en.md)
- Weekly reflection input: [`weekly-reflection`](../weekly-reflection/spec.en.md)

## 10. Current Limitations and Future Work

- **The `WeeklyReflection` component is commented out on this screen and never rendered**, even though it is fully implemented.
- Page-view analytics tracking is disabled and left as a TODO comment.
- Tags cannot be used as an analysis axis.
- The week start day is not user-selectable (a code comment notes this as future work).
- Statistics cannot be exported (CSV, image, etc.).
- There is no week-over-week comparison (delta indicators).
- There are no monthly or yearly summaries.
