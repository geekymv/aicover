import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { Upload } from "@aws-sdk/lib-storage";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_AK || "",
    secretAccessKey: process.env.AWS_SK || "",
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

export async function uploadAudio(
  audioBuffer: Buffer,
  bucketName: string,
  s3Key: string,
  contentType: string,
  onProgress?: (progress: number) => void
) {
  try {
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: bucketName,
        Key: s3Key,
        Body: audioBuffer,
        ContentType: contentType,
      },
    });

    upload.on("httpUploadProgress", (progress) => {
      if (onProgress) {
        const percentage =
          ((progress.loaded || 0) / (progress.total || 1)) * 100;
        onProgress(percentage);
      }
    });

    return await upload.done();
  } catch (e) {
    console.log("Audio upload failed:", e);
    throw e;
  }
}
