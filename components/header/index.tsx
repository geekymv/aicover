"use client";

import { AppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Nav } from "@/types/nav";
import Social from "@/components/social";
import User from "@/components/user";
import { useContext, useState } from "react";
import { usePathname } from "next/navigation";

export default function () {
  const { user } = useContext(AppContext);
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigations: Nav[] = [
    {
      name: "coloring Page Generator",
      title: "Coloring Page Generator",
      url: "/",
      target: "_self",
      active: pathname === "/",
    },
    {
      name: "image-to-coloring",
      title: "Image to Coloring Page",
      url: "/image-to-coloring-page",
      target: "_self",
      active: pathname === "/image-to-coloring-page",
    },
    {
      name: "gallery",
      title: "Gallery",
      url: "/gallery",
      target: "_self",
      active: pathname === "/gallery",
    },
    {
      name: "pricing",
      title: "Pricing",
      url: "/pricing",
      target: "_self",
      active: pathname === "/pricing",
    },
    
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header>
      <div className="h-auto w-screen">
        <nav className="font-inter mx-auto h-auto w-full max-w-[1600px] lg:relative lg:top-0">
          <div className="flex flex-row items-center px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-8 xl:px-20">
            {/* Mobile menu button */}
            <button
              className="md:hidden mr-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            <a href="/" className="text-xl font-medium flex items-center">
              {/* <img
                src="/logo.png"
                className="w-8 h-8 rounded-full mr-2"
                alt="logo"
              /> */}
              <span className="font-bold text-primary text-xl md:text-2xl">
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
          </div>

          {/* Mobile menu dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-background shadow-lg">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigations.map((tab: Nav, idx: number) => (
                  <a
                    key={idx}
                    href={tab.url}
                    target={tab.target}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      tab.active
                        ? "text-primary bg-primary/20 border-l-4 border-primary"
                        : "text-gray-700 hover:text-primary hover:bg-primary/5"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {tab.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
