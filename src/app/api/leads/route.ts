import { NextResponse } from "next/server";
import type { LeadPayload } from "@/lib/quote/types";

export const runtime = "nodejs";

/**
 * Punto de entrada de leads.
 *
 * Hoy valida el payload y lo reenvía al webhook del CRM si está configurado
 * (CRM_WEBHOOK_URL). Cuando se defina el CRM definitivo, este archivo es el
 * único lugar donde hay que tocar: el front ya envía la operación completa,
 * la clasificación HOT / COLD / ONE SHOT / ASESORIA y el contexto de campaña.
 */
export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const missing = (["fullName", "email", "whatsapp"] as const).filter(
    (field) => !payload?.[field],
  );

  if (missing.length > 0) {
    return NextResponse.json(
      { error: "missing_fields", fields: missing },
      { status: 422 },
    );
  }

  const webhook = process.env.CRM_WEBHOOK_URL;

  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.CRM_WEBHOOK_TOKEN
            ? { Authorization: `Bearer ${process.env.CRM_WEBHOOK_TOKEN}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        console.error("[leads] webhook respondió", response.status);
        return NextResponse.json({ error: "crm_unavailable" }, { status: 502 });
      }
    } catch (error) {
      console.error("[leads] webhook falló", error);
      return NextResponse.json({ error: "crm_unavailable" }, { status: 502 });
    }
  } else {
    console.info("[leads] recibido", {
      status: payload.status,
      need: payload.need,
      route: `${payload.originCountry}>${payload.destinationCountry}`,
      campaign: payload.tracking?.utmCampaign,
    });
  }

  return NextResponse.json({ ok: true, status: payload.status });
}
