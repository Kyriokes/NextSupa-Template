"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useUiStore } from "@/stores/ui-store";

// Ingresar con Google. No hay registro aparte: el primer ingreso crea la
// cuenta con el rol "user". Va una sola vez, en el encabezado: si está
// abierto lo decide useUiStore, así LoginButton lo abre desde cualquier
// página.
export function LoginDialog({ triggerVariant = "default" }: { triggerVariant?: "default" | "onBrand" }) {
  const open = useUiStore((s) => s.loginOpen);
  const setOpen = useUiStore((s) => s.setLoginOpen);
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  async function signInWithGoogle() {
    setPending(true);
    setError(false);
    // Después de ingresar se vuelve a la página actual; el servidor valida
    // que sea una ruta interna (safeRedirectPath).
    const next = window.location.pathname + window.location.search;
    const { error } = await createSupabaseBrowserClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setError(true);
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => setOpen(next)}>
      <DialogTrigger render={<Button variant={triggerVariant} />}>Ingresar</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ingresar</DialogTitle>
          <DialogDescription>Usá tu cuenta de Google. Si es tu primera vez, se crea tu cuenta.</DialogDescription>
        </DialogHeader>
        <Button onClick={signInWithGoogle} disabled={pending}>
          {pending ? "Abriendo Google…" : "Continuar con Google"}
        </Button>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            No se pudo iniciar el ingreso. Probá de nuevo.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
