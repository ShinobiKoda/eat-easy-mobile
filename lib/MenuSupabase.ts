import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseMenuUrl = process.env.EXPO_PUBLIC_SUPABASE_MENU_URL!;
const supabaseMenuAnonKey = process.env.EXPO_PUBLIC_SUPABASE_MENU_ANON_KEY!;

export const supabaseMenuItems = createClient(supabaseMenuUrl, supabaseMenuAnonKey);