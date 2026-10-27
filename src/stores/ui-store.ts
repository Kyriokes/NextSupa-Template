import { create } from "zustand";

// Estado de la interfaz que comparten componentes que no se tocan entre sí.
// Ejemplo básico: el diálogo de ingreso vive en el encabezado y cualquier
// botón "Ingresar" de una página lo abre (LoginButton).
//
// Cada página o funcionalidad crea su propio store si lo necesita. Este es
// global, así que solo lleva estado del navegador: en el servidor siempre
// arranca en su valor inicial. Datos del servidor van por props, no acá.
type UiState = {
  loginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>()((set) => ({
  loginOpen: false,
  setLoginOpen: (open) => set({ loginOpen: open }),
}));
