import Social from "@/components/social";
import Link from "next/link";

export default function () {
  return (
    <section>
      <div className="w-screen flex-col px-6 py-20 lg:flex lg:px-10 xl:px-24">
        <div className="lg:flex lg:flex-row lg:justify-between">
          <div>
            <p>AI Coloring Page Generator</p>
            <p className="font-inter mt-4 max-w-[350px] text-base font-light text-gray-500">
              AI Coloring Page Generator
            </p>
            <div className="mb-8 mt-6">
              <Social />
            </div>
          </div>
          <div className="flex grow flex-row flex-wrap lg:mx-10 lg:flex-nowrap lg:justify-center">
            <div className="my-5 mr-8 flex max-w-[200px] grow basis-[100px] flex-col space-y-5 lg:mx-10 lg:mt-0">
              <p className="font-inter font-medium text-black">Other Product</p>
              <a
                href="https://crossclimbanswer.io"
                target="_blank"
                className="font-inter font-light text-gray-500"
              >
                Crossclimb Answer Today
              </a>
              <a
                href="https://pinpointanswer.io"
                target="_blank"
                className="font-inter font-light text-gray-500"
              >
                Pinpoint Answer Today
              </a>
              <a
                href="https://npe4j.com"
                target="_blank"
                className="font-inter font-light text-gray-500"
              >
                Npe4j
              </a>
              <a
                href="https://getaitools.app"
                target="_blank"
                className="font-inter font-light text-gray-500"
              >
                GetAITools
              </a>
            </div>
            <div className="my-5 mr-8 flex max-w-[200px] grow basis-[100px] flex-col space-y-5 lg:mx-10 lg:mt-0">
              <p className="font-inter font-medium text-black">Legal</p>
              <Link href="/privacy-policy" className="font-inter font-light text-gray-500 hover:text-gray-700">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="font-inter font-light text-gray-500 hover:text-gray-700">
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="mt-10 flex flex-col lg:mt-0">
            <div className="mb-4 flex flex-col items-center">
              <p className="font-inter font-medium text-black">Contact Us</p>
              <p className="font-inter ml-4 text-black">
                <a href="mailto:geekymv2024@gmail.com">
                  geekymv2024@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto my-12 w-full border border-[#E4E4E7] lg:my-20"></div>
        <div>
          <p className="font-inter text-center text-sm text-gray-500 lg:mt-0">
            © Copyright {new Date().getFullYear()}.{" "}
            <a
              href="https://funny-coloring-pages.online"
              target="_blank"
              className="text-primary hidden md:inline-block"
            >
              funny-coloring-pages.online
            </a>{" "}
            All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
