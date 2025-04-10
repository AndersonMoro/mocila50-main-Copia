import { createClient } from '@supabase/supabase-js';

// Substitua estas URLs pelas suas credenciais reais do Supabase
const supabaseUrl = 'https://mouarmldgklnqycmepyq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdWFybWxkZ2tsbnF5Y21lcHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNjU5NjYsImV4cCI6MjA1OTY0MTk2Nn0.RrhRTzkdRVUKy7lrWa31ZgoB6bSCaaIEFaSw_LmB-pE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);