import { supabase } from "./Supabase";

export async function getPostAuthRoute(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const locationSet = session?.user?.user_metadata?.location_set === true;
  return locationSet ? "/(protected)/Homepage" : "/(protected)/SetLocation";
}
