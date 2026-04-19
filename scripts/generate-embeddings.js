const { createClient } = require('@supabase/supabase-js');
const { AzureOpenAI } = require('openai');
require('dotenv').config({ path: '../.env.local' });

async function generateEmbeddings() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const openai = new AzureOpenAI({
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiKey: process.env.AZURE_OPENAI_KEY,
    apiVersion: '2024-02-15-preview',
  });

  const { data: sections, error } = await supabase
    .from('ndpa_sections')
    .select('id, content')
    .is('embedding', null);

  if (error) {
    console.error('Error fetching sections:', error);
    return;
  }

  console.log(`Generating embeddings for ${sections.length} sections...`);

  for (const section of sections) {
    const response = await openai.embeddings.create({
      model: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT,
      input: section.content,
    });

    const embedding = response.data[0].embedding;

    await supabase
      .from('ndpa_sections')
      .update({ embedding })
      .eq('id', section.id);

    console.log(`✅ Generated embedding for section ${section.id}`);
  }

  console.log('Done!');
}

generateEmbeddings();