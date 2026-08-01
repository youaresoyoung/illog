# Weekly Reflection — Feature Specification

> ⚠️ **Current status: implemented but not exposed.** The data model, repository, IPC channels, and UI component all exist, but the rendering code is commented out on the weekly summary screen (`ThisWeek.tsx`), so users cannot reach it.

## 1. Overview

Lets the user write **key accomplishments, areas for improvement, and next-week focus** for a given week. Unlike the per-task AI reflection, this is a hand-written weekly retrospective.

## 2. Purpose and User Value

- Record subjective judgment and next-week plans that automated statistics cannot capture.
- Establish a weekly retrospective habit.

## 3. Terminology

| Term            | Definition                                                               |
| --------------- | ------------------------------------------------------------------------ |
| Week ID         | ISO week string in `YYYY-Www` format (e.g. `2026-W30`)                   |
| Accomplishment  | An item whose completion can be toggled; shape `{ id, text, completed }` |
| Improvement     | A plain text item                                                        |
| Next week focus | A list of selected tag IDs                                               |

## 4. Data Model

Table `weekly_reflection` (`src/main/database/schema/weeklyReflection.ts`)

| Column            | Type               | Constraints / Default                                       |
| ----------------- | ------------------ | ----------------------------------------------------------- |
| `id`              | text               | PK, auto-generated UUID                                     |
| `week_id`         | text               | NOT NULL, UNIQUE                                            |
| `accomplishments` | text               | NOT NULL, default `[]`; JSON of `{ id, text, completed }[]` |
| `improvements`    | text               | NOT NULL, default `[]`; JSON of `string[]`                  |
| `next_week_focus` | text               | NOT NULL, default `[]`; JSON of tag ID `string[]`           |
| `created_at`      | integer(timestamp) | NOT NULL, defaults to now                                   |
| `updated_at`      | integer(timestamp) | NOT NULL, defaults to now                                   |

Index: `week_id`

- All three list fields are **serialized as JSON strings** into a single column and parsed back into arrays on read.
- The week ID uses the ISO week number computed with Monday as the week start.

## 5. Functional Requirements

| ID       | Feature               | Description                                                         |
| -------- | --------------------- | ------------------------------------------------------------------- |
| FR-WR-01 | Read reflection       | Fetches the reflection by week ID; returns empty when absent.       |
| FR-WR-02 | Save reflection       | Saves by week ID — creates when absent, updates otherwise (upsert). |
| FR-WR-03 | Add accomplishment    | Adds an accomplishment item from the entered text.                  |
| FR-WR-04 | Toggle accomplishment | Flips an accomplishment's completed state.                          |
| FR-WR-05 | Remove accomplishment | Removes an accomplishment item.                                     |
| FR-WR-06 | Add improvement       | Adds an improvement item from the entered text.                     |
| FR-WR-07 | Remove improvement    | Removes an improvement item.                                        |
| FR-WR-08 | Toggle focus tag      | Adds or removes a tag from the next-week focus list.                |
| FR-WR-09 | Autosave              | Persists 1 second after a change.                                   |

## 6. Business Rules

| ID       | Rule                                                                                                                         |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| BR-WR-01 | A week has at most one reflection (week ID is UNIQUE).                                                                       |
| BR-WR-02 | Saving is an upsert, so the user never distinguishes "create" from "update".                                                 |
| BR-WR-03 | Partial saves are supported — only supplied fields are updated, the rest are preserved.                                      |
| BR-WR-04 | The autosave debounce is **1 second**.                                                                                       |
| BR-WR-05 | Whitespace-only input is not added as an item.                                                                               |
| BR-WR-06 | Accomplishment IDs are generated client-side as UUIDs.                                                                       |
| BR-WR-07 | Next-week focus stores only tag IDs. If a tag is deleted the ID remains stored but no longer appears in the selectable list. |
| BR-WR-08 | Pressing Enter in an input adds the item.                                                                                    |

## 7. Screens and Interaction

Designed to sit at the bottom of the weekly summary screen (`/this-week`).

```
Weekly Reflection

  Key Accomplishments
    ☑ Shipped release v0.1.5        [×]
    ☐ Improved onboarding flow      [×]
    [Add accomplishment...        ] [Add]

  Areas for Improvement
    ! Test coverage is thin          [×]
    [Add improvement area...      ] [Add]

  Next Week Focus
    [tagA] [tagB] [tagC]   ← selected tags are highlighted
```

- Completed accomplishments render with a strikethrough and muted text color.
- When no tags exist, `No tags available. Create tags in your tasks first.` is shown.

## 8. Error Handling

| Situation                          | Handling                                                |
| ---------------------------------- | ------------------------------------------------------- |
| Creation failure                   | `Failed to create weekly reflection`                    |
| Updating a non-existent reflection | `Weekly reflection not found`                           |
| Save failure                       | The global mutation error handler raises an error toast |

## 9. Interface (IPC Channels)

| Channel                   | Arguments                                                       | Returns             |
| ------------------------- | --------------------------------------------------------------- | ------------------- |
| `weeklyReflection.get`    | `weekId`                                                        | Reflection or empty |
| `weeklyReflection.upsert` | `weekId`, `{ accomplishments?, improvements?, nextWeekFocus? }` | Reflection          |

## 10. Current Limitations and Future Work

- **The component is commented out on the weekly summary screen, so it is unusable in practice.** Enabling it requires uncommenting the `weekId` computation and the `<WeeklyReflection />` render in `ThisWeek.tsx`.
- The reflection is not wired to follow week navigation (the commented-out code always uses the current week).
- Item order cannot be changed.
- Accomplishments and improvements cannot be edited — only deleted and re-entered.
- There is no separate screen for browsing past weeks' reflections.
- The `weekly_reflection_saved` analytics event constant is defined but never emitted.
- The `ai.weekly-summary` feature flag exists, suggesting a future direction where AI drafts the weekly reflection.
