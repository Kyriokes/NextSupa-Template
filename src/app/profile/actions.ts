"use server";

import { refresh } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AVATARS_BUCKET, avatarPathFromUrl, validatePhoto } from "@/modules/users/photo";
import { updateUserName, updateUserPhoto } from "@/modules/users/repository";
import { isSuspended } from "@/modules/users/roles";
import { ProfileUpdateSchema } from "@/modules/users/schema";
import { getCurrentActor, getCurrentUser } from "@/modules/users/session";

export type ActionResult = { ok: true } | { ok: false; message: string };

// Una cuenta suspendida no puede hacer ninguna acción.
const SUSPENDED: ActionResult = {
  ok: false,
  message: "Tu cuenta está suspendida. Si tenés dudas, contactá a soporte.",
};

const NOT_SIGNED_IN: ActionResult = {
  ok: false,
  message: "Tenés que ingresar para hacer esto.",
};

// Cambiar el nombre.
export async function updateNameAction(input: unknown): Promise<ActionResult> {
  const actor = await getCurrentActor();
  if (!actor) return NOT_SIGNED_IN;
  if (isSuspended(actor.roles)) return SUSPENDED;
  const parsed = ProfileUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Nombre inválido." };
  }
  try {
    await updateUserName(actor.id, parsed.data.name);
  } catch {
    return { ok: false, message: "No se pudo guardar. Probá de nuevo." };
  }
  refresh();
  return { ok: true };
}

const PHOTO_ERRORS = {
  empty: "Elegí una imagen.",
  too_large: "La imagen puede pesar hasta 1 MB.",
  unsupported_type: "Usá una imagen JPG, PNG o WebP.",
  content_mismatch: "El archivo no es una imagen JPG, PNG o WebP válida.",
} as const;

// Cambiar la foto de perfil. Se valida en el servidor (tipo, tamaño y
// contenido) y el bucket repite los límites. La foto anterior se borra si era
// nuestra; la de Google no se toca.
export async function uploadPhotoAction(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return NOT_SIGNED_IN;
  if (isSuspended(user.roles)) return SUSPENDED;
  const file = formData.get("photo");
  if (!(file instanceof File)) return { ok: false, message: PHOTO_ERRORS.empty };

  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const check = validatePhoto({ type: file.type, size: file.size, head });
  if (!check.ok) return { ok: false, message: PHOTO_ERRORS[check.error] };

  const storage = createSupabaseAdminClient().storage.from(AVATARS_BUCKET);
  const path = `${user.id}/${crypto.randomUUID()}.${check.ext}`;
  const { error } = await storage.upload(path, file, { contentType: file.type });
  if (error) return { ok: false, message: "No se pudo subir la imagen. Probá de nuevo." };

  try {
    await updateUserPhoto(user.id, storage.getPublicUrl(path).data.publicUrl);
  } catch {
    await storage.remove([path]);
    return { ok: false, message: "No se pudo guardar. Probá de nuevo." };
  }
  const previous = avatarPathFromUrl(user.photoUrl, process.env.NEXT_PUBLIC_SUPABASE_URL!, user.id);
  if (previous) await storage.remove([previous]);
  refresh();
  return { ok: true };
}
