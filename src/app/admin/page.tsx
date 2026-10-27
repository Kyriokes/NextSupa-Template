import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { NoAccess } from "@/components/no-access";
import { adminSections } from "@/modules/users/navigation";
import { getCurrentActor } from "@/modules/users/session";

// Portada del panel: las secciones que el usuario puede abrir. Cada sección
// vuelve a verificar su permiso en el servidor.
async function Content() {
  await connection();
  const actor = await getCurrentActor();
  const sections = actor ? adminSections(actor.roles) : [];
  if (sections.length === 0) return <NoAccess />;
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {sections.map((s) => (
        <li key={s.href}>
          <Link href={s.href} className="block rounded-lg border px-4 py-3 font-medium hover:bg-muted">
            {s.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function AdminPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Administración</h1>
      <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
        <Content />
      </Suspense>
    </main>
  );
}
