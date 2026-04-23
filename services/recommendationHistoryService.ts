import { supabase } from "../lib/Supabase";

export interface Recommendation {
  id: string;
  user_id: string;
  moods: string[];
  budget_range: string;
  party_size: string;
  food_preferences: string[];
  item_ids: number[];
  created_at: string;
}

export interface RecommendationInput {
  moods: string[];
  budgetRange: string;
  partySize: string;
  foodPreferences: string[];
  itemIds: number[];
}

export async function getLatestRecommendation(): Promise<Recommendation | null> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data, error } = await supabase
    .from("recommendations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as Recommendation;
}

export async function saveRecommendation(
  input: RecommendationInput,
): Promise<Recommendation | null> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("You must be logged in to save recommendations.");

  const { data, error } = await supabase
    .from("recommendations")
    .insert({
      user_id: user.id,
      moods: input.moods,
      budget_range: input.budgetRange,
      party_size: input.partySize,
      food_preferences: input.foodPreferences,
      item_ids: input.itemIds,
    })
    .select()
    .single();

  if (error) throw new Error("Failed to save recommendation. Please try again.");
  return data as Recommendation;
}

export async function hasRecommendations(): Promise<boolean> {
  const rec = await getLatestRecommendation();
  return rec !== null;
}
