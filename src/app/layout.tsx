import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STR Management",
  description: "Short-term rental management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
