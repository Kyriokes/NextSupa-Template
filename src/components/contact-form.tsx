"use client";

import { CircleAlert } from "lucide-react";
import { useId, useState, useTransition, type ReactNode } from "react";
import { sendContactMessageAction } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import { useUserInvalidAria } from "@/lib/user-invalid";

// Los campos se marcan en rojo recién después de que la persona los toca o
// intenta enviar (:user-invalid), no al cargar la página.
const fieldClass =
  "peer rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 user-invalid:border-destructive user-invalid:ring-3 user-invalid:ring-destructive/20 dark:user-invalid:border-destructive/50 dark:user-invalid:ring-destructive/40";

// Mensaje bajo el campo, visible solo mientras el campo es inválido. Va con
// ícono y redactado como error para no depender solo del color.
function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="hidden items-center gap-1 text-destructive peer-user-invalid:flex">
      <CircleAlert aria-hidden="true" className="size-3.5 shrink-0" />
      {children}
    </p>
  );
}

// Formulario de contacto. Se usa en la página de contacto y
// en la pantalla de cuenta suspendida. Con sesión, nombre y email vienen
// precargados.
export function ContactForm({ defaults }: { defaults?: { name: string; email: string } }) {
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const formRef = useUserInvalidAria();
  const id = useId();

  if (sent) {
    return (
      <div role="status" className="flex flex-col gap-2 rounded-lg border p-4 text-sm">
        <p className="font-medium">¡Gracias! Recibimos tu mensaje.</p>
        <p className="text-muted-foreground">Te vamos a responder por email.</p>
        <Button variant="ghost" className="w-fit" onClick={() => setSent(false)}>
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className="flex w-full flex-col gap-3 text-left"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form));
        setMessage(null);
        start(async () => {
          const r = await sendContactMessageAction(data);
          if (r.ok) {
            form.reset();
            setSent(true);
          } else {
            setMessage(r.message);
          }
        });
      }}
    >
      <p className="text-sm text-muted-foreground">Todos los campos son obligatorios.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1 text-sm">
          <label htmlFor={`${id}-name`}>Nombre</label>
          <input
            id={`${id}-name`}
            name="name"
            required
            maxLength={80}
            autoComplete="name"
            defaultValue={defaults?.name}
            data-error={`${id}-name-error`}
            className={`${fieldClass} h-8`}
          />
          <FieldError id={`${id}-name-error`}>Completá tu nombre.</FieldError>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <label htmlFor={`${id}-email`}>Email</label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            defaultValue={defaults?.email}
            // Con sesión se usa el email de la cuenta (el servidor lo impone igual).
            readOnly={!!defaults}
            data-error={`${id}-email-error`}
            className={`${fieldClass} h-8 read-only:bg-muted`}
          />
          <FieldError id={`${id}-email-error`}>Escribí un email válido.</FieldError>
        </div>
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <label htmlFor={`${id}-subject`}>Motivo</label>
        <input
          id={`${id}-subject`}
          name="subject"
          required
          maxLength={120}
          data-error={`${id}-subject-error`}
          className={`${fieldClass} h-8`}
        />
        <FieldError id={`${id}-subject-error`}>Completá el motivo.</FieldError>
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <label htmlFor={`${id}-message`}>Mensaje</label>
        {/* Crece con el texto (field-sizing) hasta un tope; después, scroll. */}
        <textarea
          id={`${id}-message`}
          name="message"
          required
          minLength={10}
          maxLength={4000}
          data-error={`${id}-message-error`}
          className={`${fieldClass} field-sizing-content max-h-96 min-h-32 py-1`}
        />
        <FieldError id={`${id}-message-error`}>Escribí tu mensaje, de al menos 10 caracteres.</FieldError>
      </div>
      {/* Campo trampa para bots: oculto para las personas y para los lectores de pantalla. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <Button type="submit" className="w-fit" disabled={pending}>
        {pending ? "Enviando…" : "Enviar"}
      </Button>
      {message && (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}
      {/* Anuncia el error de un campo al salir de él (ver useUserInvalidAria). */}
      <p data-field-announcer aria-live="polite" className="sr-only" />
    </form>
  );
}
