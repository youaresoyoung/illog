# Task Types / Subtypes — Feature Specification

## 1. Overview

Manage the two-level taxonomy (task type → subtype) that classifies the **nature** of a task. Where a project answers "what is this work about", a task type answers "what kind of work is this". A default set is seeded automatically on first launch.

## 2. Purpose and User Value

- Reveal time-usage patterns along a dimension that cuts across projects (development / design / meetings, etc.).
- Give new users a usable taxonomy out of the box, without having to build one first.

## 3. Terminology

| Term         | Definition                                                                      |
| ------------ | ------------------------------------------------------------------------------- |
| Task type    | First-level classification, e.g. `Development`, `Design`                        |
| Task subtype | Second-level classification owned by a task type, e.g. `Development > Frontend` |
| Seed         | Inserting default data into the database once, automatically                    |

## 4. Data Model

### 4.1 `task_type` table

| Column       | Type               | Constraints / Default           |
| ------------ | ------------------ | ------------------------------- |
| `id`         | text               | PK, auto-generated UUID         |
| `name`       | text               | NOT NULL, UNIQUE index          |
| `color`      | text enum          | 6 colors, default `blue`        |
| `created_at` | integer(timestamp) | NOT NULL, defaults to now       |
| `updated_at` | integer(timestamp) | NOT NULL, auto-updated on write |
| `deleted_at` | integer(timestamp) | Soft-delete timestamp           |

### 4.2 `task_subtype` table

| Column         | Type               | Constraints / Default                               |
| -------------- | ------------------ | --------------------------------------------------- |
| `id`           | text               | PK, auto-generated UUID                             |
| `task_type_id` | text               | NOT NULL, FK to `task_type.id`, `ON DELETE CASCADE` |
| `name`         | text               | NOT NULL                                            |
| `color`        | text enum          | 6 colors, default `blue`                            |
| `created_at`   | integer(timestamp) | NOT NULL, defaults to now                           |
| `updated_at`   | integer(timestamp) | NOT NULL, auto-updated on write                     |
| `deleted_at`   | integer(timestamp) | Soft-delete timestamp                               |

Indexes: `task_type_id`, `(task_type_id, name)` UNIQUE, `deleted_at`

### 4.3 Default seed data

On first launch, if the `task_type` table is empty, these 8 types and their subtypes are created automatically.

| Task type     | Color  | Subtypes                                                          |
| ------------- | ------ | ----------------------------------------------------------------- |
| Development   | blue   | Frontend, Backend, API, Database, Infrastructure, Bug Fix         |
| Design        | purple | UI Design, UX Research, Prototyping, Design System, Visual Design |
| Meeting       | yellow | Team Sync, Client Meeting, 1:1, Workshop                          |
| Research      | green  | Technical Research, Competitor Analysis, User Research            |
| Planning      | gray   | Sprint Planning, Roadmap, Estimation                              |
| Review        | red    | Code Review, Design Review, Document Review                       |
| Documentation | blue   | Technical Docs, User Guide, API Docs                              |
| Testing       | green  | Unit Testing, Integration Testing, Manual QA                      |

## 5. Functional Requirements

| ID         | Feature                  | Description                                                                     |
| ---------- | ------------------------ | ------------------------------------------------------------------------------- |
| FR-TYPE-01 | Create task type         | Creates a task type with a name and color.                                      |
| FR-TYPE-02 | Get task type            | Fetches by ID. Deleted types are not returned.                                  |
| FR-TYPE-03 | List task types          | Returns non-deleted types ordered by creation date ascending.                   |
| FR-TYPE-04 | List types with subtypes | Returns every task type together with its subtypes.                             |
| FR-TYPE-05 | Update task type         | Updates the name and/or color.                                                  |
| FR-TYPE-06 | Delete task type         | Soft-deletes the type.                                                          |
| FR-TYPE-07 | List subtypes            | Returns a type's subtypes ordered by creation date ascending.                   |
| FR-TYPE-08 | Get subtype              | Fetches a subtype by ID.                                                        |
| FR-TYPE-09 | Create subtype           | Creates a subtype from a parent type ID and a name.                             |
| FR-TYPE-10 | Update subtype           | Updates the name and/or color.                                                  |
| FR-TYPE-11 | Delete subtype           | Soft-deletes the subtype.                                                       |
| FR-TYPE-12 | Seed defaults            | Inserts the default types and subtypes at startup when the type table is empty. |
| FR-TYPE-13 | Assign to task           | Sets or clears a task's type and subtype.                                       |

