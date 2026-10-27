"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateNameAction, uploadPhotoAction, type ActionResult } from "./actions";

const inputClass =
  "h-8 w-full rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function Message({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  return result.ok ? (
    <p role="status" className="text-sm text-success">
      Listo.
    </p>
  ) : (
    <p role="alert" className="text-sm text-destructive">
      {result.message}
    </p>
  );
}

// Editar el nombre.
export function NameForm({ name }: { name: string }) {
  const [value, setValue] = useState(name);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => setResult(await updateNameAction({ name: value })));
      }}
    >
      <label htmlFor="name" className="text-sm font-medium">
        Nombre
      </label>
      <div className="flex gap-2">
        <input
          id="name"
          className={inputClass}
          value={value}
          maxLength={80}
          onChange={(e) => {
            setValue(e.target.value);
            setResult(null);
          }}
        />
        <Button type="submit" disabled={pending || value.trim() === name}>
          {pending ? "Guardando…" : "Guardar"}
        </Button>
      </div>
      <Message result={result} />
    </form>
  );
}

// Cambiar la foto de perfil.
export function PhotoForm() {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      className="flex flex-col gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        const formEl = e.currentTarget;
        const data = new FormData(formEl);
        const file = data.get("photo");
        if (file instanceof File && file.size > 1024 * 1024) {
          setResult({ ok: false, message: "La imagen puede pesar hasta 1 MB." });
          return;
        }
        start(async () => {
          const r = await uploadPhotoAction(data);
          setResult(r);
          if (r.ok) formEl.reset();
        });
      }}
    >
      <label className="text-sm font-medium" htmlFor="photo">
        Foto de perfil (JPG, PNG o WebP, hasta 1 MB)
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          id="photo"
          name="photo"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp"
          className="text-sm file:mr-2 file:rounded-lg file:border file:bg-background file:px-2 file:py-1 file:text-sm"
          onChange={() => setResult(null)}
        />
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Subiendo…" : "Cambiar foto"}
        </Button>
      </div>
      <Message result={result} />
    </form>
  );
}
