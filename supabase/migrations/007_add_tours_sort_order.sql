-- Add sort_order NUMERIC column to tours table for manual ordering
ALTER TABLE tours ADD COLUMN IF NOT EXISTS sort_order NUMERIC DEFAULT 0;

-- Seed sort_order with the current creation order so existing rows keep their order
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS rn
  FROM tours
)
UPDATE tours t
SET sort_order = ranked.rn
FROM ranked
WHERE t.id = ranked.id
  AND (t.sort_order IS NULL OR t.sort_order = 0);

CREATE INDEX IF NOT EXISTS idx_tours_sort_order ON tours(sort_order);
