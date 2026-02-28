import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ForzaDocs — AI-Powered Notes & Workspace",
  description:
    "A Notion-like workspace with AI-powered writing, summarization, and organization features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
