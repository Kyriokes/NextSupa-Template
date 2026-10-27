import { describe, expect, it } from "vitest";
import { adminSections, navigationFor } from "./navigation";

const hrefs = (roles: Parameters<typeof navigationFor>[0]) =>
  navigationFor(roles).flatMap((g) => g.items.map((i) => i.href));

describe("users/navigation", () => {
  it("un usuario común solo ve su cuenta", () => {
    expect(hrefs(["user"])).toEqual(["/profile"]);
    expect(adminSections(["user"])).toEqual([]);
  });

  it("el admin ve todo, agrupado", () => {
    const groups = navigationFor(["admin"]);
    expect(groups.map((g) => g.label)).toEqual(["Mi cuenta", "Administración"]);
    expect(adminSections(["admin"]).map((i) => i.href)).toEqual([
      "/admin/users",
      "/admin/messages",
      "/admin/content",
      "/admin/settings/appearance",
    ]);
  });

  it("no hay grupos vacíos; una cuenta sin roles solo ve su perfil", () => {
    expect(navigationFor([])).toEqual([{ label: "Mi cuenta", items: [{ href: "/profile", label: "Mi perfil" }] }]);
  });
});
