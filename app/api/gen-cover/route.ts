import { downloadAndUploadImage, uploadAudio, uploadImage } from "@/lib/s3";
import { respData, respErr } from "@/lib/resp";

import { Cover } from "@/types/cover";
import { ImageGenerateParams } from "openai/resources/images.mjs";
import { User } from "@/types/user";
import { currentUser } from "@clerk/nextjs";
import { downloadAndUploadImage as downloadAndUploadImageWithCos } from "@/lib/cos";
import { findUserByEmail } from "@/models/user";
import { genUuid } from "@/lib";
import { experimental_generateImage as generateImage } from "ai";
import { getOpenAIClient } from "@/services/openai";
import { getUserCredits } from "@/services/order";
import { insertCover } from "@/models/cover";
import { replicate } from "@ai-sdk/replicate";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { tuziChatCompletion } from "@/services/tuzi";
import { insertTask } from "@/models/task";
import { TaskStatus } from "@/types/task";

export const runtime = "edge";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
    return respErr("no auth");
  }
  const user_email = user.emailAddresses[0].emailAddress;

  try {
    const { description, taskType, aspectRatio, outputs } = await req.json();
    if (!description) {
      return respErr("invalid params");
    }

    const user_info = await findUserByEmail(user_email);
    if (!user_info || !user_info.uuid || !user_info.email) {
      return respErr("no auth");
    }

    // 检查用户积分
    const user_credits = await getUserCredits(user_info.email);
    if (!user_credits || user_credits.left_credits < outputs) {
      return respErr("credits not enough");
    }

    // const cover = await genCoverWithOpenAI(description, user);
    // const cover = await genCoverWithReplicate(description, user_info);
    // const cover = await genCoverWithTogether(description, user_info);
    // const cover = await genCoverWithTuzi(description, user_info);
    // await insertCover(cover);
    const taskId = await genCoverWithExternalAPI(user_info, description, taskType, aspectRatio, outputs);
    return respData({taskId: taskId});

  } catch (e) {
    console.log("gen image failed: ", e);
    return respErr("gen image failed");
  }
}

