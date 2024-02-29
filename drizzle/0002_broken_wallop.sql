ALTER TABLE `users` RENAME COLUMN `full_name` TO `name`;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `users` ADD `surname` text;