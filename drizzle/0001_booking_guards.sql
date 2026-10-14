CREATE INDEX `records_kind` ON `records` (`kind`);
--> statement-breakpoint
CREATE INDEX `bookings_date` ON `bookings` (`date`);
--> statement-breakpoint
CREATE INDEX `bookings_promo` ON `bookings` (`promo`, `status`);
--> statement-breakpoint
CREATE TRIGGER `booking_promo_insert` BEFORE INSERT ON `bookings`
WHEN NEW.promo <> '' AND NEW.status <> 'cancelled' AND (SELECT COUNT(*) FROM bookings WHERE promo=NEW.promo AND status<>'cancelled' AND id<>NEW.id) >= COALESCE((SELECT use_limit FROM promotions WHERE code=NEW.promo),0)
BEGIN SELECT RAISE(ABORT,'promo_limit'); END;
--> statement-breakpoint
CREATE TRIGGER `booking_promo_update` BEFORE UPDATE ON `bookings`
WHEN NEW.promo <> '' AND NEW.status <> 'cancelled' AND (SELECT COUNT(*) FROM bookings WHERE promo=NEW.promo AND status<>'cancelled' AND id<>NEW.id) >= COALESCE((SELECT use_limit FROM promotions WHERE code=NEW.promo),0)
BEGIN SELECT RAISE(ABORT,'promo_limit'); END;
