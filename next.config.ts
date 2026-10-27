import type { NextConfig } from "next";

// Encabezados de seguridad para todas las respuestas.
const securityHeaders = [
  // Nadie puede mostrar el sitio dentro de un marco de otra página
  // (clickjacking: hacer clic sin saberlo en un botón del sitio).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'" },
  // El navegador no adivina el tipo de un archivo: una imagen no se ejecuta como script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // A otros sitios solo les llega el dominio, nunca la ruta completa.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // Siempre por https.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // No anunciar con qué está hecho el sitio.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Las fotos subidas tienen un nombre nuevo cada vez (no cambian en el
    // lugar): se pueden guardar optimizadas un mes. Menos trabajo de
    // optimización, que en Vercel tiene cupo.
    minimumCacheTTL: 2_678_400,
    remotePatterns: [
      // Fotos de perfil de Google (se toman en el primer ingreso).
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Fotos subidas por los usuarios al bucket "avatars".
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://invalid.local").hostname,
        pathname: "/storage/v1/object/public/avatars/**",
      },
    ],
  },
  experimental: {
    // La foto de perfil puede pesar hasta 1 MB; el límite por defecto de las
    // Server Actions (1 MB) no deja margen para el resto del pedido.
    serverActions: { bodySizeLimit: "2mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
