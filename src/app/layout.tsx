import type { Metadata } from "next";
import { dmSans, playfair } from "./fonts";
import "./globals.css";
import Navbar from "@/components/navigation/nav-bar";

export const metadata: Metadata = {
  title: "Kumpas",
  description: "Counsel Smarter, Guide Students Further",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col">
        {children}
        </main>
      </body>
    </html>
  );
}
