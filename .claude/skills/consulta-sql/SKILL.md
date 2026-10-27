---
name: consulta-sql
description: Usar al escribir o modificar consultas SQL directas, estadísticas o agregaciones sobre la base de datos.
---

# Consultas SQL directas

Reglas del proyecto (ver `CLAUDE.md`, sección Arquitectura):

- Siempre parametrizadas: con la plantilla `sql` de Drizzle (`sql\`... ${valor}\``), que manda los valores como parámetros. Nunca interpolar ni concatenar texto dentro del SQL, ni usar `sql.raw` con datos del usuario.
- Delegar a la base lo que ella hace mejor: filtros, `GROUP BY`, conteos, ordenamientos y límites. No traer filas para agregarlas en JavaScript.
- Pedir solo las columnas necesarias y limitar los resultados (listas paginadas con `pageWithin` de `src/lib/pagination.ts`).
- Búsquedas con `LIKE` o `ILIKE`: el texto del usuario pasa por `likePattern` (`src/lib/search.ts`), que escapa los comodines.
- Si una consulta se usa en estadísticas o listados grandes, revisar si necesita un índice y proponerlo en `tables.ts`.
- Dejar la consulta en el `repository.ts` del módulo de dominio que corresponde, con un nombre claro.

Ejemplo de forma (ajustar a los nombres reales de tablas y columnas):

```ts
const rows = await db.execute(sql`
  select date_trunc('day', created_at) as day, count(*) as messages
  from contact_messages
  where created_at > now() - interval '30 days'
  group by day
  order by day desc
`);
```
