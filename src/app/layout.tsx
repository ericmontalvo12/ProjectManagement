import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Property Renovation Tracker",
  description: "Track apartment renovation progress across multiple buildings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
