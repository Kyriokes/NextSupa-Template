import { eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { PAGE_DEFAULT_TITLES, type PageContent, type PageSlug } from "./pages";
import { sitePages } from "./tables";

export const PAGES_TAG = "site-pages";

const emptyPage = (slug: PageSlug): PageContent => ({ title: PAGE_DEFAULT_TITLES[slug], body: "" });

// Contenido para mostrar. Cambia poco: se cachea y se renueva al guardar
// (updateTag). Si nunca se cargó, título por defecto y cuerpo vacío. Si la
// base falla, lo mismo pero por pocos minutos: la página sale igual y se
// corrige sola cuando la base vuelve, en vez de dar un error 500.
export async function getPage(slug: PageSlug): Promise<PageContent> {
  "use cache";
  cacheTag(PAGES_TAG);
  try {
    const [row] = await db
      .select({ title: sitePages.title, body: sitePages.body })
      .from(sitePages)
      .where(eq(sitePages.slug, slug));
    cacheLife("max");
    return row ?? emptyPage(slug);
  } catch {
    cacheLife("minutes");
    return emptyPage(slug);
  }
}

// Lectura para editar, sin caché.
export async function getPageForEditing(slug: PageSlug): Promise<PageContent> {
  const [row] = await db
    .select({ title: sitePages.title, body: sitePages.body })
    .from(sitePages)
    .where(eq(sitePages.slug, slug));
  return row ?? emptyPage(slug);
}

export async function savePage(slug: PageSlug, content: PageContent, userId: string) {
  await db
    .insert(sitePages)
    .values({ slug, ...content, updatedBy: userId })
    .onConflictDoUpdate({
      target: sitePages.slug,
      set: { title: content.title, body: content.body, updatedBy: userId, updatedAt: sql`now()` },
    });
}
