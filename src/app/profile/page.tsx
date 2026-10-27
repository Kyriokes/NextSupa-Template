import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { Avatar } from "@/components/avatar";
import { LoginButton } from "@/components/login-button";
import { privateMetadata } from "@/lib/metadata";
import { ROLE_LABELS } from "@/modules/users/roles";
import { getCurrentUser } from "@/modules/users/session";
import { NameForm, PhotoForm } from "./profile-forms";

export const metadata: Metadata = privateMetadata("Mi perfil");

// Perfil y datos personales.
async function Profile() {
  // Lee la sesión: siempre en el momento del pedido.
  await connection();
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p>Ingresá para ver tu perfil.</p>
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex items-center gap-4">
        <Avatar name={user.name} photoUrl={user.photoUrl} size={64} />
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-sm text-muted-foreground">{user.roles.map((r) => ROLE_LABELS[r]).join(", ")}</p>
        </div>
      </section>
      <NameForm name={user.name} />
      <PhotoForm />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Mi perfil</h1>
      <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
        <Profile />
      </Suspense>
    </main>
  );
}
