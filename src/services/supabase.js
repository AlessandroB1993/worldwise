import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://tqvxtbzovjddorbizxpk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdnh0YnpvdmpkZG9yYml6eHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NTI1MjksImV4cCI6MjA2MTQyODUyOX0.7kGbkNFaV1Xv1KlbhGj1JfNFA8abDSNsex-MJlz3O6w";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
