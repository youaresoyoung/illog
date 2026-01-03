-- Migration: 003_add_start_and_end_time_to_task
-- Created: 2025-10-28
-- Description: Add timer_start and change end_time columns to timer_end in the task table


ALTER TABLE task ADD COLUMN timer_start TIMESTAMP;
ALTER TABLE task RENAME COLUMN end_time TO timer_end;

