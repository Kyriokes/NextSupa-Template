# Plan y estado

## Estado actual

- Proyecto creado desde el template. Todavía sin dominio propio.
- Incluye: ingreso con Google, roles y permisos, perfil con foto, panel de administración (usuarios, mensajes, contenido, apariencia), páginas de texto, contacto y CI.

## Para arrancar

- [ ] Completar el nombre y la descripción del proyecto en `CLAUDE.md` y en `src/lib/metadata.ts`.
- [ ] Crear el proyecto en Supabase, configurar el ingreso con Google y completar `.env.local` (ver README).
- [ ] Aplicar las migraciones (`npm run db:migrate`) y crear los buckets (`npm run storage:setup`).
- [ ] Ingresar y darse el rol de administrador (ver README).
- [ ] Cambiar la paleta base, el ícono y los canales de contacto por los del proyecto.
- [ ] Borrar los módulos que no se usen.
- [ ] Escribir las primeras reglas en `docs/reglas-de-negocio.md`.

## Próximos pasos

- [A DEFINIR]
