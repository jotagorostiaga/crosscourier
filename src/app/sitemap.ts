import type { MetadataRoute } from "next";
import { campaigns } from "@/lib/campaigns";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

// Necesario para que también se generen en el export estático.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/importar", priority: 0.9 },
    { path: "/exportar", priority: 0.9 },
    { path: "/warehouse", priority: 0.8 },
    { path: "/cotizar", priority: 0.9 },
    { path: "/crosscourier", priority: 0.6 },
    { path: "/preguntas-frecuentes", priority: 0.6 },
    { path: "/seguir-mi-envio", priority: 0.5 },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route.priority,
    })),
    ...services.map((service) => ({
      url: `${site.url}${service.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...campaigns.map((campaign) => ({
      url: `${site.url}/lp/${campaign.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
