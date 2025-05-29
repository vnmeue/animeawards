import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Subhasha ANIME AWARDS",
  description: "Vote for your favorite anime in the Subhasha ANIME AWARDS 2025",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#1a1a1a] text-white min-h-screen`}>
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
        </main>
        <footer className="bg-[#242424] mt-auto">
        </footer>
      </body>
    </html>
  );
}
