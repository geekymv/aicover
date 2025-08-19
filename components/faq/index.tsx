"use client";

import { Disclosure, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface FaqItem {
  q: string;
  a: string;
}

const faqItems: FaqItem[] = [
  {
    q: "What is an AI Coloring Page Generator?",
    a: "It is a tool that uses AI to create printable coloring pages from prompts or ideas. You describe what you want, and the AI generates a clean line-art image for coloring.",
  },
  {
    q: "How does it work?",
    a: "Enter a prompt describing the scene or object. Our AI model processes the prompt and produces high-contrast line drawings suitable for printing and coloring.",
  },
  {
    q: "Is it free to use?",
    a: "You can get started for free. Advanced features or higher generation limits may require a subscription.",
  },
  {
    q: "Can I customize the style?",
    a: "Yes. You can refine your prompt to specify style (e.g., cartoon, minimal, realistic line-art), complexity, and other details.",
  },
  {
    q: "What size and format are supported?",
    a: "We provide high-resolution PNG images optimized for printing on common paper sizes (e.g., A4, Letter).",
  },
  {
    q: "How long does generation take?",
    a: "Typically from a few seconds to a minute, depending on server load and prompt complexity.",
  },
  {
    q: "Can I use generated pages commercially?",
    a: "Please review our Terms of Service and licensing. In most cases, you can use them commercially with appropriate subscription or credits.",
  },
];

export default function FAQ() {
  return (
    <section className="mx-auto mt-20 w-full bg-gradient-to-b to-transparent px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-2 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            FAQ
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
            AI Coloring Page Generator FAQ
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 md:text-base">
            Common questions and answers to help you get started and use the generator effectively.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => (
            <Disclosure key={idx} as="div" defaultOpen={idx === 0}>
              {({ open }) => (
                <div className={`rounded-xl transition-all`}>
                  <Disclosure.Button
                    className="flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-all ${open ? "rotate-180 bg-primary/5 text-primary" : "bg-primary/5 text-primary/60"}`}
                        aria-hidden
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="h-4 w-4 transition-transform"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </span>
                      <span className="text-base font-semibold text-[#1f2937] md:text-lg">
                        {item.q}
                      </span>
                    </div>
                  </Disclosure.Button>
                  <Transition
                    as={Fragment}
                    enter="transition duration-200 ease-out"
                    enterFrom="opacity-0 -translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition duration-150 ease-in"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-1"
                  >
                    <Disclosure.Panel>
                      <div className="px-5 pb-5">
                        <div className="border-t border-primary/10 pt-4 text-sm leading-6 text-gray-700 md:text-[15px]">
                          {item.a}
                        </div>
                      </div>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
}


