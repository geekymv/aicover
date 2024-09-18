import { Cover } from "@/types/cover";
import { getSupabaseClient } from "@/models/db";

export async function insertCover(cover: Cover) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("covers").insert({
    user_email: cover.user_email,
    img_description: cover.img_description,
    img_size: cover.img_size,
    img_url: cover.img_url,
    llm_name: cover.llm_name,
    llm_params: cover.llm_params,
    created_at: cover.created_at,
    uuid: cover.uuid,
    status: cover.status,
    user_uuid: cover.user_uuid,
    is_uploaded: cover.is_uploaded,
  });

  if (error) throw error;
  return data;
}

export async function getCoversCount(): Promise<number> {
  const supabase = getSupabaseClient();
  const { count, error } = await supabase
    .from("covers")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count || 0;
}

export async function getUserCoversCount(user_email: string): Promise<number> {
  const supabase = getSupabaseClient();
  const { count, error } = await supabase
    .from("covers")
    .select("*", { count: "exact", head: true })
    .eq("user_email", user_email)
    .is("is_uploaded", false);

  if (error) throw error;
  return count || 0;
}

export async function findCoverById(id: number): Promise<Cover | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("covers")
    .select(
      `
      *,
      users:user_email (
        uuid,
        email,
        nickname,
        avatar_url
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) return undefined;
  return formatCover(data);
}

export async function findCoverByUuid(
  uuid: string
): Promise<Cover | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("covers")
    .select(
      `
      *,
      users:user_email (
        uuid,
        email,
        nickname,
        avatar_url
      )
    `
    )
    .eq("uuid", uuid)
    .single();

  if (error) return undefined;
  return formatCover(data);
}

export async function getRandomCovers(
  page: number,
  limit: number
): Promise<Cover[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("covers")
    .select(
      `
      *,
      users:user_email (
        uuid,
        email,
        nickname,
        avatar_url
      )
    `
    )
    .eq("status", 1)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;
  return data.map(formatCover);
}

export async function getCovers(page: number, limit: number): Promise<Cover[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("covers")
    .select(
      `
      *,
      users:user_email (
        uuid,
        email,
        nickname,
        avatar_url
      )
    `
    )
    .eq("status", 1)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;
  return data.map(formatCover);
}

export async function getUserCovers(
  user_email: string,
  page: number,
  limit: number
): Promise<Cover[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("covers")
    .select(
      `
      *,
      users:user_email (
        uuid,
        email,
        nickname,
        avatar_url
      )
    `
    )
    .eq("user_email", user_email)
    .not("img_url", "is", null)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;
  return data.map(formatCover);
}

export async function getRecommendedCovers(
  page: number,
  limit: number
): Promise<Cover[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("covers")
    .select(
      `
      *,
      users:user_email (
        uuid,
        email,
        nickname,
        avatar_url
      )
    `
    )
    .eq("is_recommended", true)
    .eq("status", 1)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;
  return data.map(formatCover);
}

export async function getAwesomeCovers(
  page: number,
  limit: number
): Promise<Cover[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("covers")
    .select(
      `
      *,
      users:user_email (
        uuid,
        email,
        nickname,
        avatar_url
      )
    `
    )
    .eq("is_awesome", true)
    .eq("status", 1)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;
  return data.map(formatCover);
}

export async function getBrandCovers(
  page: number,
  limit: number
): Promise<Cover[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("covers")
    .select(
      `
      *,
      users:user_email (
        uuid,
        email,
        nickname,
        avatar_url
      )
    `
    )
    .eq("is_brand", true)
    .eq("status", 1)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;
  return data.map(formatCover);
}

function formatCover(row: any): Cover {
  let cover: Cover = {
    id: row.id,
    user_email: row.user_email,
    img_description: row.img_description,
    img_size: row.img_size,
    img_url: row.img_url,
    llm_name: row.llm_name,
    llm_params: row.llm_params,
    created_at: row.created_at,
    uuid: row.uuid,
    status: row.status,
    is_recommended: row.is_recommended,
    user_uuid: row.user_uuid,
    is_uploaded: row.is_uploaded,
    is_awesome: row.is_awesome,
    is_brand: row.is_brand,
  };

  if (row.users) {
    cover.created_user = {
      email: row.users.email,
      nickname: row.users.nickname,
      avatar_url: row.users.avatar_url,
      uuid: row.users.uuid,
    };
  }

  try {
    cover.llm_params = JSON.parse(JSON.stringify(cover.llm_params));
  } catch (e) {
    console.log("parse cover llm_params failed: ", e);
  }

  return cover;
}
