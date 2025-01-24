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

export const runtime = "edge";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
    return respErr("no auth");
  }
  const user_email = user.emailAddresses[0].emailAddress;

  try {
    const { description } = await req.json();
    if (!description) {
      return respErr("invalid params");
    }

    const user_info = await findUserByEmail(user_email);
    if (!user_info || !user_info.uuid || !user_info.email) {
      return respErr("no auth");
    }

    const user_credits = await getUserCredits(user_info.email);
    if (!user_credits || user_credits.left_credits < 1) {
      return respErr("credits not enough");
    }

    // const cover = await genCoverWithOpenAI(description, user);
    const cover = await genCoverWithReplicate(description, user_info);

    await insertCover(cover);

    return respData(cover);
  } catch (e) {
    console.log("gen cover failed: ", e);
    return respErr("gen cover failed");
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
