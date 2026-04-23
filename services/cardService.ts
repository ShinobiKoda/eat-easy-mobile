import { supabase } from "../lib/Supabase";

export interface CardDetails {
  id?: string;
  card_number: string;
  card_holder: string;
  expiry_date: string;
}

export const cardService = {
  async saveCard(card: Omit<CardDetails, "id">) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("eat_easy_cards")
      .insert([
        {
          user_id: user.id,
          card_number: card.card_number,
          card_holder: card.card_holder,
          expiry_date: card.expiry_date,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserCards() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("eat_easy_cards")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching cards:", error);
      return [];
    }

    return (data || []).map((card: any) => ({
      id: card.id,
      cardNumber: card.card_number,
      cardHolder: card.card_holder,
      expiryDate: card.expiry_date,
    }));
  },
};
