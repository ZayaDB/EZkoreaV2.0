import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import type { Metadata } from "next";
import Providers from "@/components/Providers";
import LNB from "@/components/LNB";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EZ Korea",
  description: "한국어 학습 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <Providers>
          <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <LNB />
            <main className="flex-1">
              <Header />
              <main className="container mx-auto px-4 py-8">{children}</main>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
