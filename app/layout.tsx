import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compete — Affirm Competitive Messaging Center",
  description:
    "AI-powered competitive intelligence tool for Affirm's Product Marketing team. Analyze competitor positioning, find messaging overlap, and sharpen differentiation.",
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='16' fill='%234A3AFF'/><text x='16' y='22' font-size='18' fill='white' text-anchor='middle' font-weight='bold'>C</text></svg>" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
