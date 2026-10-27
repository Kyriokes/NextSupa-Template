import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { signOut } from "@/app/auth/actions";
import { LoginDialog } from "@/components/login-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import { SITE_NAME } from "@/lib/metadata";
import { navigationFor } from "@/modules/users/navigation";
import { isAllowedPhotoUrl } from "@/modules/users/photo";
import { isSuspended } from "@/modules/users/roles";
import { getCurrentUser } from "@/modules/users/session";

const bandLink = "shrink-0 rounded-md px-2 py-1 hover:bg-primary-foreground/10";

// Enlaces del sitio, iguales para todos. Sumá acá las secciones del proyecto.
const SITE_LINKS = [
  { href: "/faq", label: "Ayuda" },
  { href: "/contact", label: "Contacto" },
];

// La cuenta: quién soy y mis cosas. Lee la sesión: con Cache Components va
// dentro de <Suspense> y se resuelve en cada pedido, mientras el resto del
// encabezado queda estático.
async function AccountArea() {
  // Supabase compara Date.now() con el vencimiento del token. Con Partial
  // Prefetching, Next intentaría preparar esto de antemano con las cookies y
  // rechaza valores que cambian en cada render; connection() lo deja siempre
  // para el momento del pedido, así un bloqueo se nota enseguida.
  await connection();
  const user = await getCurrentUser();
  if (!user) return <LoginDialog triggerVariant="onBrand" />;
  // Una cuenta suspendida solo puede cerrar sesión.
  if (isSuspended(user.roles)) {
    return (
      <form action={signOut}>
        <Button type="submit" variant="onBrand">
          Salir
        </Button>
      </form>
    );
  }
  // Solo se pasa la foto si next/image la va a aceptar (ver isAllowedPhotoUrl).
  const photoUrl = isAllowedPhotoUrl(user.photoUrl, process.env.NEXT_PUBLIC_SUPABASE_URL!) ? user.photoUrl : null;
  return <UserMenu name={user.name} photoUrl={photoUrl} groups={navigationFor(user.roles)} />;
}

// Encabezado sobre el color primario: nombre del sitio, enlaces, modo de
// color y la cuenta.
export function SiteHeader() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight">
          {SITE_NAME}
        </Link>
        <nav aria-label="Sitio" className="flex items-center gap-1 text-sm">
          {SITE_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className={bandLink}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 text-sm">
          <ThemeToggle />
          <Suspense fallback={<div className="h-8 w-24" aria-hidden />}>
            <AccountArea />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
