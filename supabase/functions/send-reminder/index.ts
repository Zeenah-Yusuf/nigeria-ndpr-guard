import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const { to, dpcoName, organizationName, appName, pendingCount } = await req.json();

  // In production, use a real email service like Resend or SendGrid
  console.log(`Reminder sent to ${to}: ${organizationName} has ${pendingCount} pending approvals for ${appName}`);

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});