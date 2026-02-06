import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://xnxfyqqjrtjbjwceozbj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueGZ5cXFqcnRqYmp3Y2VvemJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDQ4ODgsImV4cCI6MjA2NzQ4MDg4OH0.Bz2MAusSfe8TENl-i_6WrdMNLMAJHel7yaE_IA-ECEg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
