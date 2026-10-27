import { describe, expect, it } from "vitest";
import { contrastRatio } from "./color";
import {
  DEFAULT_PALETTES,
  MIN_TEXT_CONTRAST,
  PALETTE_CATEGORIES,
  PaletteSchema,
  onColorOf,
  sanitizePalette,
  validatePalette,
} from "./palette";

describe("appearance/palette", () => {
  it("ocho categorías por paleta", () => {
    expect(PALETTE_CATEGORIES).toEqual([
      "background",
      "foreground",
      "primary",
      "secondary",
      "accent",
      "destructive",
      "success",
      "warning",
    ]);
  });

  it("las paletas base cumplen el contraste", () => {
    expect(validatePalette(DEFAULT_PALETTES.light)).toEqual([]);
    expect(validatePalette(DEFAULT_PALETTES.dark)).toEqual([]);
  });

  it("detecta texto ilegible sobre el fondo", () => {
    const p = { ...DEFAULT_PALETTES.light, foreground: "#eeeeee" };
    expect(validatePalette(p)).toContainEqual(expect.objectContaining({ pair: ["texto", "fondo"] }));
  });

  it("error, éxito y advertencia también deben leerse sobre el fondo", () => {
    const p = { ...DEFAULT_PALETTES.light, warning: "#ffe066" };
    expect(validatePalette(p).map((i) => i.pair)).toContainEqual(["advertencia", "fondo"]);
  });

  it("informa la relación medida, por debajo del mínimo", () => {
    const p = { ...DEFAULT_PALETTES.light, foreground: "#eeeeee" };
    const issue = validatePalette(p).find((i) => i.pair[0] === "texto");
    expect(issue?.ratio).toBeLessThan(MIN_TEXT_CONTRAST);
  });

  it("el texto sobre cada color es el más legible entre texto y fondo", () => {
    const p = DEFAULT_PALETTES.light;
    expect(onColorOf(p, "destructive")).toBe(p.background);
    expect(onColorOf(p, "primary")).toBe(p.background);
    expect(onColorOf(p, "secondary")).toBe(p.foreground);
    expect(contrastRatio(onColorOf(p, "primary"), p.primary)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
  });

  it("completa categorías faltantes o inválidas con la base", () => {
    const p = sanitizePalette({ primary: "#264653", warning: "rojo" }, "light");
    expect(p.primary).toBe("#264653");
    expect(p.warning).toBe(DEFAULT_PALETTES.light.warning);
    expect(p.success).toBe(DEFAULT_PALETTES.light.success);
    expect(sanitizePalette(null, "dark")).toEqual(DEFAULT_PALETTES.dark);
    expect(sanitizePalette({ primary: "264653" }, "dark").primary).toBe("#264653");
  });

  it("el esquema normaliza y rechaza colores inválidos o faltantes", () => {
    const ok = PaletteSchema.safeParse({
      ...DEFAULT_PALETTES.light,
      primary: "264653",
    });
    expect(ok.success && ok.data.primary).toBe("#264653");
    expect(PaletteSchema.safeParse({ ...DEFAULT_PALETTES.light, primary: "#123" }).success).toBe(false);
    const missing: Partial<Record<string, string>> = { ...DEFAULT_PALETTES.light };
    delete missing.warning;
    expect(PaletteSchema.safeParse(missing).success).toBe(false);
  });
});
