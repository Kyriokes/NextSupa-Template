import type { Metadata } from "next";

// Metadatos para buscadores y para compartir enlaces. Nombre y descripción
// del sitio: reemplazalos por los del proyecto.

export const SITE_NAME = "Proyecto nuevo";
export const HOME_TITLE = "Proyecto nuevo";
export const SITE_DESCRIPTION = "Sitio creado desde el template de Next.js y Supabase.";

// La imagen para compartir del sitio (app/opengraph-image.tsx).
export const SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME}: ${SITE_DESCRIPTION}`,
};

// Recorta un texto para la descripción que muestra un buscador (unos 160
// caracteres), sin cortar palabras.
export function snippet(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,.;:]+$/, "")}…`;
}

type Title = string | { absolute: string };

// Una página pública: título (la plantilla del layout le suma el nombre del
// sitio), descripción, dirección canónica y cómo se ve al compartirla. El
// openGraph de una página reemplaza entero al del layout: por eso se arma
// completo acá, con la imagen del sitio si la página no trae una propia.
// `index: false` la deja fuera de los buscadores, pero siguen sus enlaces
// (por ejemplo, una búsqueda).
export function pageMetadata(p: {
  title: Title;
  description: string;
  path: string;
  image?: { url: string; alt: string; width?: number; height?: number };
  index?: boolean;
}): Metadata {
  const ogTitle = typeof p.title === "string" ? p.title : p.title.absolute;
  return {
    title: p.title,
    description: p.description,
    ...(p.index === false ? { robots: { index: false, follow: true } } : { alternates: { canonical: p.path } }),
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: SITE_NAME,
      url: p.path,
      title: ogTitle,
      description: p.description,
      images: [p.image ?? SHARE_IMAGE],
    },
  };
}

// Páginas de la cuenta y del admin: fuera de los buscadores.
export function privateMetadata(title: string): Metadata {
  return { title, robots: { index: false, follow: false } };
}
