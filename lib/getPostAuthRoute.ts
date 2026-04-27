import { supabase } from "./Supabase";

export async function getPostAuthRoute(): Promise<string> {
  // Always go to Homepage after auth — location is handled silently in the background
  return "/(protected)/Homepage";
}
