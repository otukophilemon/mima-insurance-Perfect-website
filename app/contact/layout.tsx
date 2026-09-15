// app/contact/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Nairobi & Nakuru Offices",
  description:
    "Visit our offices in Westlands, Nairobi or Oginga Odinga Road, Nakuru. Call 0116 000 073 or WhatsApp us. We respond within 24 hours.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}