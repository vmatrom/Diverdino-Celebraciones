CREATE TABLE `connections` (
	`provider` text PRIMARY KEY NOT NULL,
	`settings` text NOT NULL,
	`encrypted_secret` text DEFAULT '' NOT NULL,
	`verified` text DEFAULT '' NOT NULL,
	`updated` text NOT NULL
);