## 6. Business Rules

| ID         | Rule                                                                                                                                               |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-TYPE-01 | Task type names are normalized and globally unique.                                                                                                |
| BR-TYPE-02 | Subtype names are unique **only within their parent type**; the same subtype name may exist under a different type.                                |
| BR-TYPE-03 | Creating a type or subtype whose name matches a soft-deleted one restores the existing record instead of inserting a new one.                      |
| BR-TYPE-04 | Deleting a task type also soft-deletes all of its subtypes.                                                                                        |
| BR-TYPE-05 | Creating a subtype whose parent type does not exist raises an error.                                                                               |
| BR-TYPE-06 | Assigning a subtype to a task raises an error when the subtype does not belong to the target task type.                                            |
| BR-TYPE-07 | Changing a task's type without also supplying a subtype resets the existing subtype.                                                               |
| BR-TYPE-08 | Seeding runs once, only when the type table is completely empty. Deleting every type is a soft delete, so rows remain and reseeding never happens. |
| BR-TYPE-09 | A task's type/subtype foreign keys use `ON DELETE SET NULL`, so tasks survive even if a type is physically deleted.                                |

## 7. Screens and Interaction

`TaskTypeSection` — rendered as two badges on both the task card and the task detail panel.

- **Task type badge**
  - Trigger: the assigned type badge, or an `Add Type` badge when none is set
  - Dropdown: search (`Search task types...`) plus the type list; types can be created, updated, and deleted from the list
- **Subtype badge**
  - Shown only when a task type is assigned
  - Trigger: the assigned subtype badge, or an `Add Subtype` badge when none is set
  - Dropdown: search (`Search subtypes...`) plus the subtypes of the current type
  - Clearing removes only the subtype and keeps the task type
- Type colors are also used for calendar event blocks and analytics chart colors.

## 8. Error Handling

| Situation                            | Handling                                                            |
| ------------------------------------ | ------------------------------------------------------------------- |
| Duplicate type name                  | `Task type with name <name> already exists`                         |
| Updating/deleting a missing type     | `Task type with id <id> not found`                                  |
| Missing parent type                  | `Parent task type with id <id> not found`                           |
| Duplicate subtype name within a type | `Task subtype with name <name> already exists for task type <type>` |
| Updating/deleting a missing subtype  | `Task subtype with id <id> not found`                               |
| Subtype does not belong to type      | `Task subtype does not belong to the specified task type`           |

## 9. Interface (IPC Channels)

| Channel                       | Arguments                 | Returns                         |
| ----------------------------- | ------------------------- | ------------------------------- |
| `taskType.create`             | `{ name, color? }`        | Task type                       |
| `taskType.get`                | `id`                      | Task type or empty              |
| `taskType.getAll`             | —                         | Task type list                  |
| `taskType.getAllWithSubtypes` | —                         | Task types with nested subtypes |
| `taskType.update`             | `id`, `{ name?, color? }` | Task type                       |
| `taskType.softDelete`         | `id`                      | —                               |
| `taskSubtype.getAllByTypeId`  | `typeId`                  | Subtype list                    |
| `taskSubtype.get`             | `id`                      | Subtype or empty                |
| `taskSubtype.create`          | `{ taskTypeId, name }`    | Subtype                         |
| `taskSubtype.update`          | `id`, `{ name?, color? }` | Subtype                         |
| `taskSubtype.softDelete`      | `id`                      | —                               |

## 10. Current Limitations and Future Work

- The subtype creation request type (`CreateTaskSubtypeRequest`) has no color field, so new subtypes always default to `blue`; the color can only be changed by a subsequent update.
- Taxonomies deeper than two levels are unsupported.
- Users cannot control the sort order of types (fixed to creation date).
- Deleting a type does not warn how many tasks currently use it.
- There is no way to reset or re-import the default seed data.
- The `task_type_created` and `task_subtype_created` analytics event constants are defined but never emitted.
