CREATE TABLE `files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`title` text,
	`icon` text,
	`in_trash` boolean,
	`logo` text,
	`banner_url` text,
	`workspace_id` int NOT NULL,
	`folder_id` int NOT NULL,
	CONSTRAINT `files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `folders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`title` text,
	`icon` text,
	`in_trash` boolean,
	`logo` text,
	`banner_url` text,
	`workspace_id` int NOT NULL,
	CONSTRAINT `folders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_id` int,
	`active` boolean,
	`description` text,
	`unit_amount` bigint,
	`currency` text,
	`pricing_type` enum('recurring','one_time'),
	`pricing_plan_interval` enum('year','month','week','day'),
	`interval_count` int,
	`trial_period_days` int,
	`metadata` json,
	CONSTRAINT `prices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`active` boolean,
	`name` text,
	`description` text,
	`image` text,
	`metadata` json,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`subscription_status` enum('unpaid','past_due','incomplete_expired','incomplete','canceled','active','trialing'),
	`metadata` json,
	`price_id` int,
	`quantity` int,
	`cancel_at_period_end` boolean,
	`created` timestamp NOT NULL DEFAULT (now()),
	`current_period_start` timestamp NOT NULL DEFAULT (now()),
	`current_period_end` timestamp NOT NULL DEFAULT (now()),
	`ended_at` timestamp DEFAULT (now()),
	`cancel_at` timestamp DEFAULT (now()),
	`canceled_at` timestamp DEFAULT (now()),
	`trial_start` timestamp DEFAULT (now()),
	`trial_end` timestamp DEFAULT (now()),
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`full_name` text,
	`avatar_url` text,
	`billing_address` json,
	`updated_at` timestamp,
	`payment_method` json,
	`email` text,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` int AUTO_INCREMENT NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`workspace_owner` int NOT NULL,
	`title` text,
	`icon` text,
	`in_trash` boolean,
	`logo` text,
	`banner_url` text,
	CONSTRAINT `workspaces_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `files` ADD CONSTRAINT `files_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `files` ADD CONSTRAINT `files_folder_id_folders_id_fk` FOREIGN KEY (`folder_id`) REFERENCES `folders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `folders` ADD CONSTRAINT `folders_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prices` ADD CONSTRAINT `prices_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_price_id_prices_id_fk` FOREIGN KEY (`price_id`) REFERENCES `prices`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workspaces` ADD CONSTRAINT `workspaces_workspace_owner_users_id_fk` FOREIGN KEY (`workspace_owner`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;