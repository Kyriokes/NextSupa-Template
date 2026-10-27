# NextSupa-Template

Base para arrancar un proyecto web con Next.js 16 y Supabase sin partir de cero: stack configurado, módulos por dominio, ingreso con Google, panel de administración y reglas para Claude Code.

## Qué trae

- **Ingreso con Google** (Supabase Auth): el primer ingreso crea la cuenta con el rol `user`; una cuenta sin roles queda suspendida.
- **Roles y permisos** (`src/modules/users/roles.ts`): `admin` y `user`, con permisos verificados en el servidor.
- **Perfil** en `/profile`: nombre y foto (bucket `avatars`).
- **Panel de administración** en `/admin`: usuarios y roles, mensajes de contacto, contenido de las páginas de texto y paleta de colores con control de contraste.
- **Páginas de texto** editables: `/faq`, `/about` y `/terms`. **Contacto** en `/contact`.
- **SEO básico**: metadatos, imagen para compartir, `sitemap.xml` y `robots.txt`.
- **Calidad**: TypeScript estricto, ESLint, Prettier, Vitest y CI en GitHub Actions.

| Pieza     | Versión            |
| --------- | ------------------ |
| Next.js   | 16.4.3, App Router |
| React     | 19.3               |
| Tailwind  | 4                  |
| shadcn/ui | `base-nova`        |
| Zod       | 4                  |
| Drizzle   | 0.45 + kit 0.31    |
| Supabase  | supabase-js 2, ssr |
| Zustand   | 5                  |
| Vitest    | 5                  |

## Crear un proyecto desde el template

### 1. Repositorio

En GitHub, **Use this template → Create a new repository**. Después:

```bash
git clone https://github.com/<usuario>/<proyecto>.git
cd <proyecto>
npm ci
```

Requisitos: Node.js 24 LTS (o 20.19+), una cuenta de Supabase y un proyecto en Google Cloud.

### 2. Supabase y variables de entorno

