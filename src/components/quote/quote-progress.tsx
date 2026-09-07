import { totalSteps } from "@/lib/quote/machine";

export function QuoteProgress({ current }: { current: number }) {
  // Incluye el paso en curso: en el paso 1 el usuario ya avanzó algo.
  const percent = Math.round((current / totalSteps) * 100);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-fg-faint uppercase">
          Paso <span className="tnum">{current}</span> de{" "}
          <span className="tnum">{totalSteps}</span>
        </span>
        <span className="tnum font-mono text-[0.6875rem] text-fg-faint">
          {percent}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={current}
        aria-label="Progreso de la cotización"
        className="h-1 w-full overflow-hidden rounded-full bg-line"
      >
        <div
          className="h-full rounded-full bg-orange transition-[width] duration-500 [transition-timing-function:var(--cc-ease)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
