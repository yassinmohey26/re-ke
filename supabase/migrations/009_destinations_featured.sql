-- Add homepage-featured control columns to destinations.
-- Safe to run once; idempotent (IF NOT EXISTS).
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Seed the original 5 homepage destinations as featured, positions 1-5.
-- Touches ONLY featured/display_order — existing name/image/description data is preserved.
UPDATE destinations SET featured = true, display_order = 1 WHERE slug = 'hurghada';
UPDATE destinations SET featured = true, display_order = 2 WHERE slug = 'el-gouna';
UPDATE destinations SET featured = true, display_order = 3 WHERE slug = 'safaga';
UPDATE destinations SET featured = true, display_order = 4 WHERE slug = 'makadi-bay';
UPDATE destinations SET featured = true, display_order = 5 WHERE slug = 'soma-bay';

-- All other destinations keep featured = false (column default).

CREATE INDEX IF NOT EXISTS idx_destinations_featured_display_order ON destinations(featured, display_order);
