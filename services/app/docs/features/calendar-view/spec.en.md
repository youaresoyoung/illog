# Calendar View — Feature Specification

## 1. Overview

Renders logs that have start and end times as **blocks on a time axis**. It comes in two forms: the daily calendar on the Today screen and the 7-day calendar on the weekly summary screen.

## 2. Purpose and User Value

- See how a day or a week was actually carved up, visually rather than as a list.
- Spot empty stretches and overlapping work at a glance.

## 3. Variants

| Variant         | Location                      | Columns | Current-time indicator       |
| --------------- | ----------------------------- | ------- | ---------------------------- |
| Daily calendar  | Today screen (`/`)            | 1       | Always shown                 |
| Weekly calendar | Weekly summary (`/this-week`) | 7       | Only on the column for today |

## 4. Functional Requirements

| ID        | Feature               | Description                                                                              |
| --------- | --------------------- | ---------------------------------------------------------------------------------------- |
| FR-CAL-01 | Render time grid      | Draws a 24-hour time axis with gridlines.                                                |
| FR-CAL-02 | Position blocks       | Computes each block's vertical offset and height from the log's start time and duration. |
| FR-CAL-03 | Split across midnight | Splits multi-day logs into per-day segments rendered on each day.                        |
| FR-CAL-04 | Overlap layout        | Lays overlapping logs out side by side.                                                  |
| FR-CAL-05 | Apply colors          | Uses the log's task type color for the block background, border, and text.               |
| FR-CAL-06 | Block content         | Shows the title, time range, and type/project information.                               |
| FR-CAL-07 | Current-time line     | Draws an indicator at the current time.                                                  |
| FR-CAL-08 | Block click           | Clicking a block opens that log's detail panel.                                          |
| FR-CAL-09 | Day headers (weekly)  | Shows weekday abbreviations and dates, highlighting today's column.                      |
| FR-CAL-10 | Empty state (daily)   | Shows guidance text near the current time when there is nothing to render.               |

## 5. Layout Rules

### 5.1 Eligibility filter

- Only logs with **both a start and an end time** are rendered; a log missing either never appears.
- Logs that do not overlap the target day at all are excluded.

### 5.2 Midnight-spanning split (FR-CAL-03)

| Day                    | Rendered segment         |
| ---------------------- | ------------------------ |
| Same-day start and end | start → end              |
| Start day              | start → midnight         |
| Middle day             | 00:00 → 24:00 (full day) |
| End day                | 00:00 → end              |

### 5.3 Sizing

| Aspect           | Rule                                                      |
| ---------------- | --------------------------------------------------------- |
| Vertical offset  | `(minutes from midnight ÷ 60) × hour height`              |
| Block height     | `(duration minutes ÷ 60) × hour height`, minimum **22px** |
| Minimum duration | **15 minutes** (shorter durations are treated as 15)      |
| Ordering         | Start time ascending                                      |

### 5.4 Overlap handling (FR-CAL-04)

1. **Grouping** — scanning in start-time order, a log that begins before the current group's latest end time joins that group.
2. **Column packing** — within a group, columns are assigned greedily. A log that starts after a column's last block ends is appended to that column; if it fits nowhere, a new column is created.
3. **Width** — the horizontal space is split evenly across the group's total column count, with a gap between blocks when there is more than one column.

### 5.5 Color rules (FR-CAL-05)

| Condition                       | Background / border / text                                            |
| ------------------------------- | --------------------------------------------------------------------- |
| Task type color present         | Tag background token / tag text color / tag text color for that color |
| No task type, or unmapped color | Brand tertiary background / brand default border / default text color |

Supported colors: `blue`, `green`, `yellow`, `purple`, `red`, `gray`

### 5.6 Block text (FR-CAL-06)

| Element  | Content                                    | Condition                                 |
| -------- | ------------------------------------------ | ----------------------------------------- |
| Title    | Log title                                  | Always                                    |
| Subtitle | `HH:mm – HH:mm`                            | When both start and end times exist       |
| Caption  | `<task type>` or `<task type> · <project>` | When a task type exists (daily view only) |

The weekly view is space-constrained and shows only the title (11px) and subtitle (10px).

## 6. Business Rules

| ID        | Rule                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------ |
| BR-CAL-01 | Logs without times are not rendered on the calendar.                                             |
| BR-CAL-02 | Durations under 15 minutes are still rendered at 15-minute size so the block stays clickable.    |
| BR-CAL-03 | Overlapping logs are never hidden — all are shown side by side.                                  |
| BR-CAL-04 | The weekly view starts on Monday, inheriting the week definition from the weekly summary screen. |
| BR-CAL-05 | Block color reflects only the task type color; project and tag colors are not used.              |
| BR-CAL-06 | The calendar is read-only — blocks cannot be dragged or resized.                                 |

## 7. State Rendering

| Situation                  | Content                                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------------------- |
| Nothing to render (daily)  | `No time-tracked tasks for today. Add start & end times to see them here.` (shown below the current time) |
| Nothing to render (weekly) | An empty grid with no guidance text                                                                       |

## 8. Related Features

- Entering log times: [`task`](../task/spec.en.md)
- Screen using the daily calendar: [`today`](../today/spec.en.md)
- Screen using the weekly calendar: [`weekly-summary`](../weekly-summary/spec.en.md)
- Type color definitions: [`task-type`](../task-type/spec.en.md)

## 9. Current Limitations and Future Work

- Times cannot be adjusted by dragging or resizing (read-only).
- There is no way to create a log by clicking an empty slot.
- There is no monthly view.
- The visible time range cannot be narrowed — all 24 hours are always rendered.
- The weekly view has no empty-state message.
- The calendar does not auto-scroll to the current time.
