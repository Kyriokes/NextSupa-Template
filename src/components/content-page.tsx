import type { Metadata } from "next";
import { pageMetadata, SITE_NAME, snippet } from "@/lib/metadata";
import { parseContentBlocks, type PageSlug } from "@/modules/content/pages";
import { getPage } from "@/modules/content/repository";

// Título y descripción (el primer párrafo) para los buscadores. Usa
// el mismo contenido cacheado que la página.
export async function contentPageMetadata(slug: PageSlug): Promise<Metadata> {
  const page = await getPage(slug);
  const first = parseContentBlocks(page.body).find((b) => b.type === "paragraph");
  return pageMetadata({
    title: page.title,
    description: snippet(first?.text ?? `${page.title} de ${SITE_NAME}.`),
    path: `/${slug}`,
  });
}

// Página de texto editable por el admin. Se
// muestra como texto: subtítulos y párrafos, sin HTML.
export async function ContentPage({ slug }: { slug: PageSlug }) {
  const page = await getPage(slug);
  const blocks = parseContentBlocks(page.body);
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-8">
      <h1 className="text-2xl font-semibold">{page.title}</h1>
      {blocks.length === 0 ? (
        <p className="text-muted-foreground">Esta página todavía no tiene contenido.</p>
      ) : (
        blocks.map((b, i) =>
          b.type === "heading" ? (
            <h2 key={i} className="mt-2 text-lg font-medium">
              {b.text}
            </h2>
          ) : (
            <p key={i} className="whitespace-pre-line">
              {b.text}
            </p>
          ),
        )
      )}
    </main>
  );
}
