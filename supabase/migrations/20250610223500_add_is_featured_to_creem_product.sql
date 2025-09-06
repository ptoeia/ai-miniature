-- Add is_featured and display_order columns to CreemProduct table
ALTER TABLE "CreemProduct"
ADD COLUMN "is_featured" BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN "display_order" INTEGER NOT NULL DEFAULT 0;
