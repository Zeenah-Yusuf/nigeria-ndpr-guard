CREATE TABLE IF NOT EXISTS scan_logs (
  id BIGSERIAL PRIMARY KEY,
  answers JSONB,
  risk_score INTEGER,
  risk_level TEXT,
  dcpm_tier TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE scan_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow inserts from service role" ON scan_logs FOR INSERT WITH CHECK (true);