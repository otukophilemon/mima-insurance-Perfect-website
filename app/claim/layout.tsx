// app/claim/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "File a Claim | Track Your Insurance Claim Online",
  description:
    "File and track your insurance claim online with MIMA Insurance Brokers. Fast processing, transparent updates, settlement within 3-5 days.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}