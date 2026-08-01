# History Screen — Feature Specification

## 1. Overview

Lists **every recorded log**, newest first, with no date restriction. Unlike the Today screen, which is scoped to today, History lets the user scan the full record in one list.

## 2. Purpose and User Value

- Look back at past work without a time constraint.
- Provide an entry point into the notes and reflections of older logs.

## 3. Entry Point

| Item            | Value                    |
| --------------- | ------------------------ |
| Route           | `/history`               |
| Left navigation | `History` (icon `clock`) |
| Screen title    | `History`                |

## 4. Query Range

| Item       | Value                  |
| ---------- | ---------------------- |
| Filter     | None (fetch all)       |
| Excluded   | Soft-deleted logs      |
| Sorting    | Created-at descending  |
| Pagination | None (all rows loaded) |

## 5. Functional Requirements

| ID         | Feature               | Description                                                                                  |
| ---------- | --------------------- | -------------------------------------------------------------------------------------------- |
| FR-HIST-01 | List all logs         | Fetches every non-deleted log with its tags, project, and type information.                  |
| FR-HIST-02 | Render log cards      | Reuses the same task card component as the Today screen.                                     |
| FR-HIST-03 | Open detail           | Clicking a card opens the right-hand detail panel.                                           |
| FR-HIST-04 | Inline editing        | Title, description, status, time, project, type, and tags are editable directly on the card. |
| FR-HIST-05 | Delete log            | Right-click context menu → `Delete` → confirmation dialog.                                   |
| FR-HIST-06 | Empty state           | Shows guidance text when there are no logs.                                                  |
| FR-HIST-07 | Loading / error state | Shows a loading message, and a retry button on error.                                        |

## 6. State Rendering

| State   | Content                                                  |
| ------- | -------------------------------------------------------- |
| Loading | `Loading tasks...` (`role="status"`, `aria-busy="true"`) |
| Error   | User message plus a `Retry` button                       |
| No logs | `No tasks found in history`                              |

## 7. Business Rules

| ID         | Rule                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------- |
| BR-HIST-01 | Soft-deleted logs are not shown.                                                          |
| BR-HIST-02 | Sorting is fixed to created-at descending and cannot be changed.                          |
| BR-HIST-03 | All logs load at once — there is no infinite scroll or pagination.                        |
| BR-HIST-04 | Card editing and deletion behave exactly as on the Today screen.                          |
| BR-HIST-05 | The same all-logs query result is reused to compute completion rates in the project list. |

## 8. Related Features

- Task CRUD and card behavior: [`task`](../task/spec.en.md)
- Detail panel composition: [`app-shell`](../app-shell/spec.en.md)

## 9. Current Limitations and Future Work

- **This screen is temporary.** Per the code comments it is slated to merge into the Reflection screen and is only exposed until then.
- The Reflection screen exists only as a route stub and component skeleton; it is commented out of both the navigation and the router, so it is unreachable.
- There is no search, date-range, or status filter UI.
- Without pagination, initial load cost grows as the number of logs grows.
- There are no date group headers, so orienting yourself in a long list is difficult.
- Page-view analytics tracking is disabled and left as a TODO comment.
