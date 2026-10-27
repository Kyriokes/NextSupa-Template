# Decisiones de diseño

Formato: código, fecha, decisión y porqué en una o dos líneas. Una decisión que se corrige no se borra: se marca como reemplazada y se agrega la nueva.

```
- DT-0xx (AAAA-MM-DD): qué se decidió. Porqué: la razón, y qué se descartó.
```

## Heredadas del template

Vienen del proyecto del que salió el template. Revisalas al arrancar y reemplazá las que no apliquen.

- DT-001: la lógica de negocio vive en `src/modules/<dominio>/`, nunca en componentes. Porqué: se testea sin la interfaz y queda en un solo lugar.
- DT-002: Drizzle ORM con el driver `postgres` para CRUD, y SQL directo parametrizado (plantilla `sql`) para agregaciones. Porqué: tipos sin pelear con el ORM cuando conviene escribir SQL.
- DT-003: Supabase para Postgres y para el ingreso con Google. Porqué: trae la autenticación resuelta y sigue siendo Postgres estándar.
- DT-004: las tablas tienen RLS activado y sin políticas: solo las lee el servidor, vía Drizzle. Porqué: la clave publishable del navegador no puede leer datos aunque alguien la use directo contra Supabase.
- DT-005: los permisos se verifican en cada página y Server Action con `hasPermission`, cerca de los datos. El layout de `/admin` no decide permisos. Porqué: una ruta nueva no queda abierta por olvidarse del layout.
- DT-006: Cache Components y Partial Prefetching activos (`next.config.ts`). Lo que lee la sesión va dentro de `<Suspense>` y llama a `connection()`. Porqué: el resto de la página sale estático.
- DT-007: la paleta de colores se guarda en la base y se cachea; si la base falla, se usa la paleta base por pocos minutos. Porqué: un error de la base no deja el sitio sin estilos.
- DT-008: variables de entorno validadas con Zod al arrancar el servidor (`src/lib/env.ts`, `src/instrumentation.ts`). Porqué: un valor faltante se ve enseguida, con un mensaje claro.
- DT-009: Prettier con `prettier-plugin-tailwindcss` y CI en GitHub Actions (formato, lint, tipos, tests y build). El CI levanta un Postgres con un `auth.users` mínimo, porque el build prerenderiza páginas que leen la base.
- DT-010: Next 16.4.3 en lugar de la 16.4.0 del proyecto original. Porqué: 16.0.0 a 16.4.0 tienen avisos críticos de ejecución remota de código (GHSA-2464-fhr4-w9xw, GHSA-673q-mjm6-r5xr).

- DT-011 (2026-10-27): las páginas de texto (`getPage`) devuelven título por defecto y cuerpo vacío si la base falla, cacheado por pocos minutos, como ya hacía la paleta. Porqué: una base caída no tiene que dar 500 ni frenar el build. Hay `src/app/error.tsx` para lo que igual falle.
- DT-012 (2026-10-27): la foto de perfil solo se pasa a `next/image` si viene de Google o del bucket propio (`isAllowedPhotoUrl`); si no, se muestra la inicial. Porqué: `next/image` lanza un error con un dominio fuera de `remotePatterns` y rompería la página entera.
- DT-013 (2026-10-27): `shadcn` pasa a `devDependencies` y Dependabot revisa npm y las acciones del CI cada semana. Porqué: la CLI metía 170 paquetes (Express, MCP) en el árbol de producción, y los avisos de seguridad de Next mostraron que hace falta enterarse pronto. Queda un aviso moderado en un `esbuild` viejo que arrastra `drizzle-kit`; solo corre en desarrollo.

## Del proyecto
