import { Order } from "@/types/order";
import { getSupabaseClient } from "@/models/db";

export async function insertOrder(order: Order) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("orders").insert({
    order_no: order.order_no,
    created_at: order.created_at,
    user_email: order.user_email,
    amount: order.amount,
    plan: order.plan,
    expired_at: order.expired_at,
    order_status: order.order_status,
    credits: order.credits,
    currency: order.currency,
    user_uuid: order.user_uuid,
  });

  if (error) throw error;
  return data;
}

export async function findOrderByOrderNo(
  order_no: number
): Promise<Order | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_no", order_no)
    .single();

  if (error) return undefined;
  return data as Order;
}

export async function updateOrderStatus(
  order_no: string,
  order_status: number,
  paied_at: string
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ order_status, paied_at })
    .eq("order_no", order_no);

  if (error) throw error;
  return data;
}

export async function updateOrderSession(
  order_no: string,
  stripe_session_id: string
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ stripe_session_id })
    .eq("order_no", order_no);

  if (error) throw error;
  return data;
}

export async function getUserOrders(
  user_email: string
): Promise<Order[] | undefined> {
  const now = new Date().toISOString();
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_email", user_email)
    .eq("order_status", 2)
    .gte("expired_at", now);

  if (error) return undefined;
  return data as Order[];
}

// The formatOrder function is no longer needed as Supabase
// automatically formats the data into the correct type
