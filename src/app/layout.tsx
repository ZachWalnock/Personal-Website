import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zach Walnock",
  description: "Software developer passionate about building intuitive experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-hidden">{children}</body>
    </html>
  );
}
