CREATE TABLE `task_note` (
	`task_id` text PRIMARY KEY NOT NULL,
	`content` text,
	`updated_at` text,
	FOREIGN KEY (`task_id`) REFERENCES `task`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `project` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT 'blue' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `project_name_idx` ON `project` (`name`);--> statement-breakpoint
CREATE TABLE `tag` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT 'gray' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tag_name_unique` ON `tag` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `tag_name_idx` ON `tag` (`name`);--> statement-breakpoint
CREATE INDEX `tag_deleted_at_idx` ON `tag` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `task` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`status` text DEFAULT 'todo' NOT NULL,
	`project_id` text,
	`end_time` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text,
	`done_at` text,
	`deleted_at` text,
	`started_at` text,
	`end_at` text,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `task_status_idx` ON `task` (`status`);--> statement-breakpoint
CREATE INDEX `task_deleted_at_idx` ON `task` (`deleted_at`);--> statement-breakpoint
CREATE INDEX `task_status_deleted_idx` ON `task` (`status`,`deleted_at`);--> statement-breakpoint
CREATE INDEX `task_created_at_idx` ON `task` (`created_at`);--> statement-breakpoint
CREATE INDEX `task_start_at_idx` ON `task` (`started_at`);--> statement-breakpoint
CREATE INDEX `task_end_at_idx` ON `task` (`end_at`);--> statement-breakpoint
CREATE TABLE `task_tag` (
	`task_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`task_id`, `tag_id`),
	FOREIGN KEY (`task_id`) REFERENCES `task`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `task_reflection` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text NOT NULL,
	`content` text NOT NULL,
	`original_note_hash` text,
	`model_name` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `task`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `task_reflection_task_id_unique` ON `task_reflection` (`task_id`);--> statement-breakpoint
CREATE INDEX `task_reflection_task_id_idx` ON `task_reflection` (`task_id`);