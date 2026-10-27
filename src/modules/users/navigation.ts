import { hasPermission, type Permission, type Role } from "./roles";

export type NavItem = { href: string; label: string };
export type NavGroup = { label: string; items: NavItem[] };

// Menú del usuario. Cada entrada se muestra solo si el usuario tiene el
// permiso. La pantalla igual lo verifica en el servidor: esto solo decide qué
// se ofrece.
const MENU: { label: string; items: (NavItem & { permission?: Permission })[] }[] = [
  {
    label: "Mi cuenta",
    items: [{ href: "/profile", label: "Mi perfil" }],
  },
  {
    label: "Administración",
    items: [
      { href: "/admin/users", label: "Usuarios", permission: "user.manage_roles" },
      { href: "/admin/messages", label: "Mensajes", permission: "contact.manage" },
      { href: "/admin/content", label: "Contenido", permission: "content.manage" },
      { href: "/admin/settings/appearance", label: "Apariencia", permission: "settings.manage" },
    ],
  },
];

// Menú del usuario según sus roles, sin grupos vacíos.
export function navigationFor(roles: readonly Role[]): NavGroup[] {
  return MENU.map((group) => ({
    label: group.label,
    items: group.items
      .filter((i) => !i.permission || hasPermission(roles, i.permission))
      .map(({ href, label }) => ({ href, label })),
  })).filter((g) => g.items.length > 0);
}

// Entradas del panel de administración que el usuario puede abrir, para la
// portada de /admin.
export function adminSections(roles: readonly Role[]): NavItem[] {
  return navigationFor(roles).find((g) => g.label === "Administración")?.items ?? [];
}
