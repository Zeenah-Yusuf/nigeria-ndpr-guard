-- DPCO-Organization linking table
CREATE TABLE IF NOT EXISTS dpco_organization_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dpco_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(dpco_id, organization_id)
);

-- Add verification status to compliance
ALTER TABLE user_compliance_status ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES user_profiles(id);
ALTER TABLE user_compliance_status ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;