import type { LeadStatus, TrackingContext } from "@/lib/quote/types";

type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

/** Todos los eventos del sitio pasan por acá. Un solo punto de contrato con GTM. */
export function pushEvent(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });
}

export const quoteEvents = {
  start(entryPoint: string) {
    pushEvent("quote_start", { entry_point: entryPoint });
  },
  stepCompleted(step: number, stepName: string, value: string) {
    pushEvent("quote_step_completed", {
      step_number: step,
      step_name: stepName,
      step_value: value,
    });
  },
  stepBack(step: number) {
    pushEvent("quote_step_back", { step_number: step });
  },
  submitted(status: LeadStatus, suggestedService: string) {
    pushEvent("quote_submitted", {
      lead_status: status,
      suggested_service: suggestedService,
    });
  },
  failed(reason: string) {
    pushEvent("quote_failed", { reason });
  },
};

export const ctaEvents = {
  whatsapp(location: string) {
    pushEvent("cta_whatsapp", { cta_location: location });
  },
  tracking(location: string) {
    pushEvent("cta_tracking", { cta_location: location });
  },
  service(serviceName: string, location: string) {
    pushEvent("cta_service", { service_name: serviceName, cta_location: location });
  },
};

const EMPTY_TRACKING: TrackingContext = {
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: "",
  gclid: "",
  landingPath: "",
  referrer: "",
};

const STORAGE_KEY = "cc_tracking_context";

/** Captura UTMs y gclid en la primera visita y los conserva durante la sesión. */
export function readTrackingContext(): TrackingContext {
  if (typeof window === "undefined") return EMPTY_TRACKING;

  const params = new URLSearchParams(window.location.search);
  const fromUrl: TrackingContext = {
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    utmTerm: params.get("utm_term") ?? "",
    utmContent: params.get("utm_content") ?? "",
    gclid: params.get("gclid") ?? "",
    landingPath: window.location.pathname,
    referrer: document.referrer,
  };

  const hasUrlContext =
    fromUrl.utmSource || fromUrl.utmCampaign || fromUrl.gclid;

  try {
    if (hasUrlContext) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored) return { ...EMPTY_TRACKING, ...JSON.parse(stored) };
  } catch {
    // sessionStorage puede estar bloqueado. La captura es best effort.
  }

  return fromUrl;
}
