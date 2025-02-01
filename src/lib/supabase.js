import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://YOUR_PROJECT_URL.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY';
export const supabase = createClient(supabaseUrl, supabaseKey);
