import Producthunt from "../producthunt";
import { getCoversCount } from "@/models/cover";

export default async function () {
  const covers_count = await getCoversCount();

  return (
    <section className="max-w-3xl mx-auto text-center" aria-label="hero">
      <h1 className="text-3xl md:text-6xl font-bold text-primary mt-8 md:mt-24">
        Funny Coloring Pages Generator With AI
      </h1>
      <h2 className="text-2xl md:text-4xl my-8 text-secondary-foreground">
        Create high-quality coloring pages  with Funny Coloring Page Generator
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Join {covers_count}+ users creating printable coloring pages for kids and adults
      </p>
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <span className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
          ✨ AI Powered
        </span>
        <span className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
          🎨 High Quality
        </span>
        <span className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
          🖨️ Ready to Print
        </span>
      </div>
      {/* <Producthunt /> */}
    </section>
  );
}
