import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/lib/site";

// Las páginas que tienen que encontrar los buscadores. Sumá las del proyecto.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicSiteUrl();
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    ...["/faq", "/about", "/contact", "/terms"].map((path) => ({
      url: `${base}${path}`,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
  ];
}
