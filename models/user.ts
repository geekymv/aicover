import { User } from "@/types/user";
import { getSupabaseClient } from "@/models/db";

export async function insertUser(user: User) {
  const createdAt: string = new Date().toISOString();

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("users").insert({
    email: user.email,
    nickname: user.nickname,
    avatar_url: user.avatar_url,
    created_at: createdAt,
    uuid: user.uuid,
  });

  if (error) throw error;
  return data;
}

export async function findUserByEmail(
  email: string
): Promise<User | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return undefined;
  return data as User;
}

export async function findUserByUuid(uuid: string): Promise<User | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error) return undefined;
  return data as User;
}
