CREATE TABLE `weekly_reflection` (
	`id` text PRIMARY KEY NOT NULL,
	`week_id` text NOT NULL,
	`accomplishments` text DEFAULT '[]' NOT NULL,
	`improvements` text DEFAULT '[]' NOT NULL,
	`next_week_focus` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `weekly_reflection_week_id_unique` ON `weekly_reflection` (`week_id`);--> statement-breakpoint
CREATE INDEX `weekly_reflection_week_id_idx` ON `weekly_reflection` (`week_id`);