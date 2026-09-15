// app/quote/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get a Free Insurance Quote | Fast & Easy",
  description:
    "Request a free insurance quote in under 2 minutes. Motor, health, business, life insurance and more. No obligation.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}