# Tags — Feature Specification

## 1. Overview

Manage **tags** that can be freely attached to tasks, and link/unlink them. Unlike projects and task types — which are structured taxonomies — tags are an unstructured classification the user invents on the fly.

## 2. Purpose and User Value

- Lightly mark context that does not fit a fixed taxonomy (e.g. `urgent`, `refactor`, `onboarding`).
- Cap the number per task so tags do not proliferate until they lose classifying power.

## 3. Terminology

| Term    | Definition                                                                          |
| ------- | ----------------------------------------------------------------------------------- |
| Tag     | A label with a name and a color; one global list is shared app-wide                 |
| Link    | Attaching a tag to a specific task                                                  |
| Restore | Reviving an existing soft-deleted record when a tag is recreated with the same name |

## 4. Data Model

### 4.1 `tag` table

| Column       | Type               | Constraints / Default                                                        |
| ------------ | ------------------ | ---------------------------------------------------------------------------- |
| `id`         | text               | PK, auto-generated UUID                                                      |
| `name`       | text               | NOT NULL, UNIQUE                                                             |
| `color`      | text enum          | `blue` \| `green` \| `yellow` \| `purple` \| `red` \| `gray`, default `gray` |
| `created_at` | integer(timestamp) | NOT NULL, defaults to now                                                    |
| `updated_at` | integer(timestamp) | NOT NULL, auto-updated on write                                              |
| `deleted_at` | integer(timestamp) | Soft-delete timestamp                                                        |

Indexes: `name` (UNIQUE), `deleted_at`

### 4.2 `task_tag` join table

| Column    | Type | Constraints                          |
| --------- | ---- | ------------------------------------ |
| `task_id` | text | FK to `task.id`, `ON DELETE CASCADE` |
| `tag_id`  | text | FK to `tag.id`, `ON DELETE CASCADE`  |

Composite primary key `(task_id, tag_id)` — duplicate pairs are structurally impossible.

## 5. Functional Requirements

| ID        | Feature              | Description                                                                   |
| --------- | -------------------- | ----------------------------------------------------------------------------- |
| FR-TAG-01 | Create tag           | Creates a tag with a name and color. The name is normalized before storage.   |
| FR-TAG-02 | Get tag              | Fetches a tag by ID. Deleted tags are not returned.                           |
| FR-TAG-03 | List tags            | Returns every non-deleted tag.                                                |
| FR-TAG-04 | Update tag           | Updates the name and/or color. Only supplied fields are applied.              |
| FR-TAG-05 | Delete tag           | Soft-deletes the tag. It disappears from the list and from task detail joins. |
| FR-TAG-06 | Attach tag to task   | Links a tag to a task.                                                        |
| FR-TAG-07 | Detach tag from task | Removes the link between a tag and a task.                                    |

## 6. Business Rules

| ID        | Rule                                                                                                                                                 |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-TAG-01 | Tag names are normalized (whitespace cleanup, etc.) before persistence.                                                                              |
| BR-TAG-02 | Names are globally unique. Creating a tag whose name matches an active tag raises an error.                                                          |
| BR-TAG-03 | Creating a tag whose name matches a soft-deleted one restores the existing record instead of inserting a new one, applying the newly supplied color. |
| BR-TAG-04 | A task can carry at most **5** tags.                                                                                                                 |
| BR-TAG-05 | A tag already linked to a task cannot be linked again.                                                                                               |
| BR-TAG-06 | The maximum tag name length is defined as **20 characters**.                                                                                         |
| BR-TAG-07 | The default tag color is `gray`.                                                                                                                     |
| BR-TAG-08 | Deleting a tag leaves its `task_tag` rows in place, but deleted tags are excluded from joins so they no longer appear on task screens.               |
| BR-TAG-09 | Deleting a task cascades to its tag links.                                                                                                           |

## 7. Screens and Interaction

The tag section appears both on the task card (`TaskCard`) and in the task detail panel (`RightPanel`).

- Header: `Tags` label plus an `n/5 used` counter
- Trigger: chips for the linked tags, each with a remove button. When no tags are linked, an `Add Tag` chip is shown instead.
- Dropdown (`TagSelector`)
  - Top: search input (`Search tags...`)
  - Below: the full tag list. Selecting links a tag; selecting again unlinks it.
  - Tags can be created, renamed, recolored, or deleted from within the list.
- Link/unlink is applied optimistically; failures roll back and raise an error toast.

## 8. Error Handling

| Situation                                 | Handling                                |
| ----------------------------------------- | --------------------------------------- |
| Creating a duplicate name                 | `Tag with name "<name>" already exists` |
| Updating a non-existent tag               | `Tag not found or no changes made`      |
| Deleting a missing or already-deleted tag | `Tag not found`                         |
| Exceeding 5 tags                          | `A task can have a maximum of 5 tags`   |
| Duplicate link                            | `Tag already associated with the task`  |

All errors pass through the global mutation error handler, which converts them into user-friendly toasts.

## 9. Interface (IPC Channels)

| Channel          | Arguments                 | Returns      |
| ---------------- | ------------------------- | ------------ |
| `tag.create`     | `{ name, color? }`        | Tag          |
| `tag.get`        | `id`                      | Tag or empty |
| `tag.getAll`     | —                         | Tag list     |
| `tag.update`     | `id`, `{ name?, color? }` | Tag          |
| `tag.softDelete` | `id`                      | —            |
| `task.addTag`    | `taskId`, `tagId`         | Task detail  |
| `task.removeTag` | `taskId`, `tagId`         | Task detail  |

## 10. Current Limitations and Future Work

- The 20-character name limit is defined as a constant but not enforced in the repository layer.
- Tasks cannot be filtered by tag (`TaskFilterParams` has no tag filter).
- Tags are not available as a grouping dimension in weekly analytics (only project / task type / subtype are).
- There is no tag management surface — usage counts, unused-tag cleanup, and similar are absent.
- The `tag_created` and `tag_deleted` analytics event constants are defined but never emitted.
