import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL: Missing Supabase environment variables! Check Vercel project settings.');
}

// Create client with fallback/empty strings to prevent module-level crash.
// Operations will fail if keys are invalid, but the app won't crash on boot.
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder-key'
);
