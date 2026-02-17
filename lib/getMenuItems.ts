import type { PropType } from "@/types/menuItem";
import { supabaseMenuItems } from "./MenuSupabase";


export async function getMenuItems() {
  const { data, error } = await supabaseMenuItems
    .from("menu_items")
    .select("*");

  if (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }

  return (data || []).map((item) => ({
    id: Number(item.id),
    category: item.category,
    name: item.name,
    image: item.image,
    rating: item.rating,
    reviews: item.reviews,
    price: item.price,
    text: item.text,
    nutrients: item.nutrients || [],
    ingredients: item.ingredients || [],
    toppings: item.toppings || [],
    tag: item.tag || [],
  })) as (PropType & { category: string })[];
}
