import { describe, expect, it } from "vitest";
import { planUserSync, profileFromGoogle, safeRedirectPath } from "./sign-in";
import type { User } from "./schema";

const ID = "550e8400-e29b-41d4-a716-446655440000";

describe("users/sign-in: perfil de Google", () => {
  it("toma email, nombre y foto de Google", () => {
    const r = profileFromGoogle({
      id: ID,
      email: "Ana@Example.com",
      user_metadata: {
        full_name: "Ana Pérez",
        avatar_url: "https://lh3.googleusercontent.com/a/foto",
      },
    });
    expect(r).toEqual({
      ok: true,
      profile: {
        id: ID,
        email: "ana@example.com",
        name: "Ana Pérez",
        photoUrl: "https://lh3.googleusercontent.com/a/foto",
      },
    });
  });

  it("usa name y picture si no vienen full_name ni avatar_url", () => {
    const r = profileFromGoogle({
      id: ID,
      email: "ana@example.com",
      user_metadata: { name: "Ana", picture: "https://example.com/p.png" },
    });
    expect(r).toMatchObject({
      ok: true,
      profile: { name: "Ana", photoUrl: "https://example.com/p.png" },
    });
  });

  it("sin nombre usa la parte local del email; sin foto válida la omite", () => {
    const r = profileFromGoogle({
      id: ID,
      email: "ana.perez@example.com",
      user_metadata: { full_name: "  ", avatar_url: "no-es-url" },
    });
    expect(r).toEqual({
      ok: true,
      profile: { id: ID, email: "ana.perez@example.com", name: "ana.perez" },
    });
  });

  it("rechaza un usuario sin email válido o sin id", () => {
    expect(profileFromGoogle({ id: ID, user_metadata: {} })).toEqual({
      ok: false,
      error: "invalid_profile",
    });
    expect(profileFromGoogle({ id: "x", email: "ana@example.com" })).toEqual({
      ok: false,
      error: "invalid_profile",
    });
  });
});

describe("users/sign-in: alta en el primer ingreso", () => {
  const profile = { id: ID, email: "ana@example.com", name: "Ana" };

  it("en el primer ingreso se crea como Usuario", () => {
    expect(planUserSync(null, profile)).toEqual({
      action: "create",
      user: { ...profile, roles: ["user"] },
    });
  });

  it("un usuario existente no cambia sus roles ni sus datos", () => {
    const existing: User = {
      ...profile,
      name: "Ana editada",
      roles: ["user", "admin"],
    };
    expect(planUserSync(existing, { ...profile, name: "Otro" })).toEqual({
      action: "none",
    });
  });

  it("un usuario bloqueado (sin roles) sigue bloqueado al volver a entrar", () => {
    const blocked: User = { ...profile, roles: [], adminNote: "Spam" };
    expect(planUserSync(blocked, profile)).toEqual({ action: "none" });
  });
});

describe("users/sign-in: volver después del ingreso", () => {
  it("acepta rutas internas", () => {
    expect(safeRedirectPath("/profile")).toBe("/profile");
    expect(safeRedirectPath("/admin/users?q=ana#lista")).toBe("/admin/users?q=ana#lista");
  });

  it("evita redirigir a otro sitio", () => {
    for (const next of [
      "https://evil.com",
      "//evil.com",
      "/\\evil.com",
      "\\\\evil.com",
      "/.//evil.com",
      "/..//evil.com",
      "/a/..//evil.com",
      "javascript:alert(1)",
      "profile",
      "",
      null,
      undefined,
    ]) {
      expect(safeRedirectPath(next)).toBe("/");
    }
  });
});
