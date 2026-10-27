import { connection } from "next/server";
import { ContactForm } from "@/components/contact-form";
import { isSuspended } from "@/modules/users/roles";
import { getCurrentUser } from "@/modules/users/session";

// Una cuenta sin roles solo ve esta pantalla, estilo "página no
// encontrada", en lugar de cualquier página del sitio. Lee la sesión: va
// dentro de <Suspense> en el layout y se calcula en cada pedido.
export async function AccountGate({ children }: { children: React.ReactNode }) {
  await connection();
  const user = await getCurrentUser();
  if (!user || !isSuspended(user.roles)) return children;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p className="text-6xl font-semibold text-muted-foreground" aria-hidden>
        ¡Ups!
      </p>
      <h1 className="text-2xl font-semibold">Tu cuenta está suspendida</h1>
      <p className="text-muted-foreground">No podés usar el sitio por ahora. Si tenés dudas, escribinos a soporte.</p>
      {/* La misma vista de contacto, para llegar a soporte. */}
      <ContactForm defaults={{ name: user.name, email: user.email }} />
    </main>
  );
}
