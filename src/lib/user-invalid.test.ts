import { describe, expect, it } from "vitest";
import { toggleId } from "./user-invalid";

describe("toggleId", () => {
  it("agrega el id a una lista vacía", () => {
    expect(toggleId(null, "err", true)).toBe("err");
  });

  it("agrega el id al final sin tocar los demás", () => {
    expect(toggleId("hint", "err", true)).toBe("hint err");
  });

  it("no duplica un id que ya está", () => {
    expect(toggleId("err hint", "err", true)).toBe("hint err");
  });

  it("saca el id y conserva los demás", () => {
    expect(toggleId("hint  err", "err", false)).toBe("hint");
  });

  it("devuelve null si la lista queda vacía", () => {
    expect(toggleId("err", "err", false)).toBeNull();
    expect(toggleId("", "err", false)).toBeNull();
  });
});
