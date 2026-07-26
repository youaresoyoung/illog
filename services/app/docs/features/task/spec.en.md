# Task (Log) Management — Feature Specification

## 1. Overview

The **Task (Log)** is illog's smallest unit of record. This feature covers creating, reading, updating, and deleting tasks. A task is the central entity that ties together a project, a task type/subtype, tags, start/end times, a note, and an AI reflection.

## 2. Purpose and User Value

- Capture what was worked on with minimal friction — a single line is enough.
- Enrich each record with classification (project/type/tag) and elapsed time so it can feed weekly and per-project analytics later.

## 3. Terminology

| Term        | Definition                                                                              |
| ----------- | --------------------------------------------------------------------------------------- |
| Task (Log)  | A single unit of recorded work                                                          |
| Status      | One of `todo`, `in_progress`, `done`                                                    |
| Soft delete | Marking `deletedAt` instead of physically removing the row, excluding it from all reads |

## 4. Data Model

Table `task` (`src/main/database/schema/task.ts`)

| Column            | Type               | Constraints / Default                             |
| ----------------- | ------------------ | ------------------------------------------------- |
| `id`              | text               | PK, auto-generated UUID                           |
| `title`           | text               | NOT NULL, default `'Untitled'`                    |
| `description`     | text               | Nullable                                          |
| `status`          | text enum          | `todo` \| `in_progress` \| `done`, default `todo` |
| `project_id`      | text               | FK to `project.id`, `ON DELETE CASCADE`           |
| `task_type_id`    | text               | FK to `task_type.id`, `ON DELETE SET NULL`        |
| `task_subtype_id` | text               | FK to `task_subtype.id`, `ON DELETE SET NULL`     |
| `started_at`      | integer(timestamp) | NOT NULL, defaults to now                         |
| `end_time`        | integer(timestamp) | Nullable                                          |
| `created_at`      | integer(timestamp) | NOT NULL, defaults to now                         |
| `updated_at`      | integer(timestamp) | NOT NULL, auto-updated on write                   |
| `done_at`         | integer(timestamp) | Timestamp of completion                           |
| `deleted_at`      | integer(timestamp) | Timestamp of soft delete                          |

Indexes: `status`, `deleted_at`, `(status, deleted_at)`, `created_at`, `started_at`, `task_type_id`, `task_subtype_id`

Relations: `task_tag` (N:M tags), `task_note` (1:1), `task_reflection` (1:1), `project` (N:1), `task_type` / `task_subtype` (N:1)

## 5. Functional Requirements

| ID         | Feature         | Description                                                                                                                                                        |
| ---------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-TASK-01 | Create task     | Creates an empty task with no input. Title `Untitled`, status `todo`, start time set to creation time. Tags, project, and type are all empty right after creation. |
| FR-TASK-02 | Get task        | Fetches a task by ID. Deleted tasks are not returned; a missing task raises an error.                                                                              |
| FR-TASK-03 | Get task detail | Fetches a task by ID together with its tags, project, task type, and subtype. Deleted related entities are excluded from the result.                               |
| FR-TASK-04 | List tasks      | Fetches tasks matching the filter criteria along with related entities. Sorting is fixed to created-at descending.                                                 |
| FR-TASK-05 | Update task     | Updates title, description, status, project, task type, subtype, and start/end times. Only the fields provided are applied (partial update).                       |
| FR-TASK-06 | Attach tag      | Links a tag to the task.                                                                                                                                           |
| FR-TASK-07 | Detach tag      | Removes a tag link from the task.                                                                                                                                  |
| FR-TASK-08 | Delete task     | Soft-deletes the task. It is excluded from all subsequent reads.                                                                                                   |

### 5.1 List Filter Rules (FR-TASK-04)

