import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { genUuid } from "@/lib";
import { insertCover } from "@/models/cover";
import { findTaskByTaskId, updateTaskStatus } from "@/models/task";
import { TaskStatus } from "@/types/task";
import { findUserByUuid } from "@/models/user";
import { Cover } from "@/types/cover";

export async function POST(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = params.taskId;
    const task = await findTaskByTaskId(taskId);
    if (!task) {
      return respErr("task not found");
    }
    const body = await request.json();
    console.log('call back params:', body);

    const imageUrls: string[] = body?.imageUrls || [];
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      await updateTaskStatus(taskId, TaskStatus.FAILED);
      return respErr("imageUrls required");
    }

    const userInfo = task.user_uuid ? await findUserByUuid(task.user_uuid) : undefined;
    const date = new Date();
    const created_at = date.toISOString();
    let taskParams = {
        model: "gpt-4o-image",
        prompt: "",
        aspectRatio: "2:3",
        outputs: 1
    }
    if (task.params) {
        taskParams = JSON.parse(task.params);
    }
    
    for (const img_url of imageUrls) {
      const img_uuid = genUuid();
      const cover: Cover = {
        user_email: userInfo?.email || "",
        img_description: taskParams.prompt,
        img_size: taskParams.aspectRatio,
        img_url: img_url,
        llm_name: taskParams.model,
        llm_params: taskParams,
        created_at,
        uuid: img_uuid,
        status: 1,
        user_uuid: userInfo?.uuid,
      };
      await insertCover(cover);
    }

    await updateTaskStatus(taskId, TaskStatus.SUCCESS);

    return respData({ ok: true });
  } catch (e) {
    console.log("submit task result failed", e);
    return respErr("submit task result failed");
  }
}


