import "./globals.css";

import { Toaster, toast } from "sonner";

import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s by AI 红包封面生成器 ｜ AI Cover",
    default: "AI 红包封面生成器 ｜ AI Cover",
  },
  description:
    "AI 红包封面生成器，利用 AI 技术生成高清精美的微信红包封面图片。",
  keywords: "AI 红包封面生成器, 微信红包封面, 微信红包, AI 红包封面, AI Cover",
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
