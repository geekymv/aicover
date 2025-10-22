import { Task, TaskStatus } from "@/types/task";
import { getSupabaseClient } from "@/models/db";

export async function insertTask(task: Task) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("tasks").insert({
    uuid: task.uuid,
    created_at: task.created_at,
    credits: task.credits,
    user_uuid: task.user_uuid,
    params: task.params,
    status: task.status,
  });

  if (error) {
    console.log('insertTask error:', error)
  }
}

export async function findTaskByTaskId(taskId: string): Promise<Task | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("tasks").select("*").eq("uuid", taskId).single();
  if (error) return undefined;
  return data as Task;
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.from("tasks").update({ status }).eq("uuid", taskId);
}

export async function getUsedCreditsByUser(userUuid: string): Promise<number> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("credits")
    .eq("user_uuid", userUuid)
    .in("status", [TaskStatus.SUCCESS, TaskStatus.ON_GOING]); // 只计算成功和进行中的任务
  
  if (error) throw error;
  
  return data.reduce((total, task) => total + task.credits, 0);
}

export async function getUsedCreditsByEmail(userEmail: string): Promise<number> {
  // 先通过 user_email 找到 user_uuid，然后计算积分
  const supabase = getSupabaseClient();
  
  // 获取用户信息
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("uuid")
    .eq("email", userEmail)
    .single();
  
  if (userError || !userData) return 0;
  
  // 计算该用户的积分使用量
  const { data, error } = await supabase
    .from("tasks")
    .select("credits")
    .eq("user_uuid", userData.uuid)
    .in("status", [TaskStatus.SUCCESS, TaskStatus.ON_GOING]); // 只计算成功和进行中的任务
  
  if (error) throw error;
  
  return data.reduce((total, task) => total + task.credits, 0);
}

export async function getTotalUsedCredits(): Promise<number> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("credits")
    .in("status", [TaskStatus.SUCCESS, TaskStatus.ON_GOING]); // 只计算成功和进行中的任务
  
  if (error) throw error;
  
  return data.reduce((total, task) => total + task.credits, 0);
}