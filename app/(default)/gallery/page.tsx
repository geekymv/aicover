import { getCovers, getCoversCount } from "@/models/cover";
import { Cover } from "@/types/cover";

export const runtime = "edge";

export default async function GalleryIndexPage() {
  const limit = 20;
  const currentPage = 1;
  const totalCount = await getCoversCount();
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const covers: Cover[] = await getCovers(currentPage, limit);

  const buildPageHref = (p: number) => `/gallery/page/${p}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-4 md:px-10 md:py-4">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl md:text-6xl font-bold text-primary mt-8 md:mt-24">
            Funny Coloring Pages Gallery
          </h1>
          <h2 className="text-2xl md:text-4xl my-8 text-secondary-foreground">
            Explore our collection of AI-generated coloring pages
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {covers.map((cover) => (
            <a
              key={cover.uuid}
              href={`/cover/${cover.uuid}`}
              className="relative overflow-hidden cursor-pointer"
            >
              <img
                src={cover.img_url}
                alt={`${cover.img_description} coloring page`}
                width="280"
                height="280"
                className="w-full h-[300px] object-cover rounded-lg"
              />
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          {currentPage < totalPages ? (
            <a
              href={buildPageHref(currentPage + 1)}
              className="inline-flex items-center gap-2 rounded-md border border-primary bg-primary/5 px-5 py-2 text-primary transition hover:bg-primary/10 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              aria-label="Load more coloring pages"
            >
              <span>Load more</span>
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
          ) : (
            <div className="inline-flex items-center px-4 py-2 text-sm text-gray-500 bg-primary/5 rounded-md">
              No more pages
            </div>
          )}
        </div>
      </div>
    </div>
  );
}