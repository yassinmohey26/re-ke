-- DRAFT: requires Yassin's written approval before running on live data.
BEGIN;

ALTER TABLE public.reviews
  ADD COLUMN review_type TEXT NOT NULL DEFAULT 'tour'
    CHECK (review_type IN ('company', 'tour', 'transfer')),
  ALTER COLUMN tour_id DROP NOT NULL,
  DROP CONSTRAINT reviews_tour_id_fkey,
  ADD CONSTRAINT reviews_tour_id_fkey
    FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE SET NULL,
  ADD CONSTRAINT reviews_scope_check
    CHECK (review_type = 'tour' OR tour_id IS NULL);

CREATE TABLE public.review_tours (
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  tour_id UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  PRIMARY KEY (review_id, tour_id)
);
CREATE INDEX idx_review_tours_tour ON public.review_tours(tour_id, review_id);
ALTER TABLE public.review_tours ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.review_tours FROM anon, authenticated;
GRANT ALL ON public.review_tours TO service_role;

INSERT INTO public.review_tours (review_id, tour_id)
SELECT id, tour_id FROM public.reviews WHERE tour_id IS NOT NULL;

CREATE INDEX idx_reviews_type_published
  ON public.reviews(review_type, is_published, sort_order);

-- One transaction saves content, relationships and display order together.
-- The legacy tour_id remains the first selected tour for rollout compatibility.
CREATE FUNCTION public.save_review_with_tours(
  p_id UUID, p_review JSONB, p_tour_ids UUID[]
) RETURNS JSONB
LANGUAGE plpgsql SECURITY INVOKER SET search_path = public
AS $$
DECLARE
  v_id UUID := COALESCE(p_id, gen_random_uuid());
  v_row public.reviews;
  v_tours UUID[] := COALESCE(p_tour_ids, ARRAY[]::UUID[]);
  v_position INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(130013);
  IF p_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.reviews WHERE id = p_id FOR UPDATE
  ) THEN
    RAISE EXCEPTION 'Review not found' USING ERRCODE = 'P0002';
  END IF;

  v_row := jsonb_populate_record(NULL::public.reviews, p_review);
  IF v_row.review_type IS NULL OR v_row.review_type NOT IN ('company', 'tour', 'transfer') THEN
    RAISE EXCEPTION 'Invalid review type';
  END IF;
  IF v_row.review_type = 'tour' AND cardinality(v_tours) = 0 THEN
    RAISE EXCEPTION 'At least one tour is required';
  END IF;
  IF v_row.review_type <> 'tour' AND cardinality(v_tours) <> 0 THEN
    RAISE EXCEPTION 'Only tour reviews may link to tours';
  END IF;
  IF EXISTS (
    SELECT 1 FROM unnest(v_tours) AS selected(id)
    WHERE id IS NULL OR NOT EXISTS (SELECT 1 FROM public.tours t WHERE t.id = selected.id)
  ) THEN
    RAISE EXCEPTION 'Selected tour was not found' USING ERRCODE = '23503';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM jsonb_each(v_row.translations) AS tr(locale, content)
    WHERE tr.locale IN ('de', 'en', 'fr', 'hu', 'ru', 'ar')
      AND length(trim(tr.content->>'body')) > 0
  ) THEN
    RAISE EXCEPTION 'Review text is required in at least one language';
  END IF;

  INSERT INTO public.reviews (
    id, review_type, tour_id, guest_name, guest_country, country_code,
    guest_image, travel_date, rating, translations, is_verified,
    is_published, featured, sort_order, updated_at
  ) VALUES (
    v_id, v_row.review_type, v_tours[1], v_row.guest_name,
    v_row.guest_country, v_row.country_code, v_row.guest_image,
    v_row.travel_date, v_row.rating, v_row.translations,
    v_row.is_verified, v_row.is_published, v_row.featured,
    v_row.sort_order, now()
  ) ON CONFLICT (id) DO UPDATE SET
    review_type = EXCLUDED.review_type, tour_id = EXCLUDED.tour_id,
    guest_name = EXCLUDED.guest_name, guest_country = EXCLUDED.guest_country,
    country_code = EXCLUDED.country_code, guest_image = EXCLUDED.guest_image,
    travel_date = EXCLUDED.travel_date, rating = EXCLUDED.rating,
    translations = EXCLUDED.translations, is_verified = EXCLUDED.is_verified,
    is_published = EXCLUDED.is_published, featured = EXCLUDED.featured,
    sort_order = EXCLUDED.sort_order, updated_at = now();

  DELETE FROM public.review_tours WHERE review_id = v_id;
  INSERT INTO public.review_tours(review_id, tour_id)
    SELECT DISTINCT v_id, id FROM unnest(v_tours) AS selected(id);

  SELECT LEAST(GREATEST(1, v_row.sort_order), count(*)::INTEGER)
    INTO v_position FROM public.reviews;
  WITH others AS (
    SELECT id, row_number() OVER (
      ORDER BY CASE WHEN sort_order > 0 THEN sort_order ELSE 2147483647 END,
        created_at, id
    )::INTEGER AS position
    FROM public.reviews WHERE id <> v_id
  ), positions AS (
    SELECT id, CASE WHEN position >= v_position THEN position + 1 ELSE position END AS position
    FROM others
    UNION ALL SELECT v_id, v_position
  )
  UPDATE public.reviews r SET sort_order = p.position
  FROM positions p WHERE r.id = p.id AND r.sort_order <> p.position;

  RETURN (SELECT to_jsonb(r) FROM public.reviews r WHERE r.id = v_id);
END;
$$;

REVOKE ALL ON FUNCTION public.save_review_with_tours(UUID, JSONB, UUID[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_review_with_tours(UUID, JSONB, UUID[]) TO service_role;
NOTIFY pgrst, 'reload schema';
COMMIT;
