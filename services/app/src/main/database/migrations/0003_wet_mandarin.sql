PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_task` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text DEFAULT 'Untitled' NOT NULL,
	`description` text,
	`status` text DEFAULT 'todo' NOT NULL,
	`project_id` text,
	`task_type_id` text,
	`task_subtype_id` text,
	`end_time` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`done_at` integer,
	`deleted_at` integer,
	`started_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`task_type_id`) REFERENCES `task_type`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`task_subtype_id`) REFERENCES `task_subtype`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_task`("id", "title", "description", "status", "project_id", "task_type_id", "task_subtype_id", "end_time", "created_at", "updated_at", "done_at", "deleted_at", "started_at") SELECT "id", "title", "description", "status", "project_id", "task_type_id", "task_subtype_id", "end_time", "created_at", "updated_at", "done_at", "deleted_at", COALESCE("started_at", "created_at") FROM `task`;--> statement-breakpoint
DROP TABLE `task`;--> statement-breakpoint
ALTER TABLE `__new_task` RENAME TO `task`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `task_status_idx` ON `task` (`status`);--> statement-breakpoint
CREATE INDEX `task_deleted_at_idx` ON `task` (`deleted_at`);--> statement-breakpoint
CREATE INDEX `task_status_deleted_idx` ON `task` (`status`,`deleted_at`);--> statement-breakpoint
CREATE INDEX `task_created_at_idx` ON `task` (`created_at`);--> statement-breakpoint
CREATE INDEX `task_start_at_idx` ON `task` (`started_at`);--> statement-breakpoint
CREATE INDEX `task_type_id_idx` ON `task` (`task_type_id`);--> statement-breakpoint
CREATE INDEX `task_subtype_id_idx` ON `task` (`task_subtype_id`);