import Producthunt from "../producthunt";
import { getCoversCount } from "@/models/cover";

export default async function () {
  const covers_count = await getCoversCount();

  return (
    <section className="max-w-3xl mx-auto text-center">
      <h1 className="text-3xl md:text-6xl font-bold text-primary mt-8 md:mt-24">
        AI Coloring Page Generator
      </h1>
      <h2 className="text-2xl md:text-4xl my-8 text-secondary-foreground">
        Create high-quality coloring pages for free.
      </h2>
      {/* <Producthunt /> */}
    </section>
  );
}
