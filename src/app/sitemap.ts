import type { MetadataRoute } from "next";
import { templates } from "@/content/templates";

const base = "https://competemcgill.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/templates`, priority: 0.6 },
    ...templates.map((t) => ({
      url: `${base}/templates/${t.slug}`,
      priority: 0.4,
    })),
  ];
}
