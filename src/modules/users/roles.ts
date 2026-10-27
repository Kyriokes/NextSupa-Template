import { z } from "zod";

// Un usuario puede tener varios roles a la vez. Agregá acá los roles del
// proyecto (y en el check de users.roles en tables.ts).
export const ROLES = ["admin", "user"] as const;

export const RoleSchema = z.enum(ROLES);
export type Role = z.infer<typeof RoleSchema>;

// Nombres para la interfaz.
export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrador",
  user: "Usuario",
};

// Quien ejecuta una acción: su id y los roles que tiene.
export type Actor = { id: string; roles: readonly Role[] };

// Solo permisos que usa alguna pantalla o acción. Sumá los del proyecto a
// medida que aparecen, no antes.
export const PERMISSIONS = [
  "user.manage_roles", // /admin/users
  "contact.manage", // /admin/messages: leer los mensajes de contacto
  "content.manage", // /admin/content
  "settings.manage", // /admin/settings/appearance
] as const;

export const PermissionSchema = z.enum(PERMISSIONS);
export type Permission = z.infer<typeof PermissionSchema>;

// Cada rol lleva su lista explícita de permisos, sin herencia entre roles.
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  // Acceso total.
  admin: PERMISSIONS,
  // Usa el sitio con su cuenta; no administra nada.
  user: [],
};

// Una cuenta sin roles está suspendida. Solo ve la pantalla de cuenta
// suspendida y no puede hacer ninguna acción, salvo cerrar sesión.
export function isSuspended(roles: readonly Role[]): boolean {
  return roles.length === 0;
}

// Un usuario sin roles no tiene ningún permiso.
export function hasPermission(roles: readonly Role[], permission: Permission): boolean {
  return roles.some((role) => ROLE_PERMISSIONS[role].includes(permission));
}
