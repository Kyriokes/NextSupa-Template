"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

// Una página que falló (por ejemplo, la base no respondió). El error ya
// quedó en el registro del servidor; acá solo se ofrece reintentar.
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p className="text-6xl font-semibold text-muted-foreground" aria-hidden>
        ¡Ups!
      </p>
      <h1 className="text-2xl font-semibold">Algo salió mal</h1>
      <p className="text-muted-foreground">No pudimos mostrar esta página. Probá de nuevo en un momento.</p>
      <div className="flex gap-3">
        <Button onClick={reset}>Reintentar</Button>
        <Button variant="outline" render={<Link href="/" />} nativeButton={false}>
          Volver al inicio
        </Button>
      </div>
    </main>
  );
}
