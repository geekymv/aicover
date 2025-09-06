import Covers from "@/components/covers";
import Hero from "@/components/hero";
import Input from "@/components/input";
import FAQ from "@/components/faq";
import { Metadata } from "next";
import { getRecommendedCovers } from "@/models/cover";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: `${process.env.WEB_BASE_URI}`,
    },
  };
}

export default async function () {
  const covers = await getRecommendedCovers(1, 20);

  return (
    <div className="w-full px-6">
      <Hero />
      <Input />
      <Covers cate="featured" covers={covers} showTab={true} />
      <FAQ />
    </div>
  );
}
