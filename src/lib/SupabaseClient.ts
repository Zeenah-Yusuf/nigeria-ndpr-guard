// src/lib/SupabaseClient.ts
// Multi-framework Supabase client with type support
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ Missing Supabase environment variables.\n' +
    '   Check your .env.local file for:\n' +
    '   - VITE_SUPABASE_URL\n' +
    '   - VITE_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'x-app-name': 'regtrack',
        'x-app-version': '2.0.0',
      },
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseAnonKey;
}

/**
 * Get all clauses for a specific framework
 */
export async function getClausesByFramework(frameworkName: string) {
  const { data, error } = await supabase
    .from('regulatory_clauses')
    .select('*')
    .eq('framework_name', frameworkName)
    .eq('is_current', true)
    .order('clause_number');

  if (error) {
    console.error(`Error fetching clauses for ${frameworkName}:`, error);
    return [];
  }
  return data;
}

/**
 * Get all clauses for a specific sector
 */
export async function getClausesBySector(sector: string) {
  const { data, error } = await supabase
    .from('regulatory_clauses')
    .select('*')
    .contains('affected_sectors', [sector])
    .eq('is_current', true)
    .order('framework_name');

  if (error) {
    console.error(`Error fetching clauses for sector ${sector}:`, error);
    return [];
  }
  return data;
}

/**
 * Get all frameworks
 */
export async function getAllFrameworks() {
  const { data, error } = await supabase
    .from('regulations')
    .select('*')
    .eq('status', 'active')
    .order('framework_name');

  if (error) {
    console.error('Error fetching frameworks:', error);
    return [];
  }
  return data;
}

/**
 * Get all regulators
 */
export async function getAllRegulators() {
  const { data, error } = await supabase
    .from('regulators')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching regulators:', error);
    return [];
  }
  return data;
}

/**
 * Get all sectors
 */
export async function getAllSectors() {
  const { data, error } = await supabase
    .from('sectors')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching sectors:', error);
    return [];
  }
  return data;
}

/**
 * Get user's compliance scans
 */
export async function getUserScans(userId: string) {
  const { data, error } = await supabase
    .from('compliance_scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user scans:', error);
    return [];
  }
  return data;
}

/**
 * Get user's alerts
 */
export async function getUserAlerts(userId: string) {
  const { data, error } = await supabase
    .from('alerts')
    .select(`
      *,
      regulatory_updates(*)
    `)
    .eq('user_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching user alerts:', error);
    return [];
  }
  return data;
}

/**
 * Mark alert as read
 */
export async function markAlertAsRead(alertId: string) {
  const { error } = await supabase
    .from('alerts')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', alertId);

  if (error) {
    console.error('Error marking alert as read:', error);
    return false;
  }
  return true;
}

export default supabase;