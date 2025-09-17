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
      <div className="mx-auto mt-8 mb-12 max-w-7xl text-center">
        <a
          href="/gallery"
          className="inline-flex items-center gap-2 rounded-md border border-primary bg-primary/5 px-5 py-2 text-primary transition hover:bg-primary/10 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          aria-label="View more coloring pages on the Gallery page"
        >
          <span>View more coloring pages</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
      <FAQ />
    </div>
  );
}
