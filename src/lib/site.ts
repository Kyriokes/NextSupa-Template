// Dirección pública fija del sitio, sin leer el pedido: para metadatos,
// sitemap y robots, que se arman en el build. En Vercel, siempre la
// de producción (también en vistas previas: la dirección canónica es una
// sola); en local, localhost.
export function publicSiteUrl(env: Readonly<Record<string, string | undefined>> = process.env): string {
  return env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000";
}
