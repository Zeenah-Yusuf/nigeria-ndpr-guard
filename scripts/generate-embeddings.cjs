// scripts/generate-embeddings.cjs
// Generates Voyage AI embeddings for all regulatory clauses
// Model: voyage-3-large (1536 dimensions)

const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') });

// Switch to voyage-3-large which outputs 1536 dimensions
const VOYAGE_API_URL = 'https://api.voyageai.com/v1/embeddings';
const VOYAGE_MODEL = 'voyage-3-large';
const DELAY_MS = 3000; // Increased delay to avoid rate limits

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const VOYAGE_KEY = process.env.VOYAGE_API_KEY;

if (!SUPABASE_URL) { console.error('Missing SUPABASE_URL'); process.exit(1); }
if (!SUPABASE_KEY) { console.error('Missing SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }
if (!VOYAGE_KEY) { console.error('Missing VOYAGE_API_KEY'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function getEmbedding(text) {
  const response = await fetch(VOYAGE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + VOYAGE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: VOYAGE_MODEL,
      input: text.substring(0, 2000),
    }),
  });

  if (response.status === 429) {
    console.log('Rate limited, waiting 30s...');
    await new Promise(r => setTimeout(r, 30000));
    return getEmbedding(text);
  }

  if (!response.ok) {
    const errText = await response.text();
    throw new Error('API ' + response.status + ': ' + errText.substring(0, 200));
  }

  const data = await response.json();
  return data.data[0].embedding;
}

function prepareText(clause) {
  const parts = [];
  if (clause.framework_name) parts.push(clause.framework_name);
  if (clause.clause_number) parts.push(clause.clause_number);
  if (clause.title) parts.push(clause.title);
  if (clause.content) parts.push(clause.content);
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

async function main() {
  console.log('='.repeat(60));
  console.log('RegTrack Embeddings Generator');
  console.log('='.repeat(60));
  console.log('API: Voyage AI');
  console.log('Model: ' + VOYAGE_MODEL + ' (1536 dimensions)');
  console.log('='.repeat(60));
  console.log('');

  const { data: clauses, error, count } = await supabase
    .from('regulatory_clauses')
    .select('id, clause_number, title, content, framework_name')
    .is('content_embedding', null)
    .eq('is_current', true);

  if (error) { console.error('DB Error: ' + error.message); process.exit(1); }
  if (!clauses || clauses.length === 0) { console.log('All clauses already have embeddings.'); return; }

  console.log('Found ' + count + ' clauses without embeddings');
  console.log('Delay: ' + DELAY_MS + 'ms per request');
  console.log('');

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < clauses.length; i++) {
    const c = clauses[i];
    const num = i + 1;
    const text = prepareText(c);

    try {
      const emb = await getEmbedding(text);
      if (!emb || emb.length !== 1024) {
        throw new Error('Got ' + (emb ? emb.length : 0) + ' dimensions, expected 1536');
      }
      const { error: upErr } = await supabase
        .from('regulatory_clauses')
        .update({ content_embedding: emb, updated_at: new Date().toISOString() })
        .eq('id', c.id);

      if (upErr) throw new Error(upErr.message);
      ok++;
      console.log('[' + num + '/' + count + '] OK  ' + c.framework_name + ' ' + c.clause_number);
    } catch (err) {
      fail++;
      console.error('[' + num + '/' + count + '] FAIL ' + c.clause_number + ': ' + err.message);
    }

    if (i < clauses.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('Done: ' + ok + ' success, ' + fail + ' failed');
  console.log('='.repeat(60));
  if (fail > 0) console.log('Re-run to retry failed clauses.');
}

main().then(() => process.exit(0)).catch(e => { console.error(e.message); process.exit(1); });