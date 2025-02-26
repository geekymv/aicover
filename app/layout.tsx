import "./globals.css";

import { Toaster, toast } from "sonner";

import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s by AI Coloring Page Generator ｜ Free Download",
    default: "AI Coloring Page Generator ｜ Coloring Page",
  },
  description:
    "100% Free AI Coloring Page Generator Online",
  keywords: "AI Coloring Page Generator, AI Coloring Page, High Quality Images, AI Coloring Page Online, Coloring Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-L50J0T914F"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                    
                      gtag('config', 'G-L50J0T914F');
                      `,
            }}
          ></script>
        </head>
        <body className={inter.className}>
          <Toaster position="top-center" richColors />
          {children}
          {/* <Analytics /> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
