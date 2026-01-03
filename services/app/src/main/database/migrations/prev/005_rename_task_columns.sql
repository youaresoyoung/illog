-- Migration: 005_rename_task_columns
-- Created: 2026-01-18
-- Description: Rename timer_start and timer_end columns to start_at and end_at in the task table

ALTER TABLE task RENAME COLUMN timer_start TO start_at;
ALTER TABLE task RENAME COLUMN timer_end TO end_at;