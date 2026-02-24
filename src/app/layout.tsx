import type { Metadata } from "next";
import { dmSans, playfair } from "./fonts";
import "./globals.css";

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
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
