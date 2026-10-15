CREATE TABLE `calendar_holds` (
	`id` text NOT NULL,
	`date` text NOT NULL,
	`slot` text NOT NULL,
	`title` text NOT NULL,
	`updated` text NOT NULL,
	PRIMARY KEY(`id`, `slot`)
);
--> statement-breakpoint
CREATE INDEX calendar_holds_date_slot ON calendar_holds(date,slot);
--> statement-breakpoint
CREATE TRIGGER slot_calendar_insert BEFORE INSERT ON slots
WHEN EXISTS(SELECT 1 FROM calendar_holds WHERE date=NEW.date AND slot=NEW.slot)
BEGIN SELECT RAISE(ABORT,'calendar_conflict'); END;
--> statement-breakpoint
CREATE TRIGGER slot_calendar_update BEFORE UPDATE ON slots
WHEN EXISTS(SELECT 1 FROM calendar_holds WHERE date=NEW.date AND slot=NEW.slot)
BEGIN SELECT RAISE(ABORT,'calendar_conflict'); END;
--> statement-breakpoint
CREATE TRIGGER calendar_slot_insert BEFORE INSERT ON calendar_holds
WHEN EXISTS(SELECT 1 FROM slots WHERE date=NEW.date AND slot=NEW.slot)
BEGIN SELECT RAISE(ABORT,'calendar_conflict'); END;
--> statement-breakpoint
CREATE TRIGGER calendar_slot_update BEFORE UPDATE ON calendar_holds
WHEN EXISTS(SELECT 1 FROM slots WHERE date=NEW.date AND slot=NEW.slot)
BEGIN SELECT RAISE(ABORT,'calendar_conflict'); END;
