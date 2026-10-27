// Texto escrito por el usuario para buscar con LIKE o ILIKE ("contiene"). Se
// escapan %, _ y la barra invertida, que en LIKE son comodines o el escape:
// así "50%" busca "50%" y no "50 seguido de cualquier cosa".
export function likePattern(text: string): string {
  return `%${text.trim().replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}
