import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ImageMatte - AI图片背景去除工具",
  description: "一键去除图片背景，3秒完成人像抠图，无需PS技能。支持电商产品图、人像摄影、设计素材等多种场景。",
  keywords: ["图片背景去除", "AI抠图", "人像抠图", "电商白底图", "在线图片编辑"],
  authors: [{ name: "ImageMatte Team" }],
  openGraph: {
    title: "ImageMatte - AI图片背景去除工具",
    description: "一键去除图片背景，3秒完成人像抠图，无需PS技能",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} min-h-full bg-white text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
