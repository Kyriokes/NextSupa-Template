// Datos estructurados (schema.org) para los buscadores, como texto de un
// <script type="application/ld+json">. Se escapan <, > y &: así un
// texto cargado por el admin (por ejemplo "</script>") no puede cerrar la
// etiqueta e inyectar código. Sigue siendo el mismo JSON.
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(
    /[<>&\u2028\u2029]/g,
    (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
}
