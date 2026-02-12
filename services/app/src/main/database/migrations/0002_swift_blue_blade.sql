CREATE TABLE `task_type` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT 'blue' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `task_type_name_idx` ON `task_type` (`name`);--> statement-breakpoint
CREATE INDEX `task_type_deleted_at_idx` ON `task_type` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `task_subtype` (
	`id` text PRIMARY KEY NOT NULL,
	`task_type_id` text NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT 'blue' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`task_type_id`) REFERENCES `task_type`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `task_subtype_task_type_idx` ON `task_subtype` (`task_type_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `task_subtype_unique_name_per_type_idx` ON `task_subtype` (`task_type_id`,`name`);--> statement-breakpoint
CREATE INDEX `task_subtype_deleted_at_idx` ON `task_subtype` (`deleted_at`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_weekly_reflection` (
	`id` text PRIMARY KEY NOT NULL,
	`week_id` text NOT NULL,
	`accomplishments` text DEFAULT '[]' NOT NULL,
	`improvements` text DEFAULT '[]' NOT NULL,
	`next_week_focus` text DEFAULT '[]' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_weekly_reflection`("id", "week_id", "accomplishments", "improvements", "next_week_focus", "created_at", "updated_at") SELECT "id", "week_id", "accomplishments", "improvements", "next_week_focus", "created_at", "updated_at" FROM `weekly_reflection`;--> statement-breakpoint
DROP TABLE `weekly_reflection`;--> statement-breakpoint
ALTER TABLE `__new_weekly_reflection` RENAME TO `weekly_reflection`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `weekly_reflection_week_id_unique` ON `weekly_reflection` (`week_id`);--> statement-breakpoint
CREATE INDEX `weekly_reflection_week_id_idx` ON `weekly_reflection` (`week_id`);--> statement-breakpoint
ALTER TABLE `task` ADD `task_type_id` text REFERENCES task_type(id);--> statement-breakpoint
ALTER TABLE `task` ADD `task_subtype_id` text REFERENCES task_subtype(id);--> statement-breakpoint
CREATE INDEX `task_type_id_idx` ON `task` (`task_type_id`);--> statement-breakpoint
CREATE INDEX `task_subtype_id_idx` ON `task` (`task_subtype_id`);