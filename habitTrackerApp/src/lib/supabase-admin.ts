/// <reference types="node" />

import { createClient } from '@supabase/supabase-js'

// Server-side only - ensure this runs in Node.js environment
if (typeof window !== 'undefined') {
  throw new Error('supabase-admin should only be used on the server side')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

// Admin client for server-side operations (uses service role key)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
