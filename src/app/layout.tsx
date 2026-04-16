import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteNavbar from "@/components/layout/SiteNavbar";
import SiteBackground from "@/components/layout/SiteBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Word RPG",
  description: "單詞冒險 × 抽卡養成的背單詞 RPG 網站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen text-slate-100">
        <SiteBackground />
        <div className="relative flex min-h-screen flex-col">
          <SiteNavbar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}