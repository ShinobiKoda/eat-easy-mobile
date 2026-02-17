import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://axmldlvejcfbopctqkrw.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4bWxkbHZlamNmYm9wY3Rxa3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyOTgzMTEsImV4cCI6MjA4NTg3NDMxMX0.8sTKb5cG55foE7sHb0VuJj34-OkCMY7nTzHZ1P6CHdo";

export const supabaseMenuItems = createClient(supabaseUrl, supabaseAnonKey);



