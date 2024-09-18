import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "oaidalleapiprodscus.blob.core.windows.net",
      "trysai.s3.us-west-1.amazonaws.com",
      "image-1313856688.cos.ap-guangzhou.myqcloud.com",
      "r2.trys.ai",
      "6e5237d5b06eb4cdecb2100b511fde81.r2.cloudflarestorage.com",
    ],
  },
};

export default nextConfig;
