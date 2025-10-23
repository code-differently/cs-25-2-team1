import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function useEnsureProfile(defaultDisplayName?: string) {
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user;
        if (!user) return;

        const profile = {
          id: user.id,
          email: user.email,
          full_name: defaultDisplayName ?? user.user_metadata?.full_name ?? '',
          avatar_url: user.user_metadata?.avatar_url ?? null,
        };

        try {
          // Upsert ensures insert if missing, or does nothing if exists.
          const { data, error } = await supabase
            .from('users')
            .upsert([profile], { onConflict: 'id', ignoreDuplicates: false });

          if (error) {
            // Helpful debugging output for DB policy or permission issues
            console.error('Profile upsert error:', error);
            console.error('Error details:', {
              message: error.message,
              code: error.code,
              details: error.details,
              hint: error.hint
            });
          } else {
            console.log('Profile ensured:', data?.[0]);
          }
        } catch (err) {
          console.error('Unexpected error ensuring profile:', err);
        }
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [defaultDisplayName]);
}