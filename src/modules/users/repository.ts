import { asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { pageWithin } from "@/lib/pagination";
import { likePattern } from "@/lib/search";
import { planUserUpdate } from "./management";
import { RoleSchema, type Actor, type Role } from "./roles";
import { users } from "./tables";

const knownRoles = (roles: string[]) => roles.filter((r): r is Role => RoleSchema.safeParse(r).success);

export const USERS_PAGE_SIZE = 25;

// Usuarios para la gestión del admin, los más nuevos primero y de a páginas.
// `query` busca por nombre o email.
export async function listUsers(query: string, requestedPage: number) {
  const where = query.trim()
    ? or(ilike(users.name, likePattern(query)), ilike(users.email, likePattern(query)))
    : undefined;
  const [{ total }] = await db.select({ total: count() }).from(users).where(where);
  const { page, pages } = pageWithin(requestedPage, total, USERS_PAGE_SIZE);
  const rows = await db
    .select()
    .from(users)
    .where(where)
    .orderBy(desc(users.createdAt), asc(users.id))
    .limit(USERS_PAGE_SIZE)
    .offset((page - 1) * USERS_PAGE_SIZE);
  const items = rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    photoUrl: r.photoUrl,
    roles: knownRoles(r.roles),
    adminNote: r.adminNote,
    createdAt: r.createdAt,
  }));
  return { users: items, total, page, pages };
}

// Aplica planUserUpdate dentro de una transacción, leyendo los roles actuales
// con FOR UPDATE para no pisar un cambio simultáneo.
export async function updateUserByAdmin(input: { actor: Actor; targetId: string; input: unknown }) {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .select({ id: users.id, roles: users.roles })
      .from(users)
      .where(eq(users.id, input.targetId))
      .for("update");
    if (!row) return { ok: false as const, error: "not_found" as const };
    const plan = planUserUpdate({
      actor: input.actor,
      target: { id: row.id, roles: knownRoles(row.roles) },
      input: input.input,
    });
    if (!plan.ok) return plan;
    await tx
      .update(users)
      .set({ roles: plan.update.roles, adminNote: plan.update.adminNote })
      .where(eq(users.id, row.id));
    return { ok: true as const };
  });
}

// El usuario cambia su nombre.
export async function updateUserName(userId: string, name: string) {
  await db.update(users).set({ name }).where(eq(users.id, userId));
}

// Guarda la URL de la nueva foto de perfil.
export async function updateUserPhoto(userId: string, photoUrl: string) {
  await db.update(users).set({ photoUrl }).where(eq(users.id, userId));
}
