CREATE TABLE IF NOT EXISTS ui_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  locale TEXT NOT NULL,
  namespace TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(locale, namespace, key)
);

-- Track the latest version for client polling
CREATE TABLE IF NOT EXISTS ui_translations_version (
  id SERIAL PRIMARY KEY,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO ui_translations_version (version) VALUES (1);

-- Index for fast lookups by locale+namespace
CREATE INDEX IF NOT EXISTS idx_ui_translations_locale_namespace ON ui_translations(locale, namespace);
CREATE INDEX IF NOT EXISTS idx_ui_translations_locale ON ui_translations(locale);
