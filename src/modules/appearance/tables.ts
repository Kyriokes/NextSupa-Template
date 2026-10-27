import { sql } from "drizzle-orm";
import { check, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "@/modules/users/tables";

// Una fila por modo (claro y oscuro). `colors` guarda la paleta como
// { categoría: "#rrggbb" }; al leerla pasa por sanitizePalette.
// RLS activado y sin políticas.
export const themePalettes = pgTable(
  "theme_palettes",
  {
    mode: text("mode").primaryKey(),
    colors: jsonb("colors").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    updatedBy: uuid("updated_by").references(() => users.id, {
      onDelete: "set null",
    }),
  },
  (t) => [check("theme_palettes_mode_valid", sql`${t.mode} in ('light', 'dark')`)],
).enableRLS();
