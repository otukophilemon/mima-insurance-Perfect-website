import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "MIMA Insurance Brokers | Your Trusted Partner",
  description:
    "Professional insurance brokerage services tailored to your needs. Motor, health, business, and life insurance in Nairobi and Nakuru, Kenya.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <WhatsAppButton />
      </body>
      <GoogleAnalytics gaId="G-10J9V6NW5E" />
    </html>
  );
}