| Filter      | Behavior                                                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `status`    | Only tasks matching the given status                                                                                         |
| `projectId` | Only tasks belonging to the given project                                                                                    |
| `startTime` | Tasks whose end time is at or after the boundary, or that have no end time and start at or after it (range overlap included) |
| `endTime`   | Tasks whose start time is at or before the boundary                                                                          |
| `search`    | Partial match against title or description                                                                                   |

- Time filters accept ISO 8601 strings.
- Providing both `startTime` and `endTime` returns every task that **overlaps** the range (full containment is not required).
- Only non-deleted tasks are considered.

## 6. Business Rules

| ID         | Rule                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| BR-TASK-01 | Setting status to `done` records the completion timestamp (`done_at`) as the current time.                   |
| BR-TASK-02 | Moving status away from `done` resets the completion timestamp to `null`.                                    |
| BR-TASK-03 | Changing the task type without also supplying a subtype resets the existing subtype to `null`.               |
| BR-TASK-04 | Assigning a subtype that does not belong to the target task type raises an error and the update is rejected. |
| BR-TASK-05 | A task can have at most **5** tags; exceeding the limit raises an error.                                     |
| BR-TASK-06 | Attaching a tag that is already linked raises an error.                                                      |
| BR-TASK-07 | Deleting an already-deleted task raises a "not found" error.                                                 |
| BR-TASK-08 | Only soft delete is supported; no restore path is exposed to the user.                                       |

## 7. Screens and Interaction

### 7.1 Task card (`TaskCard`)

Shared across the Today, History, and Project Insights screens.

- Top: status selector (dropdown), start/end time picker with elapsed-time label
- Middle: project badge selector, task type / subtype badge selectors
- Body: inline title and description inputs (autosaved with a 1-second debounce)
- Bottom: tag selector with an `n/5 used` counter
- Clicking the card opens the right-hand detail panel — except when the click lands on an interactive element (link, input, button, selector, etc.)
- Right-click context menu: `Open Note`, `Delete`
- `Delete` goes through a "Delete this log?" confirmation dialog

### 7.2 Detail panel (`RightPanel`)

A 720px-wide panel that slides in from the right. It contains status, project/type, title and description, last-edited timestamp, tags, time, the note editor, and the AI reflection area. Switching tasks resets the scroll position to the top.

### 7.3 Optimistic updates

Updates, deletes, tag attach/detach, and project/type assignment all use **optimistic updates**. The client caches (today list / all list / detail) are updated before the request is sent, and rolled back to the previous state with an error toast if the request fails.

## 8. Error Handling

| Situation                           | Handling                                                          |
| ----------------------------------- | ----------------------------------------------------------------- |
| Reading a missing or deleted task   | `NOT_FOUND` — "The requested item could not be found."            |
| Update target missing or no changes | Error returned; optimistic update rolled back                     |
| More than 5 tags / duplicate tag    | Error returned, toast shown                                       |
| Subtype does not match task type    | `VALIDATION_ERROR` — "Invalid input. Please check and try again." |

## 9. Interface (IPC Channels)

| Channel                 | Arguments            | Returns          |
| ----------------------- | -------------------- | ---------------- |
| `task.create`           | —                    | Task detail      |
| `task.get`              | `id`                 | Task             |
| `task.getWithTags`      | `id`                 | Task detail      |
| `task.getTasksWithTags` | `filters?`           | Task detail list |
| `task.update`           | `id`, update payload | Task detail      |
| `task.addTag`           | `taskId`, `tagId`    | Task detail      |
| `task.removeTag`        | `taskId`, `tagId`    | Task detail      |
| `task.softDelete`       | `id`                 | —                |

## 10. Current Limitations and Future Work

- No hard delete, trash bin, or restore UI.
- The user cannot change the sort order (fixed to created-at descending).
- No recurring tasks, subtasks, priorities, or due dates.
- `taskTypeId` / `taskSubtypeId` filters exist in the type definition (`TaskFilterParams`) but are not yet implemented in the repository query.
- The search filter is not surfaced in the UI; it is only reachable through the API.
