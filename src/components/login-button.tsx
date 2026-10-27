"use client";

import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/ui-store";

// "Ingresar" dentro de una página: abre el diálogo del encabezado
// (LoginDialog) en vez de montar otro.
export function LoginButton() {
  const setLoginOpen = useUiStore((s) => s.setLoginOpen);
  return <Button onClick={() => setLoginOpen(true)}>Ingresar</Button>;
}
