/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "oaidalleapiprodscus.blob.core.windows.net",
      "trysai.s3.us-west-1.amazonaws.com",
      "r2.trys.ai",
      "replicate.delivery",
      "oss.npe4j.com"
    ],
  },
};

export default nextConfig;
