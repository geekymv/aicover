import { AppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Nav } from "@/types/nav";
import Social from "@/components/social";
import User from "@/components/user";
import { useContext } from "react";
import { usePathname } from "next/navigation";

export default function () {
  const { user } = useContext(AppContext);
  const pathname = usePathname();
  const navigations: Nav[] = [
    {
      name: "home",
      title: "Home",
      url: "/",
      target: "_self",
      active: pathname === "/",
    },
    {
      name: "pricing",
      title: "Pricing",
      url: "/pricing",
      target: "_self",
      active: pathname === "/pricing",
    },
    
  ];

  return (
    <header>
      <div className="h-auto w-screen">
        <nav className="font-inter mx-auto h-auto w-full max-w-[1600px] lg:relative lg:top-0">
          <div className="flex flex-row items-center px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-8 xl:px-20">
            <a href="/" className="text-xl font-medium flex items-center">
              {/* <img
                src="/logo.png"
                className="w-8 h-8 rounded-full mr-2"
                alt="logo"
              /> */}
              <span className="font-bold text-primary text-2xl">
                Funny Coloring Page
              </span>
            </a>

            <div className="hidden md:flex ml-16">
              {navigations.map((tab: Nav, idx: number) => (
                <a
                  className={`text-md font-normal leading-6 ${
                    tab.active ? "text-primary" : "text-gray-800"
                  } mx-4`}
                  key={idx}
                  href={tab.url}
                  target={tab.target}
                >
                  {tab.title}
                </a>
              ))}
            </div>

            <div className="flex-1"></div>

            <div className="flex flex-row items-center lg:flex lg:flex-row lg:space-x-3 lg:space-y-0">
              <div className="hidden md:block mr-4">
                <Social />
              </div>

              {user === undefined ? (
                <>loading...</>
              ) : (
                <>
                  {user ? (
                    <>
                      <User user={user} />
                    </>
                  ) : (
                    <a className="cursor-pointer" href="/sign-in">
                      <Button className="text-white">Login</Button>
                    </a>
                  )}
                </>
              )}
            </div>
            <a href="#" className="absolute right-5 lg:hidden"></a>
          </div>
        </nav>
      </div>
    </header>
  );
}
