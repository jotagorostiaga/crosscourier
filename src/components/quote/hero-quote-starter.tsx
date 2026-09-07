"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { SelectField, TextField } from "@/components/ui/field";
import { countries } from "@/lib/quote/options";
import { quoteEvents } from "@/lib/quote/analytics";
import { cn } from "@/lib/utils";

type Direction = "importar" | "exportar";

/**
 * Arranque de cotización dentro del hero. No es un formulario de contacto:
 * captura las tres variables que definen factibilidad y entrega el resto del
 * flujo al precalificador, con el contexto ya cargado.
 */
export function HeroQuoteStarter() {
  const router = useRouter();
  const [direction, setDirection] = useState<Direction>("importar");
  const [origin, setOrigin] = useState("CN");
  const [destination, setDestination] = useState("AR");
  const [what, setWhat] = useState("");
  const [error, setError] = useState<string | null>(null);

  function swapDirection(next: Direction) {
    setDirection(next);
    if (next === "exportar") {
      setOrigin("AR");
      setDestination("US");
    } else {
      setOrigin("CN");
      setDestination("AR");
    }
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (origin === destination) {
      setError("El origen y el destino no pueden ser el mismo país.");
      return;
    }

    quoteEvents.start("hero");
    quoteEvents.stepCompleted(1, "necesidad", direction);

    // Todo el contexto viaja en la URL: el paso siguiente se puede compartir,
    // medir y precargar sin depender del navegador.
    const params = new URLSearchParams({ need: direction, origin, destination });
    if (what.trim()) params.set("what", what.trim());
    router.push(`/cotizar?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-panel border border-line bg-surface p-6 text-fg shadow-cc-lg md:p-7"
      aria-labelledby="hero-quote-title"
    >
      <h2
        id="hero-quote-title"
        className="font-display text-xl font-medium tracking-[-0.02em]"
      >
        Cotizá tu envío
      </h2>

      <div
        role="radiogroup"
        aria-label="¿Qué necesitás hacer?"
        className="mt-5 grid grid-cols-2 gap-1 rounded-ui bg-surface-2 p-1"
      >
        {(["importar", "exportar"] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={direction === option}
            onClick={() => swapDirection(option)}
            className={cn(
              "h-10 rounded-[7px] text-[0.9375rem] font-medium capitalize transition-colors duration-200",
              direction === option
                ? "bg-ink text-on-ink"
                : "text-fg-muted hover:text-fg",
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Origen"
          options={countries}
          value={origin}
          onChange={(event) => {
            setOrigin(event.target.value);
            setError(null);
          }}
        />
        <SelectField
          label="Destino"
          options={countries}
          value={destination}
          onChange={(event) => {
            setDestination(event.target.value);
            setError(null);
          }}
          error={error ?? undefined}
        />
      </div>

      <TextField
        className="mt-4"
        label="¿Qué necesitás enviar?"
        placeholder="Repuestos, muestras, tecnología, productos…"
        value={what}
        onChange={(event) => setWhat(event.target.value)}
      />

      <button
        type="submit"
        className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-orange text-base font-medium text-ink transition-colors duration-200 hover:bg-orange-600 active:translate-y-px"
      >
        Continuar cotización
        <ArrowRightIcon weight="bold" className="size-4" aria-hidden />
      </button>

      <p className="mt-4 text-[0.8125rem] leading-relaxed text-fg-muted">
        Con estos datos empezamos a identificar qué modalidad corresponde a tu
        envío. Los datos de contacto te los pedimos al final.
      </p>
    </form>
  );
}
