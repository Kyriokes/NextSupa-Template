import Link from "next/link";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/metadata";

// Páginas de texto (editables en /admin/content) y contacto. Sumá columnas
// con las secciones del proyecto.
const COLUMNS = [
  {
    title: "Ayuda",
    links: [
      { href: "/faq", label: "Preguntas frecuentes" },
      { href: "/contact", label: "Contacto" },
      { href: "/about", label: "Quiénes somos" },
      { href: "/terms", label: "Términos y condiciones" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-secondary text-secondary-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-2">
          <p className="font-heading text-lg font-bold">{SITE_NAME}</p>
          <p className="max-w-xs text-sm">{SITE_DESCRIPTION}</p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title} className="flex flex-col gap-2 text-sm">
            <p className="font-medium">{column.title}</p>
            {column.links.map((l) => (
              <Link key={l.href} href={l.href} className="self-start underline-offset-4 hover:underline">
                {l.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
    </footer>
  );
}
