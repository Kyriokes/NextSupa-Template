import { describe, expect, it } from "vitest";
import { pageMetadata, privateMetadata, SHARE_IMAGE, SITE_NAME, snippet } from "./metadata";

describe("lib/metadata", () => {
  it("recorta la descripción sin cortar palabras", () => {
    expect(snippet("  Texto   con espacios  ")).toBe("Texto con espacios");
    const long = "palabra ".repeat(40);
    const s = snippet(long, 50);
    expect(s.length).toBeLessThanOrEqual(50);
    expect(s.endsWith("palabra…")).toBe(true);
  });

  it("una página pública lleva su dirección canónica y su vista para compartir", () => {
    const m = pageMetadata({ title: "Contacto", description: "Escribinos", path: "/contact" });
    expect(m.alternates?.canonical).toBe("/contact");
    expect(m.robots).toBeUndefined();
    expect(m.openGraph).toMatchObject({ siteName: SITE_NAME, locale: "es_AR", url: "/contact", title: "Contacto" });
  });

  it("sin imagen propia, al compartirla se ve la imagen del sitio", () => {
    const plain = pageMetadata({ title: "Contacto", description: "x", path: "/contact" });
    expect(plain.openGraph?.images).toEqual([SHARE_IMAGE]);
    const photo = { url: "https://x.test/a.jpg", alt: "Foto" };
    expect(pageMetadata({ title: "A", description: "x", path: "/a", image: photo }).openGraph?.images).toEqual([photo]);
  });

  it("una página fuera de los buscadores no lleva canónica pero sigue sus enlaces", () => {
    const m = pageMetadata({ title: "Resultados", description: "x", path: "/buscar?q=algo", index: false });
    expect(m.alternates).toBeUndefined();
    expect(m.robots).toEqual({ index: false, follow: true });
  });

  it("las páginas de la cuenta no se indexan", () => {
    expect(privateMetadata("Mi perfil").robots).toEqual({ index: false, follow: false });
  });
});
