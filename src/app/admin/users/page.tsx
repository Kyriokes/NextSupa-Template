import Image from "next/image";
import { connection } from "next/server";
import { Suspense } from "react";
import { z } from "zod";
import { NoAccess } from "@/components/no-access";
import { Pager } from "@/components/pager";
import { Button } from "@/components/ui/button";
import { listUsers } from "@/modules/users/repository";
import { hasPermission } from "@/modules/users/roles";
import { getCurrentActor } from "@/modules/users/session";
import { UserRowForm } from "./user-row-form";

const dateFormat = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "medium",
  timeZone: "America/Argentina/Buenos_Aires",
});

const FilterSchema = z.object({
  q: z.string().max(80).catch(""),
  pagina: z.coerce.number().int().min(1).max(10_000).catch(1),
});

const hrefFor = (q: string, pagina: number) =>
  `/admin/users?${new URLSearchParams({ ...(q ? { q } : {}), ...(pagina > 1 ? { pagina: String(pagina) } : {}) })}`;

// Gestión de usuarios y roles. Solo el admin (user.manage_roles).
// Búsqueda por nombre o email y de a páginas.
async function Content({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // Lee la sesión: siempre en el momento del pedido.
  await connection();
  const actor = await getCurrentActor();
  if (!actor || !hasPermission(actor.roles, "user.manage_roles")) {
    // Acceso sin permisos.
    return <NoAccess />;
  }

  const filter = FilterSchema.parse(await searchParams);
  const result = await listUsers(filter.q, filter.pagina);
  return (
    <div className="flex flex-col gap-4">
      <form action="/admin/users" role="search" className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 text-sm">
          Buscar por nombre o email
          <input
            name="q"
            defaultValue={filter.q}
            maxLength={80}
            className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          />
        </label>
        <Button type="submit" variant="outline">
          Buscar
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        {result.total} usuario{result.total === 1 ? "" : "s"}
      </p>
      <ul className="flex flex-col gap-4">
        {result.users.map((u) => (
          <li key={u.id} className="flex flex-col gap-3 rounded-lg border p-4">
            <div className="flex items-center gap-3">
              {u.photoUrl && <Image src={u.photoUrl} alt="" width={40} height={40} className="rounded-full" />}
              <div>
                <p className="font-medium">
                  {u.name}
                  {u.id === actor.id && " (vos)"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {u.email} · desde el {dateFormat.format(u.createdAt)}
                </p>
              </div>
            </div>
            <UserRowForm userId={u.id} roles={u.roles} adminNote={u.adminNote} />
          </li>
        ))}
      </ul>
      <Pager page={result.page} pages={result.pages} hrefFor={(n) => hrefFor(filter.q, n)} />
    </div>
  );
}

export default function UsersPage({ searchParams }: PageProps<"/admin/users">) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Usuarios y roles</h1>
        <p className="text-muted-foreground">
          Ajustá roles o bloqueá una cuenta dejándola sin roles, con una nota del motivo.
        </p>
      </div>
      <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
        <Content searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
