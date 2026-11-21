import { useCallback } from "react";

// Agrega o saca un id de una lista separada por espacios (como aria-describedby).
// Devuelve null si la lista queda vacía, para poder borrar el atributo.
export function toggleId(list: string | null, id: string, on: boolean): string | null {
  const ids = (list ?? "").split(/\s+/).filter((x) => x && x !== id);
  if (on) ids.push(id);
  return ids.length ? ids.join(" ") : null;
}

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const isField = (el: EventTarget | null): el is Field =>
  el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement;

// Texto como lo lee un lector de pantalla: sin lo marcado con aria-hidden.
function spokenText(node: Element): string {
  const copy = node.cloneNode(true) as Element;
  copy.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
  return (copy.textContent ?? "").replace(/\s+/g, " ").trim();
}

// Lleva el estado visual de :user-invalid (que el navegador activa recién
// después de que la persona toca el campo o intenta enviar) a aria-invalid,
// para que los lectores de pantalla se enteren del error en el mismo momento.
// - Cada campo arranca en aria-invalid="false": Firefox y Safari anuncian como
//   inválido un campo obligatorio vacío desde que carga la página.
// - El mensaje de error (el id en data-error) se suma a aria-describedby solo
//   mientras se muestra: un texto referenciado se lee aunque esté oculto.
// - El error que aparece al salir de un campo se anuncia en el elemento con
//   data-field-announcer del formulario (aria-live="polite"), medio segundo
//   después, para no pisar el nombre del campo siguiente. Tras un envío fallido
//   no se anuncia: el navegador lleva el foco al primer campo inválido.
// Devuelve un ref para el <form>; funciona aunque el formulario se desmonte y
// se vuelva a montar.
export function useUserInvalidAria() {
  return useCallback((form: HTMLFormElement | null) => {
    if (!form) return;
    const announcer = form.querySelector<HTMLElement>("[data-field-announcer]");
    const flagged = new WeakSet<Field>();
    const announced = new WeakSet<Field>();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let announcedField: Field | null = null;

    const announce = (el: Field) => {
      const error = el.dataset.error && document.getElementById(el.dataset.error);
      if (!announcer || !error) return;
      const label = el.labels?.[0] ? `${spokenText(el.labels[0])}: ` : "";
      clearTimeout(timer);
      announcer.textContent = "";
      announcedField = el;
      timer = setTimeout(() => {
        announcer.textContent = label + spokenText(error);
      }, 500);
    };

    const sync = (el: Field, withAnnouncement = false) => {
      const errorId = el.dataset.error;
      const setDescribedBy = (on: boolean) => {
        if (!errorId) return;
        const next = toggleId(el.getAttribute("aria-describedby"), errorId, on);
        if (next) el.setAttribute("aria-describedby", next);
        else el.removeAttribute("aria-describedby");
      };
      if (el.matches(":user-invalid")) {
        if (withAnnouncement && !announced.has(el)) {
          announce(el);
          announced.add(el);
        }
        el.setAttribute("aria-invalid", "true");
        setDescribedBy(true);
        flagged.add(el);
      } else if (flagged.has(el) || el.getAttribute("aria-invalid") !== "true") {
        // Un aria-invalid="true" puesto por otro (por ejemplo, el servidor) no se toca.
        el.setAttribute("aria-invalid", "false");
        setDescribedBy(false);
        flagged.delete(el);
        announced.delete(el);
        if (announcedField === el && announcer) {
          clearTimeout(timer);
          announcer.textContent = "";
        }
      }
    };

    const fields = () => [...form.elements].filter(isField);
    fields().forEach((el) => sync(el));

    const onLeave = (e: Event) => isField(e.target) && sync(e.target, true);
    const onInput = (e: Event) => isField(e.target) && e.target.hasAttribute("aria-invalid") && sync(e.target);
    // "invalid" no burbujea: se escucha en captura. Lo dispara un envío fallido.
    const onInvalid = (e: Event) => {
      if (!isField(e.target)) return;
      announced.add(e.target);
      sync(e.target);
    };
    // reset limpia :user-invalid después del evento.
    const onReset = () => setTimeout(() => fields().forEach((el) => sync(el)));

    form.addEventListener("focusout", onLeave);
    form.addEventListener("change", onLeave);
    form.addEventListener("input", onInput);
    form.addEventListener("invalid", onInvalid, true);
    form.addEventListener("reset", onReset);
    return () => {
      clearTimeout(timer);
      form.removeEventListener("focusout", onLeave);
      form.removeEventListener("change", onLeave);
      form.removeEventListener("input", onInput);
      form.removeEventListener("invalid", onInvalid, true);
      form.removeEventListener("reset", onReset);
    };
  }, []);
}
