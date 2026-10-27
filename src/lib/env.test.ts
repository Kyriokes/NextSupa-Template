import { describe, expect, it } from "vitest";
import { assertEnv, envProblems } from "./env";

const valid = {
  NEXT_PUBLIC_SUPABASE_URL: "https://abcdefghijklmnop.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_x",
  SUPABASE_SECRET_KEY: "sb_secret_x",
  DATABASE_URL: "postgresql://postgres.abc:clave@aws-0-sa-east-1.pooler.supabase.com:5432/postgres",
};

describe("lib/env", () => {
  it("con todas las variables no hay problemas", () => {
    expect(envProblems(valid)).toEqual([]);
    expect(() => assertEnv(valid)).not.toThrow();
  });

  it("dice qué variable falta; vacía cuenta como faltante", () => {
    expect(envProblems({ ...valid, SUPABASE_SECRET_KEY: undefined, DATABASE_URL: "  " })).toEqual([
      "SUPABASE_SECRET_KEY: falta",
      "DATABASE_URL: falta",
    ]);
  });

  it("marca valores con otra forma", () => {
    expect(envProblems({ ...valid, NEXT_PUBLIC_SUPABASE_URL: "abc", DATABASE_URL: "https://x.test" })).toEqual([
      "NEXT_PUBLIC_SUPABASE_URL: valor inválido",
      "DATABASE_URL: valor inválido",
    ]);
  });

  it("el error lista todo lo que hay que completar", () => {
    expect(() => assertEnv({})).toThrow(/NEXT_PUBLIC_SUPABASE_URL: falta[\s\S]*DATABASE_URL: falta/);
  });
});
