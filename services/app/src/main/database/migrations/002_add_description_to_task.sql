-- Migration: 002_add_description_to_task
-- Created: 2025-10-27
-- Description: Add a description column to the task table

ALTER TABLE task ADD COLUMN description TEXT;
