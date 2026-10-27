"use server";

import { ContactMessageSchema, isSpamTrap } from "@/modules/contact/messages";
import { saveContactMessage } from "@/modules/contact/repository";
import { getCurrentUser } from "@/modules/users/session";

export type ContactActionResult = { ok: true } | { ok: false; message: string };

// Enviar un mensaje de contacto. Lo puede usar cualquiera,
// incluso una cuenta suspendida (es su forma de llegar a soporte).
export async function sendContactMessageAction(input: unknown): Promise<ContactActionResult> {
  const data = typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
  // Un bot completó el campo trampa: se responde "listo" sin guardar nada.
  if (isSpamTrap(data)) return { ok: true };
  const parsed = ContactMessageSchema.safeParse(data);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Revisá los datos." };
  try {
    const user = await getCurrentUser();
    const r = await saveContactMessage(parsed.data, user ? { id: user.id, email: user.email } : null);
    if (!r.ok) {
      return { ok: false, message: "Recibimos muchos mensajes en la última hora. Probá más tarde." };
    }
  } catch {
    return { ok: false, message: "No se pudo enviar. Probá de nuevo." };
  }
  return { ok: true };
}