// 调用外部图片生成API
async function genCoverWithExternalAPI(user_info: User, prompt: string, taskType: string, aspectRatio: string, outputs: number) {
  try {
    const baseUrl = process.env.NPE4J_BASE_URI;
    // 将前端传入的样式名称映射为后端需要的值
    // Line Art -> "0", Simple Sketch -> "1" (根据实际需求调整)
    const taskTypeValue = taskType === "Line Art" ? "0" : "1";
    const params = JSON.stringify({
      model: "gpt-4o-image",
      prompt: prompt,
      aspectRatio: aspectRatio,
      outputs: outputs,
      taskType: taskTypeValue
    });
    const response = await fetch(`${baseUrl}/ai/image/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: params,
    });
    
    const result = await response.json();
    console.log('genCoverWithExternalAPI result = ', result);
    // 消耗积分数量
    let credits = outputs <= 2 ? outputs : 3;
    if (result.code === 200) {
      console.log("task id:", result.data);
      const task = {
        uuid: result.data,
        created_at: new Date().toISOString(),
        credits: credits,
        params: params,
        user_uuid: user_info.uuid,
        status: TaskStatus.ON_GOING,
      };
      await insertTask(task);

      return task.uuid; // 返回任务ID
      
    } else {
      console.error("generate image failed:", result.msg);
      throw new Error("generate image failed: " + result.msg);
    }
  } catch (error) {
    console.error("invoke api faled:", error);
    throw new Error("invoke api faled: " + error);
  }
}


async function genCoverWithTuzi(description: string, user: User) {
  const model = 'gpt-4o-image';
  const messages = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `一张黑白线描涂色插画，适合直接打印在标准尺寸（8.5x11英寸）的纸张上，无纸张边框。整体插画风格清新简洁，使用清晰流畅的黑色轮廓线条，无阴影、无灰阶、无颜色填充，背景纯白，便于涂色。【同时为了方便不会涂色的用户，请在右下角用小图生成一个完整的彩色版本供参考】适合人群：【6-9岁小朋友】画面描述：【${description}】`
        }
      ]
    }
  ];

  try {
    const imageUrls = await tuziChatCompletion(model, messages);
    console.log('提取到的图片URL:', imageUrls);

    const params = messages[0];
    const created_at = new Date().toISOString();
    const img_uuid = genUuid();
    const img_name = `covers/${img_uuid}.png`;
    downloadAndUploadImage(imageUrls[1], process.env.AWS_BUCKET || "", img_name);
    console.log('upload image success')
    const img_url = process.env.AWS_CDN_DOMAIN
     ? `${process.env.AWS_CDN_DOMAIN}/${img_name}`
     : `${process.env.AWS_BUCKET_DOMAIN}/${img_name}`; // Fallback to bucket domain if CDN not available  

    const cover: Cover = {
      user_email: user.email,
      img_description: description,
      img_size: "1024x1024",
      img_url: img_url,
      llm_name: model,
      llm_params: JSON.stringify(params),
      created_at: created_at,
      uuid: img_uuid,
      status: 1,
      user_uuid: user.uuid,
    };

    return cover;

  } catch (error) {
    console.error("Generated image error:", error);
    throw new Error("Generated image failed");
  }
}

async function genCoverWithTogether(description: string, user: User) {
  const prompt = `generate a black-and-white line art coloring page about ${description}. The design should be simple and cartoonish, suitable for children. Ensure the artwork is simple clean and high-contrast, with no shading or color.`;
  const created_at = new Date().toISOString();
  const together = createOpenAI({
    apiKey: process.env.TOGETHER_API_KEY ?? "",
    baseURL: "https://api.together.xyz/v1",
  });
  const model = "black-forest-labs/FLUX.1-schnell-Free";
  const params = {
    model: together.imageModel(model),
    prompt: prompt,
    size: "1024 x 1024"  as `${number}x${number}`,
    n: 1,
    providerOptions: {
      "openai": {
        "width": 1024,
        "height": 1024,
        // "response_format": "url",
      }
    }
  }
  const {images, warnings} = await generateImage(params)
  if (!images || images.length === 0 || warnings.length > 0) {
    throw new Error("generate cover failed");
  }

  const img_uuid = genUuid();
  const img_name = `covers/${img_uuid}.png`;

  try {
    // Convert uint8Array to Buffer and upload
    const buffer = Buffer.from(images[0].base64, "base64");
    await uploadImage(buffer, process.env.AWS_BUCKET || "", img_name);

    const img_url = process.env.AWS_CDN_DOMAIN
      ? `${process.env.AWS_CDN_DOMAIN}/${img_name}`
      : `${process.env.AWS_BUCKET_DOMAIN}/${img_name}`; // Fallback to bucket domain if CDN not available

    const img_size = "1024x1024";

    const cover: Cover = {
      user_email: user.email,
      img_description: description,
      img_size: img_size,
      img_url: img_url,
      llm_name: model,
      llm_params: JSON.stringify(params),
      created_at: created_at,
      uuid: img_uuid,
      status: 1,
      user_uuid: user.uuid,
    };

    return cover;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload generated image");
  }

}

async function genCoverWithReplicate(description: string, user: User) {
  const prompt = `Generate a brand story image about ${description}`;
  const model = "black-forest-labs/flux-1.1-pro";
  const created_at = new Date().toISOString();

  const imageModel = replicate.image(model);
  const providerOptions = {
    replicate: {
      output_quality: 90,
      aspect_ratio: "9:16",
    },
  };

  const params = {
    model: imageModel,
    aspectRatio: "9:16" as `${number}:${number}`,
    prompt: prompt,
    n: 1,
    providerOptions,
  };

  const { images, warnings } = await generateImage(params);

  if (!images || images.length === 0 || warnings.length > 0) {
    throw new Error("generate cover failed");
  }

  const img_uuid = genUuid();
  const img_name = `covers/${img_uuid}.png`;

  try {
    // Convert uint8Array to Buffer and upload
    const buffer = Buffer.from(images[0].base64, "base64");
    await uploadImage(buffer, process.env.AWS_BUCKET || "", img_name);

    const img_url = process.env.AWS_CDN_DOMAIN
      ? `${process.env.AWS_CDN_DOMAIN}/${img_name}`
      : `${process.env.AWS_BUCKET_DOMAIN}/${img_name}`; // Fallback to bucket domain if CDN not available

    const img_size = "1024x1792";

    const cover: Cover = {
      user_email: user.email,
      img_description: description,
      img_size: img_size,
      img_url: img_url,
      llm_name: model,
      llm_params: JSON.stringify(params),
      created_at: created_at,
      uuid: img_uuid,
      status: 1,
      user_uuid: user.uuid,
    };

    return cover;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload generated image");
  }
}

async function genCoverWithOpenAI(description: string, user: User) {
  const client = getOpenAIClient();

  const llm_name = "dall-e-3";
  const img_size = "1024x1792";

  const llm_params: ImageGenerateParams = {
    prompt: `Generate a brand story image about ${description}`,
    model: llm_name,
    n: 1,
    quality: "hd",
    response_format: "url",
    size: img_size,
    style: "vivid",
  };
  const created_at = new Date().toISOString();

  const res = await client.images.generate(llm_params);
  const raw_img_url = res.data[0].url;
  if (!raw_img_url) {
    throw new Error("generate cover failed");
  }

  console.log("generate img_url:", raw_img_url);

  const img_uuid = genUuid();
  // const img_name = encodeURIComponent(description);

  let img_url = "";
  const img_name = `covers/${img_uuid}.png`;

  if (process.env.IMAGE_STORAGE === "cos") {
    const cos_img = await downloadAndUploadImageWithCos(
      raw_img_url,
      process.env.COS_BUCKET || "",
      img_name
    );
    img_url = process.env.COS_CDN_DOMAIN
      ? `${process.env.COS_CDN_DOMAIN}/${img_name}`
      : `${process.env.COS_CDN_DOMAIN}/${img_name}`;
    console.log("upload to cos", img_url);
  } else {
    const s3_img = await downloadAndUploadImage(
      raw_img_url,
      process.env.AWS_BUCKET || "",
      img_name
    );
    img_url = process.env.AWS_CDN_DOMAIN
      ? `${process.env.AWS_CDN_DOMAIN}/${img_name}`
      : `${process.env.AWS_CDN_DOMAIN}/${img_name}`;
    console.log("upload to aws s3", img_url);
  }

  const cover: Cover = {
    user_email: user.email,
    img_description: description,
    img_size: img_size,
    img_url: img_url,
    llm_name: llm_name,
    llm_params: JSON.stringify(llm_params),
    created_at: created_at,
    uuid: img_uuid,
    status: 1,
    user_uuid: user.uuid,
  };

  return cover;
}
