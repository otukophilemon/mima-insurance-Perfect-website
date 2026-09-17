import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  metadataBase: new URL("https://mima-insurance-perfect-website-ashen.vercel.app"),
  title: {
    default: "MIMA Insurance Brokers | Motor, Health & Business Insurance Kenya",
    template: "%s | MIMA Insurance Brokers",
  },
  description:
    "Trusted insurance brokerage in Nairobi & Nakuru. Get free quotes for motor, health, business, WIBA, marine, travel, and life insurance. Call 0116 000 073.",
  keywords: [
    "insurance broker Kenya",
    "motor insurance Nairobi",
    "health insurance Nakuru",
    "business insurance Kenya",
    "WIBA insurance",
    "MIMA Insurance",
    "insurance quotes Kenya",
  ],
  authors: [{ name: "MIMA Insurance Brokers Limited" }],
  creator: "MIMA Insurance Brokers Limited",
  publisher: "MIMA Insurance Brokers Limited",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://mima-insurance-perfect-website-ashen.vercel.app",
    siteName: "MIMA Insurance Brokers",
    title: "MIMA Insurance Brokers | Your Trusted Insurance Partner in Kenya",
    description:
      "Comprehensive insurance solutions for individuals and businesses. Offices in Nairobi & Nakuru. Free consultation.",
    images: [
      {
        url: "/images/mima-logo.png",
        width: 512,
        height: 512,
        alt: "MIMA Insurance Brokers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MIMA Insurance Brokers | Your Trusted Insurance Partner",
    description:
      "Comprehensive insurance solutions in Nairobi & Nakuru. Get a free quote today.",
    images: ["/images/mima-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
      icons: {
    icon: "/images/mima-logo.png",
    apple: "/images/mima-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <html lang="en" data-scroll-behavior="smooth">
            <body className="antialiased">
        {children}
        <WhatsAppButton />
        <SchemaMarkup />
      </body>
      <GoogleAnalytics gaId="G-10J9V6NW5E" />
    </html>
  );
}