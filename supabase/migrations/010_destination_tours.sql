CREATE TABLE IF NOT EXISTS destination_tours (
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (destination_id, tour_id)
);

CREATE INDEX IF NOT EXISTS idx_destination_tours_destination ON destination_tours(destination_id);
CREATE INDEX IF NOT EXISTS idx_destination_tours_tour ON destination_tours(tour_id);

INSERT INTO destination_tours (destination_id, tour_id)
SELECT d.id, t.id
FROM destinations d
CROSS JOIN tours t
WHERE d.slug = 'hurghada' AND t.active = true
ON CONFLICT (destination_id, tour_id) DO NOTHING;
