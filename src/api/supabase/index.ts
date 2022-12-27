import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vbhqiigkkqsxlsqeaxes.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiaHFpaWdra3FzeGxzcWVheGVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2NjA5NjE5NiwiZXhwIjoxOTgxNjcyMTk2fQ.gRjTSC35uTu_mFzf_ANeH79raNWnn3DXl9x7z5sGMLg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
