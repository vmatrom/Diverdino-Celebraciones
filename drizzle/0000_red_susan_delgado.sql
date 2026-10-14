CREATE TABLE `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`slot` text NOT NULL,
	`status` text NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`guests` integer NOT NULL,
	`type` text NOT NULL,
	`base` integer NOT NULL,
	`extras` integer NOT NULL,
	`discount` integer NOT NULL,
	`total` integer NOT NULL,
	`promo` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`name` text NOT NULL,
	`settings` text DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `promotions` (
	`code` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`mode` text NOT NULL,
	`value` integer NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`use_limit` integer NOT NULL,
	`active` integer NOT NULL,
	`referrer` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`payload` text NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `slots` (
	`date` text NOT NULL,
	`slot` text NOT NULL,
	`booking` text NOT NULL,
	PRIMARY KEY(`date`, `slot`),
	FOREIGN KEY (`booking`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `visits` (
	`day` text NOT NULL,
	`path` text NOT NULL,
	`source` text NOT NULL,
	`event` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`day`, `path`, `source`, `event`)
);
