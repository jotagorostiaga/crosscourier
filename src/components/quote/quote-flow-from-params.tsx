"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { QuoteFlow } from "@/components/quote/quote-flow";
import { QuoteProgress } from "@/components/quote/quote-progress";
import { prefillFromParams } from "@/lib/quote/machine";

function Inner({ entryPoint }: { entryPoint: string }) {
  const params = useSearchParams();
  const prefill = useMemo(
    () => prefillFromParams(new URLSearchParams(params.toString())),
    [params],
  );
  return <QuoteFlow prefill={prefill} entryPoint={entryPoint} />;
}

/**
 * Toma el contexto de campaña de la query string en el cliente. Deja la página
 * completamente estática, que es lo que permite servirla desde un CDN o desde
 * un export sin servidor.
 */
export function QuoteFlowFromParams({
  entryPoint = "cotizador",
}: {
  entryPoint?: string;
}) {
  return (
    <Suspense fallback={<QuoteProgress current={1} />}>
      <Inner entryPoint={entryPoint} />
    </Suspense>
  );
}
