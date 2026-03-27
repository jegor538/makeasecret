import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "makeasecret",
  description: "One-time anonymous secrets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
