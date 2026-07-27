ALTER TABLE content_translations ADD COLUMN IF NOT EXISTS itinerary jsonb DEFAULT '[]'::jsonb;
