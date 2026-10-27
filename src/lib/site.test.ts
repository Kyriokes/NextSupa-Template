import { describe, expect, it } from "vitest";
import { publicSiteUrl } from "./site";

describe("lib/site: publicSiteUrl", () => {
  it("en Vercel usa la dirección de producción, con https", () => {
    expect(publicSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "mi-proyecto.vercel.app" })).toBe(
      "https://mi-proyecto.vercel.app",
    );
  });

  it("en local, localhost", () => {
    expect(publicSiteUrl({})).toBe("http://localhost:3000");
  });
});
