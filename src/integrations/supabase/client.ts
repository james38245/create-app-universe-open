// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mhrgoydmlzkhzkvaknxu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocmdveWRtbHpraHprdmFrbnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzIzMjksImV4cCI6MjA2NTUwODMyOX0.8eF11mz32LrNjt6brHqoTCeCEL7Tey9jqNcnERJdKkM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);