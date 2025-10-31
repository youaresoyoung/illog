-- Migration: 004_add_task_reflection
-- Created: 2025-10-31
-- Description: Add task_reflection table for AI-generated reflections on task

CREATE TABLE IF NOT EXISTS task_reflection (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    original_note_hash TEXT,
    model_name TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_task_reflection_task_id ON task_reflection(task_id);

