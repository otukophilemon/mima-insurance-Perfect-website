// app/sitemap.ts
import { MetadataRoute } from "next";
import { SERVICES } from "@/data/services";

const BASE_URL = "https://mima-insurance-perfect-website-ashen.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages
  const staticPages = [
    { url: "", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/services", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/contact", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/quote", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/claim", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/dashboard", priority: 0.5, changeFrequency: "monthly" as const },
  ];

  // Service detail pages
  const servicePages = SERVICES.map((service) => ({
    url: `/services/${service.slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...servicePages].map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}