'use client';

import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Invisible component — fires once after a user signs in or signs up.
 * Calls POST /api/dealio/customers/sync to create or find their Dealio
 * customer record, then stores the dealio_customer_id in customer_profiles.
 */
export function DealioCustomerSync() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Only sync on initial sign-in or sign-up — not on every token refresh
      if (event !== 'SIGNED_IN' || !session?.user) return;

      const { user } = session;

      // Check if already synced to avoid unnecessary API calls
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('dealio_customer_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if ((profile as any)?.dealio_customer_id) return;

      const nameParts = (user.user_metadata?.full_name ?? '').split(' ');
      const firstName = nameParts[0] ?? '';
      const lastName = nameParts.slice(1).join(' ') ?? '';

      try {
        await fetch('/api/dealio/customers/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            firstName,
            lastName,
            email: user.email,
            phone: user.user_metadata?.phone ?? undefined,
          }),
        });
      } catch {
        // Sync is best-effort — do not block the user experience on failure
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
