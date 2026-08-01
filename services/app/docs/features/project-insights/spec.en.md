# Project Insights — Feature Specification

## 1. Overview

An analytics screen showing **progress and per-task-type metrics** for a single selected project. Choosing a project in the left sidebar renders overview metrics, task-type analysis, a subtype table, and the project's logs on the right.

## 2. Purpose and User Value

- Quantify progress and invested time at the project level.
- See which kinds of work consumed the most time within a project.

## 3. Entry Point

| Item            | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| Route           | `/projects`                                                        |
| Left navigation | `Projects` (icon `folder`)                                         |
| Screen title    | `Projects` (becomes `Projects: <name>` once a project is selected) |

## 4. Layout

```
┌──────────┬───────────────┬────────────────────────────────────┐
│ App nav  │ Project list  │ Projects: illog                    │
│ (256px)  │  (256px)      │────────────────────────────────────│
│          │ ┌───────────┐ │ Project Overview                   │
│ Today    │ │ illog 62% │ │ [total][completed][in progress]    │
│ This Week│ │ ▓▓▓▓▓░░░  │ │ [todo][completion rate][total time]│
│ History  │ └───────────┘ │────────────────────────────────────│
│ Projects │ ┌───────────┐ │ Task Type Analysis                 │
│          │ │ blog  30% │ │ [sortable table] [donut chart]     │
│          │ │ ▓▓░░░░░░  │ │────────────────────────────────────│
│          │ └───────────┘ │ Subtype Table                      │
│          │               │────────────────────────────────────│
│          │               │ Tasks (log card list)              │
└──────────┴───────────────┴────────────────────────────────────┘
```

## 5. Functional Requirements

| ID       | Feature             | Description                                                                                            |
| -------- | ------------------- | ------------------------------------------------------------------------------------------------------ |
| FR-PI-01 | Render project list | Shows every non-deleted project in the left sidebar with a completion bar.                             |
| FR-PI-02 | Select project      | Selecting a project switches the analysis area on the right.                                           |
| FR-PI-03 | Auto-select first   | When nothing is selected and at least one project exists, the first project is selected automatically. |
| FR-PI-04 | Overview metrics    | Shows six aggregate metrics for the selected project.                                                  |
| FR-PI-05 | Task type analysis  | Shows per-task-type metrics as a sortable table plus a donut chart.                                    |
| FR-PI-06 | Subtype table       | Shows per-subtype metrics as a sortable table.                                                         |
| FR-PI-07 | Project task list   | Shows the project's logs as a card list.                                                               |
| FR-PI-08 | Open detail         | Clicking a log card opens the right-hand detail panel.                                                 |

### 5.1 Overview metrics (FR-PI-04)

| Metric             | Calculation                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `Total Tasks`      | Number of logs belonging to the project                          |
| `Completed`        | Logs with status `done`                                          |
| `In Progress`      | Logs with status `in_progress`                                   |
| `Todo`             | Logs with status `todo`                                          |
| `Completion Rate`  | Completed ÷ total × 100 (one decimal); 0% when there are no logs |
| `Total Time Spent` | Sum of (end − start) across all logs, in hours with one decimal  |

### 5.2 Task type analysis table (FR-PI-05)

| Column            | Content                                       | Sorting |
| ----------------- | --------------------------------------------- | ------- |
| `Type`            | Task type badge (name + color)                | By name |
| `Count`           | Number of logs of that type                   | Numeric |
| `Completion Rate` | Completion rate within the type (one decimal) | Numeric |
| `Total Time`      | Total minutes for the type; `N/A` when zero   | Numeric |

- A donut chart accompanies the table to visualize each type's share of time.

### 5.3 Subtype table (FR-PI-06)

| Column            | Content                            |
| ----------------- | ---------------------------------- |
| `Subtype`         | Subtype badge                      |
| `Parent Type`     | Parent task type badge             |
| `Count`           | Number of logs of that subtype     |
| `Completion Rate` | Completion rate within the subtype |
| `Total Time`      | Total minutes for the subtype      |

- The entire section is hidden when there are no subtype metrics.

### 5.4 Project list entry (FR-PI-01)

| Element         | Content                                                                |
| --------------- | ---------------------------------------------------------------------- |
| Name            | Project name (truncated when long)                                     |
| Completion rate | `(NN %)` format, no decimals                                           |
| Progress bar    | Horizontal bar based on completion rate, filled with the project color |
| Selection       | The selected entry is distinguished by its border color                |

## 6. State Rendering

| State               | Content                              |
| ------------------- | ------------------------------------ |
| No project selected | `Select a project to view insights`  |
| Loading             | `Loading...`                         |
| Error               | `Error loading tasks: <message>`     |
| No logs             | `No tasks yet`                       |
| Empty table         | Each table's own empty-state message |

## 7. Business Rules

| ID       | Rule                                                                                                              |
| -------- | ----------------------------------------------------------------------------------------------------------------- |
| BR-PI-01 | The project list's completion rate is computed by grouping all logs per project.                                  |
| BR-PI-02 | Elapsed time is computed only when both start and end times exist; otherwise the log counts as 0 minutes.         |
| BR-PI-03 | Completion rate is based on status `done` — a different criterion from the weekly summary, which counts `doneAt`. |
| BR-PI-04 | The selected project ID lives in global UI state and survives navigating away and back.                           |
| BR-PI-05 | Logs with no project assigned are never fetched on this screen.                                                   |
| BR-PI-06 | Tables default to descending sort.                                                                                |

## 8. Related Features

- Project CRUD: [`project`](../project/spec.en.md)
- Task type taxonomy: [`task-type`](../task-type/spec.en.md)
- Log card behavior: [`task`](../task/spec.en.md)

## 9. Current Limitations and Future Work

- There is no date-range filter, so metrics always cover the project's **entire history**.
- There is no cross-project comparison view.
- A lead-time helper (created → completed duration) is implemented but never surfaced in the UI; the `avgCompletionMinutes` field on `TaskTypeMetrics` is likewise unused.
- The `ProjectSelector` component is implemented but unused on this screen (the sidebar list replaces it).
- There is no path to inspect unclassified (no-project) logs.
- Metrics cannot be exported (CSV, etc.).
