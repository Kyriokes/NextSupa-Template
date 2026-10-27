// Portada de ejemplo: reemplazala por la del proyecto.
export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-4 py-16">
      <h1 className="text-3xl font-semibold">Proyecto nuevo</h1>
      <p className="text-muted-foreground">
        El template ya trae ingreso con Google, panel de administración, páginas de texto editables y contacto. Editá{" "}
        <code>src/app/page.tsx</code> para empezar.
      </p>
    </main>
  );
}
