import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.COS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.COS_AK || "",
    secretAccessKey: process.env.COS_SK || "",
  },
});

export async function uploadImage(
  imageBuffer: Buffer,
  bucketName: string,
  s3Key: string
) {
  try {
    const uploadParams = {
      Bucket: bucketName,
      Key: s3Key,
      Body: imageBuffer,
    };

    return s3.send(new PutObjectCommand(uploadParams));
  } catch (e) {
    console.log("upload failed:", e);
    throw e;
  }
}

export async function downloadImage(imageUrl: string): Promise<ArrayBuffer> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.arrayBuffer();
  } catch (e) {
    console.log("download failed:", e);
    throw e;
  }
}

export async function downloadAndUploadImage(
  imageUrl: string,
  bucketName: string,
  s3Key: string
) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadParams = {
      Bucket: bucketName,
      Key: s3Key,
      Body: buffer,
    };

    return s3.send(new PutObjectCommand(uploadParams));
  } catch (e) {
    console.log("upload failed:", e);
    throw e;
  }
}
