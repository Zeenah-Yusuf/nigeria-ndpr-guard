-- ============================================
-- SEARCH FUNCTIONS FOR MULTI-FRAMEWORK SEARCH
-- ============================================

-- Function to match regulatory clauses using vector similarity
CREATE OR REPLACE FUNCTION match_regulatory_clauses(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.6,
  match_count INT DEFAULT 10,
  language_filter TEXT DEFAULT 'en',
  framework_filter TEXT[] DEFAULT NULL,
  sector_filter TEXT[] DEFAULT NULL,
  clause_type_filter TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  section_id UUID,
  title TEXT,
  content TEXT,
  similarity FLOAT,
  framework_name TEXT,
  clause_type TEXT,
  regulator_name TEXT,
  keywords TEXT[]
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cl.id AS section_id,
    cl.title,
    cl.content,
    1 - (cl.content_embedding <=> query_embedding) AS similarity,
    cl.framework_name,
    cl.clause_type,
    r.name AS regulator_name,
    cl.keywords
  FROM
    regulatory_clauses cl
    JOIN regulations reg ON cl.regulation_id = reg.id
    JOIN regulators r ON reg.regulator_id = r.id
  WHERE
    cl.is_current = true
    AND cl.content_embedding IS NOT NULL
    AND 1 - (cl.content_embedding <=> query_embedding) > match_threshold
    AND (framework_filter IS NULL OR cl.framework_name = ANY(framework_filter))
    AND (sector_filter IS NULL OR cl.affected_sectors && sector_filter)
    AND (clause_type_filter IS NULL OR cl.clause_type = ANY(clause_type_filter))
  ORDER BY
    cl.content_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Function for keyword-based full-text search
CREATE OR REPLACE FUNCTION keyword_search_clauses(
  search_query TEXT,
  match_count INT DEFAULT 10,
  framework_filter TEXT[] DEFAULT NULL,
  sector_filter TEXT[] DEFAULT NULL,
  clause_type_filter TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  section_id UUID,
  title TEXT,
  content TEXT,
  relevance FLOAT,
  framework_name TEXT,
  clause_type TEXT,
  regulator_name TEXT,
  keywords TEXT[]
)
LANGUAGE plpgsql
AS $$
DECLARE
  ts_query tsquery;
  search_terms TEXT[];
BEGIN
  -- Convert search query to tsquery
  ts_query := plainto_tsquery('english', search_query);
  
  -- Also create array of individual terms for ILIKE matching
  search_terms := string_to_array(regexp_replace(search_query, '[^a-zA-Z0-9\s]', '', 'g'), ' ');
  
  RETURN QUERY
  SELECT
    cl.id AS section_id,
    cl.title,
    cl.content,
    (
      ts_rank(
        to_tsvector('english', COALESCE(cl.title, '') || ' ' || COALESCE(cl.content, '')),
        ts_query
      ) * 0.6 +
      (CASE WHEN cl.title ILIKE '%' || search_terms[1] || '%' THEN 0.2 ELSE 0 END) +
      (CASE WHEN cl.content ILIKE '%' || search_terms[1] || '%' THEN 0.2 ELSE 0 END)
    ) AS relevance,
    cl.framework_name,
    cl.clause_type,
    r.name AS regulator_name,
    cl.keywords
  FROM
    regulatory_clauses cl
    JOIN regulations reg ON cl.regulation_id = reg.id
    JOIN regulators r ON reg.regulator_id = r.id
  WHERE
    cl.is_current = true
    AND (
      to_tsvector('english', COALESCE(cl.title, '') || ' ' || COALESCE(cl.content, '')) @@ ts_query
      OR cl.title ILIKE '%' || search_query || '%'
      OR cl.content ILIKE '%' || search_query || '%'
      OR EXISTS (
        SELECT 1 FROM unnest(cl.keywords) kw
        WHERE kw ILIKE '%' || search_query || '%'
      )
    )
    AND (framework_filter IS NULL OR cl.framework_name = ANY(framework_filter))
    AND (sector_filter IS NULL OR cl.affected_sectors && sector_filter)
    AND (clause_type_filter IS NULL OR cl.clause_type = ANY(clause_type_filter))
  ORDER BY
    relevance DESC
  LIMIT match_count;
END;
$$;

-- Function to get related clauses
CREATE OR REPLACE FUNCTION get_related_clauses(
  clause_id UUID,
  max_results INT DEFAULT 5
)
RETURNS TABLE (
  section_id UUID,
  title TEXT,
  content TEXT,
  similarity FLOAT,
  framework_name TEXT,
  clause_type TEXT,
  regulator_name TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  source_embedding VECTOR(1536);
BEGIN
  -- Get the embedding of the source clause
  SELECT content_embedding INTO source_embedding
  FROM regulatory_clauses
  WHERE id = clause_id;
  
  IF source_embedding IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT
    cl.id AS section_id,
    cl.title,
    cl.content,
    1 - (cl.content_embedding <=> source_embedding) AS similarity,
    cl.framework_name,
    cl.clause_type,
    r.name AS regulator_name
  FROM
    regulatory_clauses cl
    JOIN regulations reg ON cl.regulation_id = reg.id
    JOIN regulators r ON reg.regulator_id = r.id
  WHERE
    cl.id != clause_id
    AND cl.is_current = true
    AND cl.content_embedding IS NOT NULL
  ORDER BY
    cl.content_embedding <=> source_embedding
  LIMIT max_results;
END;
$$;

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_clauses_content_search 
ON regulatory_clauses USING GIN (to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(content, '')));

CREATE INDEX IF NOT EXISTS idx_clauses_framework_search 
ON regulatory_clauses(framework_name);

CREATE INDEX IF NOT EXISTS idx_clauses_type_search 
ON regulatory_clauses(clause_type);

-- Create vector index if there is data
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM regulatory_clauses WHERE content_embedding IS NOT NULL;
    IF row_count > 0 THEN
        CREATE INDEX IF NOT EXISTS idx_clauses_embedding_search 
        ON regulatory_clauses 
        USING ivfflat (content_embedding vector_cosine_ops)
        WITH (lists = 100);
    END IF;
END $$;