Creá un proyecto en [Supabase](https://supabase.com). Copiá `.env.example` a `.env.local` y completalo. `.env.local` nunca se sube al repositorio. Si falta una variable, el servidor no arranca y dice cuál.

| Variable                               | Dónde se obtiene                                                     | ¿Pública?             |
| -------------------------------------- | -------------------------------------------------------------------- | --------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Project Settings → API                                               | Sí                    |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Project Settings → API Keys (`sb_publishable_…`)                     | Sí                    |
| `SUPABASE_SECRET_KEY`                  | Project Settings → API Keys (`sb_secret_…`)                          | **No**, solo servidor |
| `DATABASE_URL`                         | Connect → Session pooler (puerto 5432), con la contraseña de la base | **No**, solo servidor |

### 3. Ingreso con Google

1. En **Google Cloud**, configurá la pantalla de consentimiento (permisos `openid`, `email` y `profile`) y creá un cliente OAuth de tipo _Aplicación web_:
   - Origen autorizado: `http://localhost:3000`
   - URI de redirección: `https://<tu-proyecto>.supabase.co/auth/v1/callback`
2. En **Supabase → Authentication → Sign In / Providers**, activá **Google** con el ID y el secreto del cliente, y desactivá Email.
3. En **Authentication → URL Configuration**: Site URL `http://localhost:3000` y Redirect URL `http://localhost:3000/**`.

Mientras la app de Google esté en modo prueba, solo pueden ingresar los usuarios de prueba cargados ahí.

### 4. Tablas y almacenamiento

```bash
npm run db:migrate
npm run storage:setup
```

El primero crea las tablas (`users`, `theme_palettes`, `site_pages`, `contact_messages`), todas con RLS activado y sin políticas: solo las lee el servidor. El segundo crea el bucket público `avatars` (hasta 1 MB, JPG, PNG o WebP).

### 5. Levantar el sitio y hacerte administrador

```bash
npm run dev
```

Abrí `http://localhost:3000` e ingresá con Google. Tu cuenta queda con el rol `user`; para hacerla administradora, en Supabase → SQL Editor:

```sql
update users set roles = array['user', 'admin'] where email = 'tu@email.com';
```

Desde ahí, los roles se asignan en `/admin/users`.

### 6. Hacerlo tuyo

- **Nombre y descripción:** `src/lib/metadata.ts` (encabezado, pie, título y la imagen para compartir) y `CLAUDE.md`.
- **Colores:** la paleta base está en `src/modules/appearance/palette.ts` y repetida en `src/app/globals.css` (un test verifica que coincidan). El admin puede cambiarla después en `/admin/settings/appearance`.
- **Ícono:** `src/app/icon.svg`.
- **Contacto:** email y WhatsApp en `src/modules/contact/messages.ts`.
- **Roles:** `ROLES` y `PERMISSIONS` en `src/modules/users/roles.ts`, y el check de `users.roles` en `src/modules/users/tables.ts` (después, `npm run db:generate`).
- **Reglas de negocio:** `docs/reglas-de-negocio.md`, que Claude Code lee antes de implementar.

### Sacar un módulo que no uses

| Módulo       | Qué borrar                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| `content`    | `src/modules/content`, `src/app/admin/content`, `src/app/{faq,about,terms}`, `src/components/content-page.tsx`  |
| `contact`    | `src/modules/contact`, `src/app/contact`, `src/app/admin/messages`, `src/components/contact-form.tsx`           |
| `appearance` | `src/modules/appearance`, `src/app/admin/settings`, `src/components/palette-style.tsx` y su uso en `layout.tsx` |

Después: sacá sus entradas del menú (`src/modules/users/navigation.ts`), sus permisos (`roles.ts`), sus enlaces del pie y del sitemap, y generá la migración con `npm run db:generate`. La pantalla de cuenta suspendida (`account-gate.tsx`) usa el formulario de contacto: si sacás `contact`, dejá ahí un email.

## Estructura

```text
.github/workflows/ci.yml   formato, lint, tipos, tests y build en cada PR
.claude/skills/            nueva-funcionalidad, consulta-sql, cerrar-tarea
docs/                      reglas de negocio, decisiones y plan
drizzle/                   migraciones generadas por drizzle-kit
scripts/setup-storage.mjs  buckets de Supabase Storage
src/
  app/                     rutas: auth, admin, contact, profile, páginas de texto
  components/              encabezado, pie, ingreso, menú, tema; ui/ = shadcn
  lib/                     db, env, supabase, metadatos, paginación, búsqueda
  modules/                 users, appearance, content, contact
  stores/                  estado de interfaz con Zustand
```

Cada módulo de `src/modules/` tiene `tables.ts` (Drizzle), `schema.ts` (Zod), las reglas puras con su `*.test.ts` al lado y `repository.ts` (acceso a datos). La interfaz solo presenta.

## Comandos

| Comando                 | Qué hace                                                    |
| ----------------------- | ----------------------------------------------------------- |
| `npm run dev`           | Servidor de desarrollo                                      |
| `npm run build`         | Build de producción (necesita la base)                      |
| `npm run start`         | Sirve el build de producción                                |
| `npm run lint`          | ESLint                                                      |
| `npm run format`        | Formatea con Prettier (`format:check` solo verifica)        |
| `npm run typecheck`     | Genera los tipos de rutas de Next y corre `tsc --noEmit`    |
| `npm test`              | Tests con Vitest                                            |
| `npm run db:generate`   | Genera una migración a partir de los cambios en `tables.ts` |
| `npm run db:migrate`    | Aplica las migraciones pendientes (lee `.env.local`)        |
| `npm run storage:setup` | Crea o actualiza los buckets de Supabase Storage            |

## Despliegue

En [Vercel](https://vercel.com), importá el repositorio: cada push a `main` despliega.

- **Variables de entorno:** las mismas de `.env.local`, pero con `DATABASE_URL` del **transaction pooler** de Supabase (puerto `6543`), pensado para servidores que levantan y bajan instancias.
- **Región:** `vercel.json` fija São Paulo (`gru1`). Cambiala por la más cercana a tu base de Supabase.
- **Migraciones:** se aplican desde la computadora con `npm run db:migrate`, antes de pushear el código que las usa.
- **Supabase Auth:** agregá la URL de Vercel en Authentication → URL Configuration (Site URL y Redirect URLs).

## CI

`.github/workflows/ci.yml` corre en cada PR y en cada push a `main`: formato, lint, tipos, tests y build. Como el build prerenderiza páginas que leen la base, el CI levanta un Postgres, le crea un `auth.users` mínimo (en Supabase ya existe) y aplica las migraciones antes de compilar. No necesita secretos.
