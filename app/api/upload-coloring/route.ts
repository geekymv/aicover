import { uploadImage } from "@/lib/s3";
import { genUuid } from "@/lib";
import { respData, respErr } from "@/lib/resp";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imgFile = formData.get("file") as File | null;

    if (!imgFile) {
      return respErr("no file");
    }

    const imgSize = imgFile.size;
    const imgType = imgFile.type;

    if (!imgType.startsWith("image/")) {
      return respErr("invalid file type");
    }
    // max size: 10M
    if (imgSize > 10485760) {
      return respErr("max file size up to 10MB");
    }

    const imgUuid = genUuid();
    const bytes = await imgFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const key = `coloring/${imgUuid}.png`;

    await uploadImage(
      buffer,
      process.env.AWS_BUCKET || "trysai",
      key,
      imgType || "image/png"
    );

    const url = process.env.AWS_CDN_DOMAIN
      ? `${process.env.AWS_CDN_DOMAIN}/${key}`
      : `${process.env.AWS_CDN_DOMAIN}/${key}`;

    return respData({
      url,
      size: imgSize,
      type: imgType,
      uuid: imgUuid,
    });
  } catch (e) {
    console.log("upload coloring image failed:", e);
    return respErr("upload coloring image failed");
  }
}


