import type { Metadata } from "next";
import { Afacad } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const afacad = Afacad({
  variable: "--font-afacad",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RankUno Crawl Toolkit",
  description: "Internal SEO crawl management toolkit for RankUno",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased font-sans", afacad.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}