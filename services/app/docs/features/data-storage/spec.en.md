# Data Storage — Feature Specification

## 1. Overview

Stores all application data in a **local SQLite database**. Covers database initialization, schema migrations, default-data seeding, and the soft-delete policy. No user data is ever sent to an external server.

## 2. Purpose and User Value

- Guarantee privacy by keeping records entirely on the user's device.
- Make every feature usable without a network connection.
- Update the schema across app upgrades without losing existing data.

## 3. Storage Configuration

| Item          | Value                               |
| ------------- | ----------------------------------- |
| Database      | SQLite (`better-sqlite3`)           |
| ORM           | Drizzle ORM                         |
| File location | Electron's user data directory      |
| File name     | `DB_FILE_NAME` environment variable |
| Access mode   | Synchronous — main process only     |

- The renderer never touches the database directly; access always goes through IPC.

## 4. Tables

| Table               | Purpose                  | Soft delete  |
| ------------------- | ------------------------ | ------------ |
| `task`              | Logs                     | ✅           |
| `task_note`         | Task note (1:1)          | ❌ (cascade) |
| `task_reflection`   | AI reflection (1:1)      | ❌ (cascade) |
| `task_tag`          | Task-tag links (N:M)     | ❌ (cascade) |
| `tag`               | Tags                     | ✅           |
| `project`           | Projects                 | ✅           |
| `task_type`         | Task types               | ✅           |
| `task_subtype`      | Task subtypes            | ✅           |
| `weekly_reflection` | Weekly reflections       | ❌           |
| `app_setting`       | App settings (key-value) | ❌           |

### 4.1 Relationship diagram

```
project ──┐
          │ (N:1, CASCADE)
task_type ─┼── task ──┬── task_note        (1:1, CASCADE)
   │       │          ├── task_reflection  (1:1, CASCADE)
   │ (SET NULL)       └── task_tag ── tag  (N:M, CASCADE)
task_subtype ─┘

weekly_reflection   (standalone)
app_setting         (standalone)
```

## 5. Functional Requirements

| ID       | Feature        | Description                                                           |
| -------- | -------------- | --------------------------------------------------------------------- |
| FR-DB-01 | Open database  | Opens or creates the database file in the user data directory.        |
| FR-DB-02 | Run migrations | Applies any pending migrations automatically at app start.            |
| FR-DB-03 | Seed defaults  | Inserts default task types and subtypes when the type table is empty. |
| FR-DB-04 | Soft delete    | Deletes core entities by recording a deletion timestamp.              |
| FR-DB-05 | Cascade delete | Dependent rows are removed when a task is physically deleted.         |
| FR-DB-06 | App settings   | Stores and reads app settings as key-value pairs.                     |

### 5.1 Startup initialization order

```
Resolve the user data directory path
  → open the database file (create if missing)
  → create the Drizzle instance (bound to the schema)
  → apply pending migrations from the migrations folder
  → seed default task types (only when the table is empty)
  → construct repositories/services and register IPC handlers
```

## 6. Deletion Policy

| Mechanism          | Applies to                                            | Behavior                                                                                    |
| ------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Soft delete        | `task`, `tag`, `project`, `task_type`, `task_subtype` | Fills a deletion timestamp column. Every read targets only rows where that column is empty. |
| Cascade delete     | `task_note`, `task_reflection`, `task_tag`            | Removed when the parent task is physically deleted.                                         |
| Reference clearing | `task.task_type_id`, `task.task_subtype_id`           | Set to `null` when the referenced row is physically deleted.                                |
| Unsupported        | All                                                   | No physical delete, trash bin, or restore is exposed to the user.                           |

> In practice only soft delete is used, so cascade delete and reference clearing rarely fire.

## 7. Timestamp Representations

Timestamp storage format differs per table.

| Format                          | Tables                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------ |
| Integer (Unix epoch seconds)    | `task`, `tag`, `task_type`, `task_subtype`, `weekly_reflection`, `app_setting` |
| Text (`datetime` string)        | `project`, `task_reflection`                                                   |
| Text (millisecond epoch string) | `task_note`                                                                    |

## 8. Business Rules

| ID       | Rule                                                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| BR-DB-01 | All user data is stored locally and never transmitted externally.                                                                     |
| BR-DB-02 | Migrations run automatically at app start with no user intervention.                                                                  |
| BR-DB-03 | Seeding runs only when the task type table is completely empty.                                                                       |
| BR-DB-04 | Database access is restricted to the main process.                                                                                    |
| BR-DB-05 | Name fields on core entities carry uniqueness constraints, so recreating a deleted item with the same name triggers the restore path. |
| BR-DB-06 | Read queries always target non-deleted rows and exclude deleted related entities from joins.                                          |

## 9. Development Commands

Run from the `services/app` directory.

| Command            | Description                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| `pnpm db:generate` | Generates a migration file from schema changes                             |
| `pnpm db:migrate`  | Rebuilds the native module, applies migrations, then rebuilds for Electron |
| `pnpm db:studio`   | Launches the database browser                                              |

## 10. Related Features

- Startup initialization order: [`app-shell`](../app-shell/spec.en.md)
- Default seed contents: [`task-type`](../task-type/spec.en.md)
- App setting entries: [`crash-report`](../crash-report/spec.en.md)

## 11. Current Limitations and Future Work

- **There is no backup, restore, or export.** Moving data to another machine requires copying the database file manually.
- Cloud sync (`sync.cloud`) exists only as a feature flag with no implementation.
- PDF export (`export.pdf`) is likewise flag-only.
- There is no recovery procedure or user guidance when a migration fails.
- Soft-deleted rows are never purged, so the database only grows.
- The database file is not encrypted.
- Timestamp storage formats are inconsistent across tables and should be unified.
- The database file path is not user-configurable.
