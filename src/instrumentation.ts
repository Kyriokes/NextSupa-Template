// Next llama a register() una vez al arrancar cada servidor, antes de
// atender pedidos. Acá se validan las variables de entorno (src/lib/env.ts).
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { assertEnv } = await import("@/lib/env");
    assertEnv();
  }
}
