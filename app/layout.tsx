import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MIMA Insurance Brokers | Your Trusted Partner",
  description: "Professional insurance brokerage services tailored to your needs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}