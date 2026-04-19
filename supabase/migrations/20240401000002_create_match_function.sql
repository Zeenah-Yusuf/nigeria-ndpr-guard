CREATE OR REPLACE FUNCTION match_ndpa_sections(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.6,
  match_count int DEFAULT 10,
  language_filter text DEFAULT 'en'
)
RETURNS TABLE (
  id BIGINT,
  section_id TEXT,
  title TEXT,
  content TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ns.id,
    ns.section_id,
    ns.title,
    ns.content,
    1 - (ns.embedding <=> query_embedding) AS similarity
  FROM ndpa_sections ns
  WHERE ns.embedding IS NOT NULL
    AND ns.language = language_filter
    AND 1 - (ns.embedding <=> query_embedding) > match_threshold
  ORDER BY ns.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;