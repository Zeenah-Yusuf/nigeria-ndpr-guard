-- ============================================
-- REGTRACK MULTI-REGULATOR SCHEMA
-- Complete migration with all tables, columns, and indexes
-- Supports: NDPA, CBN, SEC, NITDA frameworks
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================
-- 1. REGULATORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS regulators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    acronym VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(500),
    website_url TEXT,
    rss_feed_url TEXT,
    logo_url TEXT,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. SECTORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    risk_level INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. REGULATOR-SECTOR JUNCTION
-- ============================================
CREATE TABLE IF NOT EXISTS regulator_sectors (
    regulator_id UUID REFERENCES regulators(id) ON DELETE CASCADE,
    sector_id UUID REFERENCES sectors(id) ON DELETE CASCADE,
    PRIMARY KEY (regulator_id, sector_id)
);

-- ============================================
-- 4. REGULATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS regulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    regulator_id UUID REFERENCES regulators(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    short_title VARCHAR(200),
    document_type VARCHAR(100),
    framework_name VARCHAR(100),
    version VARCHAR(50) DEFAULT '1.0',
    effective_date DATE,
    publication_date DATE,
    source_url TEXT,
    file_hash VARCHAR(64),
    status VARCHAR(50) DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(regulator_id, title, version)
);

-- ============================================
-- 5. REGULATORY CLAUSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS regulatory_clauses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    regulation_id UUID REFERENCES regulations(id) ON DELETE CASCADE,
    clause_number VARCHAR(50),
    title VARCHAR(500),
    content TEXT NOT NULL,
    content_embedding VECTOR(1536),
    clause_type VARCHAR(100),
    keywords TEXT[],
    affected_sectors TEXT[],
    parent_clause_id UUID REFERENCES regulatory_clauses(id),
    framework_name VARCHAR(100),
    version INTEGER DEFAULT 1,
    is_current BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. CLAUSE VERSION HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS clause_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clause_id UUID REFERENCES regulatory_clauses(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    content TEXT NOT NULL,
    change_description TEXT,
    change_type VARCHAR(50),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. USER PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    company_name VARCHAR(255),
    company_size VARCHAR(50),
    website_url TEXT,
    phone_number VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. USER SECTORS
-- ============================================
CREATE TABLE IF NOT EXISTS user_sectors (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sector_id UUID REFERENCES sectors(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, sector_id)
);

-- ============================================
-- 9. COMPLIANCE SCANS
-- ============================================
CREATE TABLE IF NOT EXISTS compliance_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sector_id UUID REFERENCES sectors(id),
    scan_type VARCHAR(50) DEFAULT 'full',
    status VARCHAR(20) DEFAULT 'pending',
    results JSONB DEFAULT '{}',
    risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
    used_ai BOOLEAN DEFAULT false,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 10. USER COMPLIANCE STATUS
-- ============================================
CREATE TABLE IF NOT EXISTS user_compliance_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    clause_id UUID REFERENCES regulatory_clauses(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'not_started',
    evidence TEXT,
    notes TEXT,
    last_reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, clause_id)
);

-- ============================================
-- 11. REGULATORY UPDATES
-- ============================================
CREATE TABLE IF NOT EXISTS regulatory_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    regulator_id UUID REFERENCES regulators(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    summary TEXT,
    source_url TEXT NOT NULL UNIQUE,
    source_type VARCHAR(50),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed BOOLEAN DEFAULT false,
    relevance_score FLOAT DEFAULT 0,
    affected_sectors TEXT[],
    affected_frameworks TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 12. USER ALERTS
-- ============================================
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    update_id UUID REFERENCES regulatory_updates(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    relevance_score FLOAT DEFAULT 0,
    action_required BOOLEAN DEFAULT false,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    notification_sent BOOLEAN DEFAULT false,
    notification_type VARCHAR(20) DEFAULT 'in_app',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 13. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_regulators_category ON regulators(category);
CREATE INDEX IF NOT EXISTS idx_regulators_active ON regulators(is_active);
CREATE INDEX IF NOT EXISTS idx_sectors_slug ON sectors(slug);
CREATE INDEX IF NOT EXISTS idx_regulations_regulator ON regulations(regulator_id);
CREATE INDEX IF NOT EXISTS idx_regulations_framework ON regulations(framework_name);
CREATE INDEX IF NOT EXISTS idx_regulations_status ON regulations(status);
CREATE INDEX IF NOT EXISTS idx_clauses_regulation ON regulatory_clauses(regulation_id);
CREATE INDEX IF NOT EXISTS idx_clauses_framework ON regulatory_clauses(framework_name);
CREATE INDEX IF NOT EXISTS idx_clauses_type ON regulatory_clauses(clause_type);
CREATE INDEX IF NOT EXISTS idx_clauses_current ON regulatory_clauses(is_current);
CREATE INDEX IF NOT EXISTS idx_clauses_sectors ON regulatory_clauses USING GIN(affected_sectors);
CREATE INDEX IF NOT EXISTS idx_updates_regulator ON regulatory_updates(regulator_id);
CREATE INDEX IF NOT EXISTS idx_updates_processed ON regulatory_updates(processed);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_read ON alerts(is_read);

-- ============================================
-- 14. SEED REGULATORS
-- ============================================
INSERT INTO regulators (name, acronym, full_name, website_url, category) VALUES
    ('NDPC', 'NDPC', 'Nigeria Data Protection Commission', 'https://ndpc.gov.ng', 'data_protection'),
    ('CBN', 'CBN', 'Central Bank of Nigeria', 'https://www.cbn.gov.ng', 'financial'),
    ('SEC', 'SEC', 'Securities and Exchange Commission Nigeria', 'https://sec.gov.ng', 'securities'),
    ('NITDA', 'NITDA', 'National Information Technology Development Agency', 'https://nitda.gov.ng', 'technology')
ON CONFLICT (acronym) DO NOTHING;

-- ============================================
-- 15. SEED SECTORS
-- ============================================
INSERT INTO sectors (name, slug, description, risk_level) VALUES
    ('Financial Technology', 'fintech', 'Digital financial services', 8),
    ('Health Technology', 'healthtech', 'Digital health and telemedicine', 9),
    ('E-Commerce', 'ecommerce', 'Online retail and marketplaces', 6),
    ('Education Technology', 'edtech', 'Online learning platforms', 5),
    ('Agricultural Technology', 'agritech', 'Agricultural solutions', 5),
    ('Enterprise SaaS', 'enterprise', 'Business software and cloud services', 7),
    ('Social Media/Content', 'social_media', 'Social platforms and content', 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 16. MAP REGULATORS TO SECTORS
-- ============================================
INSERT INTO regulator_sectors (regulator_id, sector_id)
SELECT r.id, s.id FROM regulators r CROSS JOIN sectors s
WHERE (r.acronym = 'NDPC')
   OR (r.acronym = 'CBN' AND s.slug IN ('fintech', 'ecommerce'))
   OR (r.acronym = 'SEC' AND s.slug IN ('fintech', 'enterprise'))
   OR (r.acronym = 'NITDA' AND s.slug IN ('fintech', 'healthtech', 'edtech', 'agritech', 'enterprise', 'social_media'))
ON CONFLICT DO NOTHING;
