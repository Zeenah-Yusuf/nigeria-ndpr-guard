import { useEffect, useRef } from "react";
import { supabase } from "@/lib/SupabaseClient";

type TableName = 'compliance_scans' | 'user_compliance_status' | 'dpco_organization_links' | 'user_profiles';

interface FilterOptions {
  user_id?: string;
  organization_id?: string;
  dpco_id?: string;
}

export function useRealtimeSync(
  table: TableName,
  callback: () => void,
  filter?: FilterOptions
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const filterStr = filter
      ? Object.entries(filter)
          .filter(([_, v]) => v !== undefined)
          .map(([k, v]) => `${k}=eq.${v}`)
          .join(',')
      : undefined;

    const channelName = filterStr 
      ? `${table}:${filterStr}`
      : table;

    // @ts-ignore - Supabase realtime types
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table,
          filter: filterStr,
        },
        () => {
          callbackRef.current();
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Realtime: ${table}`);
        }
      });

    return () => {
      supabase.removeChannel(channel).catch(() => {});
    };
  }, [table, JSON.stringify(filter)]);
}