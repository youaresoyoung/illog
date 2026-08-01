# Note Editor — Feature Specification

## 1. Overview

Write and autosave a **rich-text note** attached one-to-one to each task. The editor is built on Lexical, and saving happens only through debounced autosave — there is no manual save button.

## 2. Purpose and User Value

- Capture context, process, and decisions that a one-line log cannot hold.
- Let the user focus on writing without thinking about saving.
- The note becomes the input for AI reflection generation.

## 3. Terminology

| Term     | Definition                                                                                |
| -------- | ----------------------------------------------------------------------------------------- |
| Note     | Rich-text body owned by a task; at most one per task                                      |
| Autosave | Automatic persistence a fixed delay after editing stops                                   |
| Conflict | The stored note's updated-at is newer than the timestamp the client believed to be latest |

## 4. Data Model

Table `task_note` (`src/main/database/schema/note.ts`)

| Column       | Type | Constraints                                           |
| ------------ | ---- | ----------------------------------------------------- |
| `task_id`    | text | PK and FK to `task.id`, `ON DELETE CASCADE`           |
| `content`    | text | Serialized editor-state JSON string                   |
| `updated_at` | text | Save timestamp (millisecond epoch stored as a string) |

- Because `task_id` is the primary key, a task has **at most one** note.
- Deleting a task cascades to its note.

## 5. Functional Requirements

| ID         | Feature              | Description                                                                                                              |
| ---------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| FR-NOTE-01 | Read note            | Fetches the note by task ID. Returns empty when no note exists.                                                          |
| FR-NOTE-02 | Autosave             | Persists the note body **1 second** after editing stops. Creates the note if absent, overwrites it otherwise.            |
| FR-NOTE-03 | Conflict detection   | On save, compares the client's last-known updated-at against the stored one and skips the write when the store is newer. |
| FR-NOTE-04 | Ordered writes       | Serializes concurrent save requests through a queue so an earlier request cannot overwrite a later one.                  |
| FR-NOTE-05 | Initial content load | Restores the stored note into the editor when the task detail panel opens.                                               |
| FR-NOTE-06 | Formatting           | Supports block and text formatting (see 5.1, 5.2).                                                                       |
| FR-NOTE-07 | Markdown shortcuts   | Typing Markdown syntax converts to the matching formatting inline.                                                       |
| FR-NOTE-08 | Undo / redo          | Maintains edit history.                                                                                                  |

### 5.1 Block formats

Selected from the toolbar dropdown.

`Normal (paragraph)` · `Heading 1–6` · `Numbered List` · `Bulleted List` · `Check List` · `Quote` · `Code Block`

- Re-selecting the block type that is already active converts the block back to a normal paragraph (toggle behavior).
- Code blocks support syntax highlighting.

### 5.2 Text formats

Applied via toolbar buttons or the floating toolbar shown above a selection.

`Bold` · `Italic` · `Underline` · `Strikethrough` · `Inline Code` · `Subscript` · `Superscript`

### 5.3 Other editing capabilities

| Capability       | Behavior                                                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Links            | URLs are validated on insert; invalid strings are not converted into links.                                                                           |
| Auto-link        | URLs typed into the body are recognized as links automatically.                                                                                       |
| Checklists       | Check state can be toggled.                                                                                                                           |
| Indentation      | Tab / Shift+Tab adjust list indentation levels.                                                                                                       |
| Floating toolbar | Selecting text shows a formatting toolbar above the selection (below it when there is no room), repositioned so it never overflows the editor bounds. |

## 6. Business Rules

| ID         | Rule                                                                                                                                                        |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-NOTE-01 | The autosave debounce is **1 second**.                                                                                                                      |
| BR-NOTE-02 | The persisted body is the serialized full editor state (JSON), not plain text.                                                                              |
| BR-NOTE-03 | When a conflict is detected the write is skipped and only the stored save timestamp is returned. User input is never overwritten and no merge is attempted. |
| BR-NOTE-04 | Save requests are processed sequentially through a single serial queue.                                                                                     |
| BR-NOTE-05 | Deleting a task deletes its note.                                                                                                                           |
| BR-NOTE-06 | There is no standalone "delete note" operation.                                                                                                             |

## 7. Screens and Interaction

- Location: bottom of the task detail panel (`RightPanel`), directly above the AI reflection area
- Layout: top toolbar (block format dropdown + text format buttons) over the editing surface (minimum height 400px)
- Empty-state placeholder: `Start typing your notes here...`
- Switching tasks reloads the note for the newly selected task.

## 8. Error Handling

| Situation                 | Handling                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| Save failure              | Error toast — `Note failed to save: <user message>`                                                |
| Repository upsert failure | Error is propagated upward and surfaced as a toast                                                 |
| Conflict detected         | Treated as a successful response (`conflict: true`), not an error. No user-facing notice is shown. |
| Editor internal error     | Handled by the Lexical error boundary and logged to the console                                    |

## 9. Interface (IPC Channels)

| Channel             | Arguments                              | Returns                                                               |
| ------------------- | -------------------------------------- | --------------------------------------------------------------------- |
| `note.findByTaskId` | `taskId`                               | Note or empty                                                         |
| `note.autoSave`     | `taskId`, `content`, `clientUpdatedAt` | `{ note, savedAt, conflict: false }` or `{ savedAt, conflict: true }` |

## 10. Current Limitations and Future Work

- Conflicts are not surfaced to the user, and there is no merge or diff UI.
- There is no save-state indicator (e.g. "Saved") confirming a successful write.
- Images, file attachments, tables, and horizontal-rule nodes are unsupported.
- Note search and export (Markdown/PDF) are unsupported.
- The `note_auto_saved` analytics event constant is defined but never emitted.
