import { describe, expect, it } from "vitest";
import { PERMISSIONS, ROLE_PERMISSIONS, hasPermission, isSuspended } from "./roles";

describe("users/roles", () => {
  it("el admin tiene todos los permisos", () => {
    for (const permission of PERMISSIONS) {
      expect(hasPermission(["admin"], permission)).toBe(true);
    }
  });

  it("un usuario común no administra nada", () => {
    expect(ROLE_PERMISSIONS.user).toEqual([]);
    for (const permission of PERMISSIONS) {
      expect(hasPermission(["user"], permission)).toBe(false);
    }
  });

  it("los permisos de varios roles se suman", () => {
    expect(hasPermission(["user", "admin"], "settings.manage")).toBe(true);
  });

  it("una cuenta sin roles está suspendida", () => {
    expect(isSuspended([])).toBe(true);
    expect(isSuspended(["user"])).toBe(false);
  });

  it("un usuario sin roles no tiene ningún permiso", () => {
    for (const permission of PERMISSIONS) {
      expect(hasPermission([], permission)).toBe(false);
    }
  });
});
