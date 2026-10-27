import { sql } from "drizzle-orm";
import { check, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

// Usuarios del sistema. El id es el de Supabase Auth (auth.users), que es
// quien guarda el ingreso con Google. Acá vive lo nuestro: roles, datos de
// perfil y la nota del admin.
// RLS activado y sin políticas: solo el servidor la lee, vía Drizzle.
export const users = pgTable(
  "users",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    photoUrl: text("photo_url"),
    roles: text("roles")
      .array()
      .notNull()
      .default(sql`'{user}'::text[]`),
    adminNote: text("admin_note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Misma lista que ROLES en roles.ts.
    check("users_roles_valid", sql`${t.roles} <@ array['admin','user']::text[]`),
  ],
).enableRLS();
