import { beforeEach, describe, expect, it } from "vitest";
import { useUiStore } from "./ui-store";

describe("stores/ui-store", () => {
  // El store es global: cada test arranca del estado inicial.
  beforeEach(() => useUiStore.setState({ loginOpen: false }));

  it("el diálogo de ingreso arranca cerrado", () => {
    expect(useUiStore.getState().loginOpen).toBe(false);
  });

  it("se abre y se cierra desde cualquier componente", () => {
    useUiStore.getState().setLoginOpen(true);
    expect(useUiStore.getState().loginOpen).toBe(true);
    useUiStore.getState().setLoginOpen(false);
    expect(useUiStore.getState().loginOpen).toBe(false);
  });
});
