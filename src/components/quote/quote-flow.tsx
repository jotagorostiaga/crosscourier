"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  MinusIcon,
  PlusIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { SelectField, TextField, TextareaField } from "@/components/ui/field";
import { OptionCards } from "@/components/ui/option-card";
import { QuoteProgress } from "@/components/quote/quote-progress";
import {
  cargoOptions,
  countries,
  countryLabel,
  frequencyOptions,
  needOptions,
  urgencyOptions,
  valueOptions,
} from "@/lib/quote/options";
import {
  firstIncompleteStep,
  initialState,
  steps,
  stepValue,
  totalSteps,
  validateStep,
} from "@/lib/quote/machine";
import type { Errors } from "@/lib/quote/machine";
import { quoteEvents, readTrackingContext } from "@/lib/quote/analytics";
import { leadStatus, recommendService, totalWeight } from "@/lib/quote/scoring";
import type { LeadPayload, QuotePrefill, QuoteState } from "@/lib/quote/types";
import { routes, site, whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

export function QuoteFlow({
  prefill,
  entryPoint = "cotizador",
}: {
  prefill?: QuotePrefill;
  entryPoint?: string;
}) {
  // El contexto llega por la URL, no por almacenamiento del navegador: la
  // landing y la campaña quedan en el link y el servidor renderiza el mismo
  // paso que ve el usuario.
  const seed = useMemo(() => initialState(prefill), [prefill]);
  const [state, setState] = useState<QuoteState>(seed);
  const [current, setCurrent] = useState(() => firstIncompleteStep(seed));
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();

  const step = steps[current - 1];

  const update = useCallback((patch: Partial<QuoteState>) => {
    setState((previous) => ({ ...previous, ...patch }));
    setErrors({});
  }, []);

  useEffect(() => {
    quoteEvents.start(entryPoint);
  }, [entryPoint]);

  const recommendation = useMemo(() => recommendService(state), [state]);

  function goNext() {
    const stepErrors = validateStep(step.id, state);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    quoteEvents.stepCompleted(step.index, step.id, stepValue(step.id, state));
    if (current < totalSteps) {
      setCurrent(current + 1);
      requestAnimationFrame(() => headingRef.current?.focus());
    }
  }

  function goBack() {
    if (current === 1) return;
    quoteEvents.stepBack(current);
    setErrors({});
    setCurrent(current - 1);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  async function submit() {
    const stepErrors = validateStep("contacto", state);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setStatus("sending");
    const payload: LeadPayload = {
      ...state,
      status: leadStatus(state),
      suggestedService: recommendation.title,
      tracking: readTrackingContext(),
      submittedAt: new Date().toISOString(),
    };

    // En la preview estática (GitHub Pages) no hay backend: el recorrido se
    // completa igual para poder mostrarlo, sin inventar un envío al CRM.
    if (process.env.NEXT_PUBLIC_DEMO === "true") {
      quoteEvents.stepCompleted(6, "contacto", stepValue("contacto", state));
      quoteEvents.submitted(payload.status, payload.suggestedService);
      setStatus("done");
      return;
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(String(response.status));
      quoteEvents.stepCompleted(6, "contacto", stepValue("contacto", state));
      quoteEvents.submitted(payload.status, payload.suggestedService);
      setStatus("done");
    } catch (error) {
      quoteEvents.failed(error instanceof Error ? error.message : "unknown");
      setStatus("error");
    }
  }

  if (status === "done") {
    return <QuoteSuccess state={state} recommendation={recommendation} />;
  }

  return (
    <div data-quote-flow className="flex flex-col gap-8">
      <QuoteProgress current={current} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step.id}
          initial={reduce ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="text-title outline-none"
            >
              {step.title}
            </h2>
            {step.help ? (
              <p className="max-w-[52ch] text-[0.9375rem] text-fg-muted">
                {step.help}
              </p>
            ) : null}
          </div>

          <StepFields
            state={state}
            errors={errors}
            update={update}
            stepId={step.id}
            recommendation={recommendation}
          />
        </motion.div>
      </AnimatePresence>

      {status === "error" ? (
        <p
          role="alert"
          className="rounded-ui border border-danger/40 bg-danger/5 px-4 py-3 text-[0.9375rem] text-danger"
        >
          No pudimos enviar la cotización. Probá de nuevo o escribinos por{" "}
          <a
            className="font-medium underline"
            href={whatsappHref("Hola, tuve un problema al enviar el formulario web.")}
            target="_blank"
            rel="noreferrer noopener"
          >
            WhatsApp
          </a>
          .
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
        <button
          type="button"
          onClick={goBack}
          disabled={current === 1}
          className={cn(
            "inline-flex items-center gap-2 text-[0.9375rem] font-medium text-fg-muted transition-colors hover:text-fg",
            current === 1 && "pointer-events-none opacity-0",
          )}
        >
          <ArrowLeftIcon weight="bold" className="size-4" aria-hidden />
          Volver
        </button>

        {current < totalSteps ? (
          <Button onClick={goNext} size="lg" withArrow>
            Continuar
          </Button>
        ) : (
          <Button onClick={submit} size="lg" disabled={status === "sending"}>
            {status === "sending" ? (
              <>
                <SpinnerGapIcon
                  className="size-4 animate-spin"
                  aria-hidden
                  weight="bold"
                />
                Enviando
              </>
            ) : (
              <>
                Recibir mi cotización
                <ArrowRightIcon weight="bold" className="size-4" aria-hidden />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function StepFields({
  stepId,
  state,
  errors,
  update,
  recommendation,
}: {
  stepId: (typeof steps)[number]["id"];
  state: QuoteState;
  errors: Errors;
  update: (patch: Partial<QuoteState>) => void;
  recommendation: ReturnType<typeof recommendService>;
}) {
  switch (stepId) {
    case "necesidad":
      return (
        <OptionCards
          name="need"
          legend="¿Qué necesitás hacer?"
          options={needOptions}
          value={state.need}
          onChange={(need) => update({ need })}
          error={errors.need}
        />
      );

    case "ruta":
      return (
        <div className="grid gap-6 sm:grid-cols-2">
          <fieldset className="flex flex-col gap-4">
            <legend className="font-mono text-[0.6875rem] tracking-[0.16em] text-fg-faint uppercase">
              Origen
            </legend>
            <SelectField
              label="País"
              placeholder="Elegí un país"
              options={countries}
              value={state.originCountry}
              onChange={(event) => update({ originCountry: event.target.value })}
              error={errors.originCountry}
            />
            <TextField
              label="Ciudad o código postal"
              placeholder="Shenzhen, Miami, Milán…"
              value={state.originCity}
              onChange={(event) => update({ originCity: event.target.value })}
            />
          </fieldset>
          <fieldset className="flex flex-col gap-4">
            <legend className="font-mono text-[0.6875rem] tracking-[0.16em] text-fg-faint uppercase">
              Destino
            </legend>
            <SelectField
              label="País"
              placeholder="Elegí un país"
              options={countries}
              value={state.destinationCountry}
              onChange={(event) =>
                update({ destinationCountry: event.target.value })
              }
              error={errors.destinationCountry}
            />
            <TextField
              label="Ciudad o código postal"
              placeholder="Buenos Aires, Córdoba…"
              value={state.destinationCity}
              onChange={(event) => update({ destinationCity: event.target.value })}
            />
          </fieldset>
        </div>
      );

    case "mercaderia":
      return (
        <div className="flex flex-col gap-6">
          <OptionCards
            name="cargoKind"
            legend="¿Qué querés enviar?"
            options={cargoOptions}
            value={state.cargoKind}
            onChange={(cargoKind) => update({ cargoKind })}
            columns={3}
            compact
            error={errors.cargoKind}
          />
          <TextareaField
            label="Contanos brevemente qué producto es"
            placeholder="Ej.: 20 repuestos electrónicos para una línea de envasado"
            help="Con la descripción podemos anticipar restricciones y documentación."
            value={state.cargoDescription}
            onChange={(event) => update({ cargoDescription: event.target.value })}
            error={errors.cargoDescription}
          />
        </div>
      );

    case "operacion":
      return (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <span className="text-[0.8125rem] font-medium">
                Cantidad de bultos
              </span>
              <div className="flex h-12 w-fit items-center gap-1 rounded-ui border border-line-strong bg-surface px-1.5">
                <Stepper
                  label="Quitar un bulto"
                  onClick={() =>
                    update({ packages: Math.max(1, state.packages - 1) })
                  }
                >
                  <MinusIcon weight="bold" className="size-4" aria-hidden />
                </Stepper>
                <span className="tnum w-12 text-center font-mono text-base">
                  {state.packages}
                </span>
                <Stepper
                  label="Agregar un bulto"
                  onClick={() => update({ packages: state.packages + 1 })}
                >
                  <PlusIcon weight="bold" className="size-4" aria-hidden />
                </Stepper>
              </div>
            </div>
            <TextField
              label="Peso aproximado por bulto (kg)"
              inputMode="decimal"
              placeholder="12"
              value={state.weightPerPackage}
              onChange={(event) =>
                update({ weightPerPackage: event.target.value })
              }
              error={errors.weightPerPackage}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[0.8125rem] font-medium">
              Medidas por bulto en cm (opcional)
            </span>
            <div className="grid grid-cols-3 gap-3">
              <TextField
                label="Largo"
                inputMode="numeric"
                placeholder="40"
                value={state.length}
                onChange={(event) => update({ length: event.target.value })}
              />
              <TextField
                label="Ancho"
                inputMode="numeric"
                placeholder="30"
                value={state.width}
                onChange={(event) => update({ width: event.target.value })}
              />
              <TextField
                label="Alto"
                inputMode="numeric"
                placeholder="25"
                value={state.height}
                onChange={(event) => update({ height: event.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[0.8125rem] font-medium">
              Valor aproximado de la mercadería
            </span>
            <OptionCards
              name="valueBracket"
              legend="Valor aproximado de la mercadería"
              options={valueOptions}
              value={state.valueBracket}
              onChange={(valueBracket) => update({ valueBracket })}
              columns={3}
              compact
              error={errors.valueBracket}
            />
          </div>

          {totalWeight(state) > 0 ? (
            <p className="tnum font-mono text-[0.8125rem] text-fg-muted">
              Peso total estimado: {totalWeight(state).toFixed(1)} kg
            </p>
          ) : null}
        </div>
      );

    case "intencion":
      return (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="text-[0.9375rem] font-medium">
              ¿Con qué frecuencia hacés estos envíos?
            </p>
            <OptionCards
              name="frequency"
              legend="Frecuencia de envíos"
              options={frequencyOptions}
              value={state.frequency}
              onChange={(frequency) => update({ frequency })}
              columns={2}
              compact
              error={errors.frequency}
            />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-[0.9375rem] font-medium">
              ¿Cuándo necesitás hacerlo?
            </p>
            <OptionCards
              name="urgency"
              legend="Plazo de la operación"
              options={urgencyOptions}
              value={state.urgency}
              onChange={(urgency) => update({ urgency })}
              columns={2}
              compact
              error={errors.urgency}
            />
          </div>
        </div>
      );

    case "contacto":
      return (
        <div className="flex flex-col gap-6">
          <div className="rounded-panel border border-line bg-surface p-5">
            <p className="font-display text-lg font-medium tracking-[-0.01em]">
              {recommendation.title}
            </p>
            <p className="mt-2 max-w-[58ch] text-[0.9375rem] leading-relaxed text-fg-muted">
              {recommendation.body}
            </p>
            <OperationSummary state={state} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Nombre y apellido"
              autoComplete="name"
              value={state.fullName}
              onChange={(event) => update({ fullName: event.target.value })}
              error={errors.fullName}
            />
            <TextField
              label="Empresa"
              autoComplete="organization"
              help="Si operás a título personal, podés dejarlo vacío."
              value={state.company}
              onChange={(event) => update({ company: event.target.value })}
            />
            <TextField
              label="Email corporativo"
              type="email"
              autoComplete="email"
              value={state.email}
              onChange={(event) => update({ email: event.target.value })}
              error={errors.email}
            />
            <TextField
              label="WhatsApp"
              type="tel"
              autoComplete="tel"
              placeholder="+54 9 11 …"
              value={state.whatsapp}
              onChange={(event) => update({ whatsapp: event.target.value })}
              error={errors.whatsapp}
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={state.acceptsContact}
              onChange={(event) =>
                update({ acceptsContact: event.target.checked })
              }
              className="mt-0.5 size-5 shrink-0 accent-[var(--cc-orange)]"
            />
            <span className="text-[0.8125rem] leading-relaxed text-fg-muted">
              Autorizo a {site.name} a contactarme por esta operación por email o
              WhatsApp.
              {errors.acceptsContact ? (
                <span className="mt-1 block font-medium text-danger">
                  {errors.acceptsContact}
                </span>
              ) : null}
            </span>
          </label>
        </div>
      );
  }
}

function Stepper({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-[6px] text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
    >
      {children}
    </button>
  );
}

function OperationSummary({ state }: { state: QuoteState }) {
  const rows = [
    state.need === "exportar" ? "Exportación" : state.need === "importar" ? "Importación" : null,
    state.originCountry
      ? `${countryLabel(state.originCountry)} a ${countryLabel(state.destinationCountry)}`
      : null,
    state.cargoDescription ? state.cargoDescription : null,
    totalWeight(state) > 0 ? `${totalWeight(state).toFixed(1)} kg totales` : null,
  ].filter(Boolean) as string[];

  if (rows.length === 0) return null;

  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {rows.map((row) => (
        <li
          key={row}
          className="rounded-ui bg-surface-2 px-2.5 py-1 text-[0.8125rem] text-fg-muted"
        >
          {row}
        </li>
      ))}
    </ul>
  );
}

function QuoteSuccess({
  state,
  recommendation,
}: {
  state: QuoteState;
  recommendation: ReturnType<typeof recommendService>;
}) {
  return (
    <div className="flex flex-col gap-6">
      <CheckCircleIcon
        weight="fill"
        className="size-10 text-[var(--cc-ok)]"
        aria-hidden
      />
      <div className="flex flex-col gap-3">
        <h2 className="text-title">
          Listo, {state.fullName.split(" ")[0]}. Ya tenemos tu operación.
        </h2>
        <p className="max-w-[56ch] text-lead text-fg-muted">
          Un especialista revisa los datos y te escribe a {state.email} con la
          alternativa que corresponde a tu envío.
        </p>
      </div>

      <div className="rounded-panel border border-line bg-surface p-5">
        <p className="font-display text-lg font-medium tracking-[-0.01em]">
          {recommendation.title}
        </p>
        <p className="mt-2 max-w-[58ch] text-[0.9375rem] leading-relaxed text-fg-muted">
          {recommendation.body}
        </p>
        <Link
          href={recommendation.href}
          className="mt-4 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-orange-text underline-offset-4 hover:underline"
        >
          {recommendation.linkLabel}
          <ArrowRightIcon weight="bold" className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          href={whatsappHref(
            `Hola, acabo de cargar una cotización en la web a nombre de ${state.fullName}.`,
          )}
          external
          variant="outline"
        >
          Hablar por WhatsApp ahora
        </Button>
        <Button href={routes.tracking} variant="quiet">
          Seguir un envío
        </Button>
      </div>
    </div>
  );
}
