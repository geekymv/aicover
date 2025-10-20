import { NextRequest, NextResponse } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { genUuid } from "@/lib";
import { downloadAndUploadImage, uploadAudio, uploadImage } from "@/lib/s3";
import { Cover } from "@/types/cover";
import { User } from "@/types/user";
import { currentUser } from "@clerk/nextjs";
import { findUserByEmail } from "@/models/user";
import { insertCover } from "@/models/cover";
import { findTaskByTaskId } from '@/models/task'
import { Task } from "@/types/task";

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
    const user = await currentUser();
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return respErr("no auth");
    }
    const user_email = user.emailAddresses[0].emailAddress;
    const user_info = await findUserByEmail(user_email);
    if (!user_info || !user_info.uuid || !user_info.email) {
      return respErr("no auth");
    }

  try {
    const taskId = params.taskId;
    console.log(`Get task status: ${taskId}`);

    const task = await findTaskByTaskId(taskId)
    if (!task) {
      return respErr("task not found");
    }

    return respData({
      status: task.status
    }); 

    /*
    const baseUrl = process.env.NPE4J_BASE_URI;
    // 调用外部服务接口获取任务状态
    const response = await fetch(`${baseUrl}/ai/image/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    if (result.code === 200) {
        // 任务完成
        if (result.data.status === '2') {
            const imageUrls = JSON.parse(result.data.result);
            console.log('提取到的图片URL:', imageUrls);
            const date = new Date();
            const created_at = date.toISOString();
            const img_uuid = genUuid();
            const today = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
            const img_name = `covers/${today}/${img_uuid}.png`;
            const uploadResult = await downloadAndUploadImage(imageUrls[1], process.env.AWS_BUCKET || "", img_name);
            console.log('upload image result: ', uploadResult);
            const img_url = process.env.AWS_CDN_DOMAIN
            ? `${process.env.AWS_CDN_DOMAIN}/${img_name}`
            : `${process.env.AWS_BUCKET_DOMAIN}/${img_name}`; // Fallback to bucket domain if CDN not available  

            const cover: Cover = {
                user_email: user_info.email,
                img_description: result.data.params,
                img_size: "1024x1024",
                img_url: img_url,
                llm_name: 'gpt-4o-image',
                llm_params: JSON.stringify(params),
                created_at: created_at,
                uuid: img_uuid,
                status: 1,
                user_uuid: user_info.uuid,
            };

            await insertCover(cover);
        }
        return respData({
            status: result.data.status,
        });
    }
    */
  } catch (e) {
    console.log("gen image failed: ", e);
    return respErr("gen image failed");     
  }
}