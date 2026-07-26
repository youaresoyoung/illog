# Projects — Feature Specification

## 1. Overview

Manage **projects** — the grouping unit above tasks — and assign or clear them on tasks. Projects are the primary classification axis for both the weekly summary analytics and the project insights screen.

## 2. Purpose and User Value

- Aggregate "what did I spend time on" at the project level.
- Produce the underlying data for at-a-glance per-project progress and time spent.

## 3. Terminology

| Term         | Definition                                               |
| ------------ | -------------------------------------------------------- |
| Project      | A grouping above tasks, with a name and a color          |
| Assign       | Setting a project on a task                              |
| Unclassified | A task with no project; aggregated as `etc` in analytics |

## 4. Data Model

Table `project` (`src/main/database/schema/project.ts`)

| Column       | Type      | Constraints / Default                                                        |
| ------------ | --------- | ---------------------------------------------------------------------------- |
| `id`         | text      | PK, auto-generated UUID                                                      |
| `name`       | text      | NOT NULL, UNIQUE index                                                       |
| `color`      | text enum | `blue` \| `green` \| `yellow` \| `purple` \| `red` \| `gray`, default `blue` |
| `created_at` | text      | NOT NULL, defaults to now                                                    |
| `updated_at` | text      | Nullable                                                                     |
| `deleted_at` | text      | Soft-delete timestamp                                                        |

Relation: `project` 1 : N `task` — `task.project_id` uses `ON DELETE CASCADE`

## 5. Functional Requirements

| ID        | Feature                 | Description                                                                     |
| --------- | ----------------------- | ------------------------------------------------------------------------------- |
| FR-PRJ-01 | Create project          | Creates a project with a name and color. The name is normalized before storage. |
| FR-PRJ-02 | Get project             | Fetches a project by ID. Deleted projects are not returned.                     |
| FR-PRJ-03 | List projects           | Returns every non-deleted project.                                              |
| FR-PRJ-04 | Update project          | Updates the name and/or color. Only supplied fields are applied.                |
| FR-PRJ-05 | Delete project          | Soft-deletes the project.                                                       |
| FR-PRJ-06 | Assign project to task  | Sets the task's project.                                                        |
| FR-PRJ-07 | Clear project from task | Clears the task's project (back to unclassified).                               |

## 6. Business Rules

| ID        | Rule                                                                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| BR-PRJ-01 | Project names are normalized before persistence.                                                                                                                                     |
| BR-PRJ-02 | Names are globally unique. Creating a project whose name matches an active project raises an error.                                                                                  |
| BR-PRJ-03 | Creating a project whose name matches a soft-deleted one restores the existing record, defaulting the color to `blue` when none is supplied.                                         |
| BR-PRJ-04 | The default project color is `blue`.                                                                                                                                                 |
| BR-PRJ-05 | A task has at most one project.                                                                                                                                                      |
| BR-PRJ-06 | Because tasks are only ever soft-deleted, deleting a project never actually cascades; deleted projects are excluded from joins, so the project simply appears empty on task screens. |
| BR-PRJ-07 | Tasks without a project are aggregated under the `etc` segment in analytics.                                                                                                         |

## 7. Screens and Interaction

### 7.1 Project assignment on a task (`ProjectSection`)

Rendered as a badge on both the task card and the task detail panel.

- Trigger: the assigned project badge, or an `Add Project` badge when none is set
- Dropdown (`BadgeSelector`)
  - Search input (`Search projects...`)
  - Project list — selecting assigns, clearing returns to unclassified
  - Projects can be created, updated, and deleted from the list
- Assign/clear is applied optimistically.

### 7.2 Project list (`ProjectList`)

The 256px fixed sidebar on the project insights screen (`/projects`).

- Each entry shows the project name, completion percentage, and a completion bar in the project color.
- The selected project is distinguished by its border color.
- Clicking switches the insights area on the right to that project.

## 8. Error Handling

| Situation                                     | Handling                                    |
| --------------------------------------------- | ------------------------------------------- |
| Creating a duplicate name                     | `Project with name "<name>" already exists` |
| Updating a non-existent project               | `Project not found or no changes made`      |
| Deleting a missing or already-deleted project | `Project not found`                         |

## 9. Interface (IPC Channels)

| Channel              | Arguments                 | Returns                                      |
| -------------------- | ------------------------- | -------------------------------------------- |
| `project.create`     | `{ name, color? }`        | Project                                      |
| `project.get`        | `id`                      | Project or empty                             |
| `project.getAll`     | —                         | Project list                                 |
| `project.update`     | `id`, `{ name?, color? }` | Project                                      |
| `project.softDelete` | `id`                      | —                                            |
| `task.update`        | `id`, `{ projectId }`     | Task detail (used for both assign and clear) |

## 10. Current Limitations and Future Work

- Projects have no description, date range (start/end), or status (active/archived).
- Without an archive concept, completed projects remain in the list indefinitely.
- Users cannot control the project sort order.
- Deleting a project does not ask the user what should happen to its tasks.
- The `project_created` and `project_deleted` analytics event constants are defined but never emitted.
