import { describe, expect, it } from "vitest";
import { likePattern } from "./search";

describe("lib/search: likePattern", () => {
  it("busca el texto en cualquier parte, sin los espacios de los bordes", () => {
    expect(likePattern("  pollo ")).toBe("%pollo%");
  });

  it("escapa los comodines y la barra invertida", () => {
    expect(likePattern("50%_a\\b")).toBe("%50\\%\\_a\\\\b%");
  });
});
