import Consult from "../consult";
import { Cover } from "@/types/cover";
import Image from "next/image";
import Tabs from "@/components/tabs";

export default async function ({
  cate,
  showTab,
  covers,
}: {
  cate: string;
  showTab?: boolean;
  covers: Cover[];
}) {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 my-16">
        {showTab && (
          <div className="mx-auto w-full max-w-3xl text-center">
            <Tabs cate={cate} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {false ? (
            <div className="text-center mx-auto">loading...</div>
          ) : (
            <>
              {covers &&
                covers.map((cover: Cover, idx: number) => {
                  return (
                    <a
                      href={`/cover/${cover.uuid}`}
                      key={idx}
                      className="relative overflow-hidden cursor-pointer"
                    >
                      <Image
                        src={cover.img_url}
                        alt={`${cover.img_description} coloring page`}
                        width="280"
                        height="280"
                        className="w-full h-[300px] object-cover rounded-lg"
                      />
                    </a>
                  );
                })}
            </>
          )}
        </div>

        {cate === "brand" && (
          <div className="text-center mt-8">
            <Consult />
          </div>
        )}
      </div>
    </section>
  );
}
