import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact-form";
import { pageMetadata } from "@/lib/metadata";
import { CONTACT_CHANNELS, whatsappLink } from "@/modules/contact/messages";
import { getCurrentUser } from "@/modules/users/session";

export const metadata: Metadata = pageMetadata({
  title: "Contacto",
  description: "Escribinos por el formulario, por email o por WhatsApp.",
  path: "/contact",
});

// Con sesión, el formulario viene con nombre y email.
async function Form() {
  await connection();
  const user = await getCurrentUser();
  return <ContactForm defaults={user ? { name: user.name, email: user.email } : undefined} />;
}

// Contacto. Formulario y, al lado, email y WhatsApp.
export default function ContactPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Contacto</h1>
      <p className="text-muted-foreground">Escribinos por este formulario o, si preferís, por email o WhatsApp.</p>
      <ul className="flex flex-wrap gap-4 text-sm">
        <li>
          Email:{" "}
          <a href={`mailto:${CONTACT_CHANNELS.email}`} className="underline underline-offset-4">
            {CONTACT_CHANNELS.email}
          </a>
        </li>
        <li>
          <a
            href={whatsappLink(CONTACT_CHANNELS.whatsapp, "Hola, tengo una consulta")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Escribinos por WhatsApp
          </a>
        </li>
      </ul>
      {/* Mientras carga la sesión, sin campos para escribir: así no se pierde nada al reemplazarlo. */}
      <Suspense fallback={<p className="text-muted-foreground">Cargando el formulario…</p>}>
        <Form />
      </Suspense>
    </main>
  );
}
