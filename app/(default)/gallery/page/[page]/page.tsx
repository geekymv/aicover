import { getCovers, getCoversCount } from "@/models/cover";
import { Cover } from "@/types/cover";

export const runtime = "edge";

export default async function GalleryPage({ params }: { params: { page: string } }) {
  const limit = 20;
  const totalCount = await getCoversCount();
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  let currentPage = Number(params.page) || 1;
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const covers: Cover[] = await getCovers(currentPage, limit);

  const buildPageHref = (p: number) => `/gallery/page/${p}`;

  const pageNumbers: number[] = [];
  const windowSize = 5;
  const start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  for (let i = start; i <= end; i++) pageNumbers.push(i);

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

        <div className="mt-10 flex items-center justify-center gap-2">
          <a
            href={buildPageHref(Math.max(1, currentPage - 1))}
            className={`px-3 py-2 rounded-md text-sm ${currentPage === 1 ? "pointer-events-none opacity-40 bg-primary/10 text-primary" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
            aria-disabled={currentPage === 1}
          >
            Prev
          </a>

          {start > 1 && (
            <a href={buildPageHref(1)} className="px-3 py-2 rounded-md text-sm bg-primary/5 text-primary hover:bg-primary/10">
              1
            </a>
          )}
          {start > 2 && <span className="px-2 text-gray-500">…</span>}

          {pageNumbers.map((p) => (
            <a
              key={p}
              href={buildPageHref(p)}
              className={`px-3 py-2 rounded-md text-sm ${p === currentPage ? "bg-primary text-white" : "bg-primary/5 text-primary hover:bg-primary/10"}`}
              aria-current={p === currentPage ? "page" : undefined}
            >
              {p}
            </a>
          ))}

          {end < totalPages - 1 && <span className="px-2 text-gray-500">…</span>}
          {end < totalPages && (
            <a href={buildPageHref(totalPages)} className="px-3 py-2 rounded-md text-sm bg-primary/5 text-primary hover:bg-primary/10">
              {totalPages}
            </a>
          )}

          <a
            href={buildPageHref(Math.min(totalPages, currentPage + 1))}
            className={`px-3 py-2 rounded-md text-sm ${currentPage === totalPages ? "pointer-events-none opacity-40 bg-primary/10 text-primary" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
            aria-disabled={currentPage === totalPages}
          >
            Next
          </a>
        </div>
      </div>
    </div>
  );
}
