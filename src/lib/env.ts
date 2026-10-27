import { z } from "zod";

// Variables de entorno que el sitio necesita (ver .env.example). Se validan
// una vez al arrancar el servidor (src/instrumentation.ts): si falta alguna,
// el error lo dice en vez de aparecer más tarde como "Failed query" o una
// sesión que no anda. El código sigue leyendo process.env directo: las
// NEXT_PUBLIC_ tienen que escribirse literales para que Next las incluya en
// el navegador.
const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url({ protocol: /^https?$/ }),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SECRET_KEY: z.string().min(1),
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
});

export type Env = z.infer<typeof EnvSchema>;

// Lista de problemas, una línea por variable; vacía si está todo bien. Un
// valor vacío ("VAR=" en .env.local) cuenta como faltante.
export function envProblems(source: Readonly<Record<string, string | undefined>>): string[] {
  const values = Object.fromEntries(Object.keys(EnvSchema.shape).map((key) => [key, source[key]?.trim() || undefined]));
  const parsed = EnvSchema.safeParse(values);
  if (parsed.success) return [];
  return parsed.error.issues.map((issue) => {
    const key = String(issue.path[0]);
    return values[key] === undefined ? `${key}: falta` : `${key}: valor inválido`;
  });
}

// Corta el arranque con un mensaje que dice qué completar.
export function assertEnv(source: Readonly<Record<string, string | undefined>> = process.env): void {
  const problems = envProblems(source);
  if (problems.length === 0) return;
  throw new Error(
    `Revisá las variables de entorno (.env.local en local, Settings > Environment Variables en Vercel):\n` +
      problems.map((p) => `  - ${p}`).join("\n"),
  );
}
