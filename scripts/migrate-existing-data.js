// scripts/migrate-existing-data.js
// Migrates existing NDPA data to new multi-framework schema

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrateNDPAData() {
  console.log('🔄 Starting data migration...\n');

  // 1. Get NDPC regulator ID
  const { data: ndpc, error: ndpcError } = await supabase
    .from('regulators')
    .select('id')
    .eq('acronym', 'NDPC')
    .single();

  if (ndpcError) {
    console.error('❌ Could not find NDPC regulator:', ndpcError.message);
    return;
  }

  console.log('✅ Found NDPC regulator:', ndpc.id);

  // 2. Create NDPA regulation entry if it doesn't exist
  const { data: regulation, error: regError } = await supabase
    .from('regulations')
    .upsert({
      regulator_id: ndpc.id,
      title: 'Nigeria Data Protection Act 2023',
      short_title: 'NDPA 2023',
      document_type: 'act',
      framework_name: 'NDPA',
      effective_date: '2023-06-12',
      status: 'active',
    }, { onConflict: 'regulator_id, title, version' })
    .select('id')
    .single();

  if (regError) {
    console.error('❌ Could not create regulation:', regError.message);
    return;
  }

  console.log('✅ Created/found regulation:', regulation.id);

  // 3. Fetch existing NDPA sections
  const { data: oldSections, error: fetchError } = await supabase
    .from('ndpa_sections')
    .select('*');

  if (fetchError) {
    console.error('❌ Could not fetch ndpa_sections:', fetchError.message);
    return;
  }

  console.log(`📊 Found ${oldSections.length} existing NDPA sections\n`);

  // 4. Migrate each section to regulatory_clauses
  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const section of oldSections) {
    try {
      // Check if already migrated
      const { data: existing } = await supabase
        .from('regulatory_clauses')
        .select('id')
        .eq('regulation_id', regulation.id)
        .eq('clause_number', section.section_number || section.id.toString())
        .single();

      if (existing) {
        console.log(`  ⏭️  Section ${section.section_number} already migrated, skipping`);
        skipped++;
        continue;
      }

      // Insert into new schema
      const { error: insertError } = await supabase
        .from('regulatory_clauses')
        .insert({
          regulation_id: regulation.id,
          clause_number: section.section_number || `Section ${section.id}`,
          title: section.title || `NDPA Section ${section.id}`,
          content: section.content,
          content_embedding: section.embedding, // Preserve existing embedding
          clause_type: 'general',
          keywords: extractKeywords(section.content),
          affected_sectors: ['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'],
          framework_name: 'NDPA',
          version: 1,
          is_current: true,
        });

      if (insertError) {
        console.error(`  ❌ Failed to migrate section ${section.id}:`, insertError.message);
        failed++;
      } else {
        console.log(`  ✅ Migrated section ${section.section_number || section.id}`);
        migrated++;
      }
    } catch (error) {
      console.error(`  ❌ Error migrating section ${section.id}:`, error.message);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Migrated: ${migrated}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📝 Total: ${oldSections.length}`);
  console.log('='.repeat(60));
}

function extractKeywords(content) {
  const keywords = [
    'data protection', 'privacy', 'consent', 'security',
    'encryption', 'breach', 'notification', 'compliance',
    'audit', 'assessment', 'penalty', 'fine'
  ];
  
  const lowerContent = content.toLowerCase();
  return keywords.filter(kw => lowerContent.includes(kw));
}

// Run migration
migrateNDPAData()
  .then(() => {
    console.log('\n🎉 Migration completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });