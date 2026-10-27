import { headers } from "next/headers";

// Dirección pública fija del sitio, sin leer el pedido: para metadatos,
// sitemap y robots, que se arman en el build. En Vercel, siempre la
// de producción (también en vistas previas: la dirección canónica es una
// sola); en local, localhost.
export function publicSiteUrl(env: Readonly<Record<string, string | undefined>> = process.env): string {
  return env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000";
}

// Dirección pública del sitio, para armar enlaces que salen afuera (por
// ejemplo, la vuelta desde un servicio de pagos o un email). En producción, la dirección fija
// del proyecto en Vercel (no la que manda el navegador, que se podría
// falsear); en local o en vistas previas, la del pedido actual.
export async function siteUrl(): Promise<string> {
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
