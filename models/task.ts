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