import { describe, expect, it } from "vitest";
import { planUserUpdate } from "./management";
import type { Actor } from "./roles";

const admin: Actor = { id: "admin-1", roles: ["user", "admin"] };
const target = { id: "user-1", roles: ["user"] as const };

describe("users/management: cambiar roles y nota", () => {
  it("el admin cambia roles y nota", () => {
    expect(
      planUserUpdate({
        actor: admin,
        target,
        input: { roles: ["user", "admin"], adminNote: " Ayuda a moderar " },
      }),
    ).toEqual({
      ok: true,
      update: { roles: ["user", "admin"], adminNote: "Ayuda a moderar" },
    });
  });

  it("bloquear es dejar sin roles; la nota explica el motivo", () => {
    expect(
      planUserUpdate({
        actor: admin,
        target,
        input: { roles: [], adminNote: "Spam en contacto" },
      }),
    ).toEqual({
      ok: true,
      update: { roles: [], adminNote: "Spam en contacto" },
    });
  });

  it("una nota vacía se guarda como sin nota; roles repetidos se unifican", () => {
    expect(
      planUserUpdate({
        actor: admin,
        target,
        input: { roles: ["user", "user"], adminNote: "   " },
      }),
    ).toEqual({ ok: true, update: { roles: ["user"], adminNote: null } });
  });

  it("solo quien tiene user.manage_roles puede cambiar", () => {
    for (const roles of [["user"], []] as const) {
      expect(
        planUserUpdate({
          actor: { id: "x", roles },
          target,
          input: { roles: ["user"], adminNote: "" },
        }),
      ).toEqual({ ok: false, error: "not_allowed" });
    }
  });

  it("el admin no puede quitarse a sí mismo el rol de admin", () => {
    expect(
      planUserUpdate({
        actor: admin,
        target: { id: admin.id, roles: admin.roles },
        input: { roles: ["user"], adminNote: "" },
      }),
    ).toEqual({ ok: false, error: "self_demotion" });
  });

  it("rechaza roles desconocidos y notas demasiado largas", () => {
    for (const input of [
      { roles: ["superusuario"], adminNote: "" },
      { roles: ["user"], adminNote: "a".repeat(501) },
      { roles: "user", adminNote: "" },
    ]) {
      expect(planUserUpdate({ actor: admin, target, input })).toEqual({
        ok: false,
        error: "invalid",
      });
    }
  });
});
