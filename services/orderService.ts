import { supabase } from "../lib/Supabase";

export interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: number;
  qty: number;
}

export interface SaveOrderPayload {
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
}

export interface OrderRecord {
  id: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  createdAt: string;
}

export const orderService = {
  async saveOrder(order: SaveOrderPayload): Promise<OrderRecord> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("eat_easy_orders")
      .insert([
        {
          user_id: user.id,
          restaurant_name: order.restaurantName,
          items: order.items,
          subtotal: order.subtotal,
          tax: order.tax,
          tip: order.tip,
          total: order.total,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return mapRow(data);
  },

  async getUserOrders(): Promise<OrderRecord[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("eat_easy_orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return [];
    }

    return (data || []).map(mapRow);
  },
};

function mapRow(row: any): OrderRecord {
  return {
    id: row.id,
    restaurantName: row.restaurant_name,
    items: row.items || [],
    subtotal: Number(row.subtotal),
    tax: Number(row.tax),
    tip: Number(row.tip),
    total: Number(row.total),
    createdAt: row.created_at,
  };
}
