# Nombre del proyecto

Completar al arrancar: qué es, para quién y qué problema resuelve, en dos o tres líneas.

## Fuente de verdad

- Reglas de negocio y vistas: `docs/reglas-de-negocio.md`. Leelo antes de implementar cualquier funcionalidad y citá los códigos (RN-xxx, VU-xx) en commits y tests.
- No implementes nada marcado **[A DEFINIR]**: preguntale al desarrollador.
- Decisiones técnicas tomadas: `docs/decisiones.md`. Estado y próximos pasos: `docs/plan.md`.

## Stack

- Next.js 16 (App Router, Cache Components) con TypeScript en modo estricto.
- UI: Tailwind 4 y shadcn/ui (estilo `base-nova` sobre Base UI), íconos de lucide.
- Validación: Zod. Estado de interfaz compartido: Zustand.
- Base de datos: PostgreSQL en Supabase. Acceso con Drizzle ORM + SQL directo según convenga.
- Ingreso con Google mediante Supabase Auth.
- Hosting: Vercel. Ojo: su plan gratuito no permite uso comercial.

## Arquitectura

- La lógica de negocio vive en el backend, en módulos por dominio dentro de `src/modules/`. Nunca dentro de componentes de UI.
- Cada módulo sigue el mismo patrón: `tables.ts` (tablas de Drizzle), `schema.ts` (esquemas de Zod), reglas puras en archivos con nombre propio y su `*.test.ts` al lado, y `repository.ts` (acceso a datos).
- Módulos que trae el template: `users` (roles, sesión, perfil), `appearance` (paleta de colores), `content` (páginas de texto) y `contact` (formulario y bandeja). Borrá los que el proyecto no use.
- Permisos: cada página y cada Server Action verifica `hasPermission` en el servidor, cerca de los datos (`src/modules/users/roles.ts`). El menú solo decide qué se ofrece.
- Toda entrada se valida con Zod en el borde (formularios y API).
- No depender por completo del ORM: usar SQL directo cuando convenga delegar procesamiento a la base (agregaciones, estadísticas). Siempre parametrizado, nunca armado concatenando texto.
- Estado de interfaz que comparten componentes lejanos: un store de Zustand en `src/stores/`. Los datos del servidor van por props.
- No abstraer hasta tener dos casos reales. Nada de patrones "por si acaso".

## Convenciones

- Nombres en el código en inglés; textos de interfaz y documentación en español.
- Glosario: completar con los términos del negocio y su nombre en el código (por ejemplo, pedido = `order`).
- Commits chicos, mensaje en español, citando la regla (RN) cuando aplique.
- Formato con Prettier (`npm run format`); el CI lo verifica.

## Comandos

- `npm run dev`: servidor de desarrollo.
- `npm run build`: build de producción (necesita la base: prerenderiza páginas que la leen).
- `npm run lint`: ESLint.
- `npm run format` y `npm run format:check`: Prettier, con el orden de clases de Tailwind.
- `npm run typecheck`: genera los tipos de rutas de Next y corre `tsc --noEmit`.
- `npm run db:generate` y `npm run db:migrate`: migraciones con drizzle-kit (requieren `DATABASE_URL`).
- `npm run storage:setup`: crea o actualiza los buckets de Supabase Storage.
- `npm test`: Vitest (`vitest run`), tests en `src/**/*.test.ts`.

`AGENTS.md` (generado por Next) indica leer `node_modules/next/dist/docs/` antes de escribir código de Next: esta versión (16) difiere de lo que se conoce de versiones anteriores.

## Forma de trabajar

- Explicá en pocas líneas el porqué de las decisiones de diseño y registralas en `docs/decisiones.md`.
- Antes de cambios grandes, proponé un plan corto y esperá confirmación.
- Usá las skills del proyecto: `nueva-funcionalidad`, `consulta-sql`, `cerrar-tarea`.
