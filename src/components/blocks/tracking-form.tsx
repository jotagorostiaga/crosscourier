"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { TextField } from "@/components/ui/field";
import { ctaEvents } from "@/lib/quote/analytics";
import { whatsappHref } from "@/lib/site";

/**
 * Consulta de operación. Si hay un proveedor de tracking configurado
 * (NEXT_PUBLIC_TRACKING_URL) el número se abre ahí; si no, la consulta se
 * deriva al equipo por WhatsApp con el número ya cargado.
 */
export function TrackingForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const clean = code.trim();
    if (clean.length < 5) {
      setError("Ingresá el número de operación completo.");
      return;
    }

    ctaEvents.tracking("tracking_page");
    const provider = process.env.NEXT_PUBLIC_TRACKING_URL;

    const destination = provider
      ? `${provider}${encodeURIComponent(clean)}`
      : whatsappHref(`Hola, quiero consultar el estado de la operación ${clean}.`);

    window.open(destination, "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-panel border border-line bg-surface p-6 shadow-cc-md md:p-8"
    >
      <TextField
        label="Número de operación"
        placeholder="CC-000000"
        value={code}
        onChange={(event) => {
          setCode(event.target.value);
          setError(null);
        }}
        error={error ?? undefined}
        help="Es el número que te entregamos cuando confirmamos el envío."
      />
      <button
        type="submit"
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange font-medium text-ink transition-colors duration-200 hover:bg-orange-600 active:translate-y-px"
      >
        <MagnifyingGlassIcon weight="bold" className="size-4" aria-hidden />
        Consultar estado
      </button>
    </form>
  );
}
