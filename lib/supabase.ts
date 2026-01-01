import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://kcahksgdrowlbnwcvwfp.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjYWhrc2dkcm93bGJud2N2d2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDUwNzQsImV4cCI6MjA4MDc4MTA3NH0.fQDunZPiQv1z-8uWugcH-NMQwLKcRRPztO2W1xL5oZQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
