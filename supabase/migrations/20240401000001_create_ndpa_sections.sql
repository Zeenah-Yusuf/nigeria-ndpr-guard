CREATE TABLE IF NOT EXISTS ndpa_sections (
  id BIGSERIAL PRIMARY KEY,
  section_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  plain_summary TEXT,
  keywords TEXT[],
  language TEXT NOT NULL DEFAULT 'en',
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section_id, language)
);

CREATE INDEX IF NOT EXISTS idx_ndpa_sections_language ON ndpa_sections (language);
CREATE INDEX IF NOT EXISTS idx_ndpa_sections_keywords ON ndpa_sections USING GIN (keywords);

ALTER TABLE ndpa_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ndpa_sections FOR SELECT USING (true);