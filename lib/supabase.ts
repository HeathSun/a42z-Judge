import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cslplhzfcfvzsivsgrpc.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY); 