import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/lib/site";

// Los buscadores recorren el sitio, pero no el admin, la API ni la vuelta
// del ingreso. Las páginas de la cuenta (perfil) no se prohíben acá sino con
// noindex: así el buscador lo lee y no las muestra aunque alguien las enlace.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/auth/"] },
    sitemap: `${publicSiteUrl()}/sitemap.xml`,
  };
}
