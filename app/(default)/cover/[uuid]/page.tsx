import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { findCoverByUuid, getRandomCovers } from "@/models/cover";

import { Button } from "@/components/ui/button";
import Consult from "@/components/consult";
import Covers from "@/components/covers";
import Download from "@/components/download";
import { FaDownload } from "react-icons/fa";
import Image from "next/image";
import { Metadata } from "next";
import Share from "@/components/share";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { uuid: string };
}): Promise<Metadata> {
  let description = "";

  if (params.uuid) {
    const cover = await findCoverByUuid(params.uuid);
    if (cover) {
      description = cover.img_description;
    }
  }

  return {
    title: `${description} Coloring Page - `,
    description: `${description}, free printable coloring page created by AI Coloring Page Generator ｜ Funny Coloring Page`,
    alternates: {
      canonical: `${process.env.WEB_BASE_URI}/cover/${params.uuid}`,
    },
  };
}

export default async function ({ params }: { params: { uuid: string } }) {
  const cover = await findCoverByUuid(params.uuid);
  if (!cover || cover.status !== 1) {
    return (
      <div className="text-center text-primary py-40">
        封面图片审核中，暂不可访问。
      </div>
    );
  }

  const covers = await getRandomCovers(1, 60);

  return (
    <>
      {cover && (
        <section>
          {/* 添加面包屑导航 */}
          <nav className="mx-auto w-full max-w-7xl px-5 py-2 md:px-10" aria-label="Breadcrumb">
            <ol className="flex text-sm text-gray-500">
              <li><a href="/" className="hover:text-gray-700">Home</a></li>
              <li className="mx-2">/</li>
              <li>Coloring Pages</li>
              <li className="mx-2">/</li>
              <li className="text-gray-900 font-medium truncate max-w-[200px]">{cover.img_description}</li>
            </ol>
          </nav>
          <div className="mx-auto w-full max-w-7xl px-5 py-4 md:px-10 md:py-4 ">
            <div className="flex flex-col items-center">
              <section className="w-full rounded-xl">
                <div className="mx-auto max-w-3xl px-5 py-4 md:px-10 md:py-12">
                  <div className="flex flex-col items-center gap-8">
                    {/* 添加标题 */}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 text-center">
                      {cover.img_description} Coloring Page
                    </h1>

                    {/* 图片部分 */}
                    <a
                      href={`/cover/${cover.uuid}`}
                      className="relative overflow-hidden max-w-[320px] mx-auto cursor-pointer"
                    >
                      <img
                        src={cover.img_url}
                        alt={`${cover.img_description} coloring page printable for kids and adults`}
                        width="320"
                        height="480"
                        className="w-full rounded-lg shadow-md"
                      />
                    </a>

                    {/* 详情部分 */}
                    <div className="w-full max-w-2xl text-center">
                      {/* 用户信息部分 */}
                      {cover.created_user && (
                        <a
                          href={`/user/${cover.user_uuid}/covers`}
                          className="group inline-flex items-center mb-4"
                        >
                          <Avatar className="cursor-pointer">
                            <AvatarImage
                              src={cover.created_user.avatar_url}
                              alt={cover.created_user.nickname}
                            />
                            <AvatarFallback>
                              {cover.created_user.nickname || "🧧"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3">
                            <p className="text-lg font-medium text-gray-700 group-hover:text-gray-900">
                              {cover.created_user.avatar_url
                                ? cover.created_user.nickname
                                : "匿名用户"}
                            </p>
                          </div>
                        </a>
                      )}

                      {/* 相关关键词和内容描述 */}
                      <div className="w-full mx-auto mb-6">
                        <p className="text-gray-600 mb-4">
                          Enjoy this free printable {cover.img_description} coloring page. Perfect for kids and adults who love coloring activities.
                          Download, print, and start coloring right away!
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 text-sm">
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">Free Printable</span>
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">Coloring Pages</span>
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">{cover.img_description}</span>
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">Kids Activity</span>
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">AI Generated</span>
                        </div>
                      </div>

                      {/* 下载和分享按钮 - 居中显示 */}
                      <div className="flex justify-center space-x-4 mt-4">
                        {cover.is_awesome ? (
                          <Consult cover={cover} />
                        ) : cover.is_brand ? (
                          <Consult cover={cover} />
                        ) : (
                          <Download cover={cover} />
                        )}

                        <Share
                          shareUrl={`${process.env.WEB_BASE_URI}/cover/${cover.uuid}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <h2 className="text-xl font-semibold capitalize mt-8 md:text-3xl md:my-4">
                More Coloring Pages
              </h2>

              <div className="mb-8 grid w-full grid-cols-1 md:mb-12 md:grid-cols-1 md:gap-4 lg:mb-16">
                <Covers cate="random" covers={covers} showTab={false} />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
