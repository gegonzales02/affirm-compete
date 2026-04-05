import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compete — Affirm Competitive Messaging Center",
  description:
    "AI-powered competitive intelligence tool for Affirm's Product Marketing team. Analyze competitor positioning, find messaging overlap, and sharpen differentiation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
