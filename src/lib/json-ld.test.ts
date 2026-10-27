import { describe, expect, it } from "vitest";
import { jsonLd } from "./json-ld";

describe("lib/json-ld", () => {
  it("escapa lo que podría cerrar la etiqueta <script>", () => {
    const text = jsonLd({ name: "</script><b>&" });
    expect(text).not.toContain("<");
    expect(text).not.toContain(">");
    expect(text).toBe('{"name":"\\u003c/script\\u003e\\u003cb\\u003e\\u0026"}');
  });

  it("sigue siendo el mismo JSON", () => {
    const data = { "@type": "Product", name: "Pollo </script> & arroz" };
    expect(JSON.parse(jsonLd(data))).toEqual(data);
  });
});
