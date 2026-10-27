"use server";

import { sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db } from "@/lib/db";
import { describeContrastIssues, preparePaletteUpdate } from "@/modules/appearance/save";
import { PALETTES_TAG } from "@/modules/appearance/repository";
import { themePalettes } from "@/modules/appearance/tables";
import { getCurrentActor } from "@/modules/users/session";

export type SavePalettesResult = { ok: true } | { ok: false; message: string; details?: string[] };

// Guarda las dos paletas. El permiso y el contraste se
// verifican acá, en el servidor, aunque el formulario ya los muestre.
export async function savePalettes(input: unknown): Promise<SavePalettesResult> {
  const actor = await getCurrentActor();
  if (!actor) return { ok: false, message: "Tenés que ingresar para guardar." };

  const result = preparePaletteUpdate({ actor, palettes: input });
  if (!result.ok) {
    if (result.error === "low_contrast") {
      return {
        ok: false,
        message: "Algunos textos no se leerían bien.",
        details: describeContrastIssues(result.issues),
      };
    }
    return {
      ok: false,
      message: result.error === "not_allowed" ? "No tenés permiso para cambiar la paleta." : "Hay colores inválidos.",
    };
  }

  try {
    await db
      .insert(themePalettes)
      .values(
        (["light", "dark"] as const).map((mode) => ({
          mode,
          colors: result.palettes[mode],
          updatedBy: actor.id,
        })),
      )
      .onConflictDoUpdate({
        target: themePalettes.mode,
        set: {
          colors: sql`excluded.colors`,
          updatedBy: sql`excluded.updated_by`,
          updatedAt: sql`now()`,
        },
      });
  } catch {
    // Si la base falla, el admin conserva lo que editó en el formulario.
    return { ok: false, message: "No se pudo guardar. Probá de nuevo en un momento." };
  }

  // El admin y los visitantes ven la paleta nueva en el próximo pedido.
  updateTag(PALETTES_TAG);
  return { ok: true };
}
