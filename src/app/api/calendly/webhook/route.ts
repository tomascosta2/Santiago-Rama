import { NextResponse } from "next/server";
import crypto from "crypto";

// Webhook de Calendly: Calendly hace POST acá (server-to-server) cada vez que
// alguien agenda (invitee.created). Captura el 100% de las reservas sin depender
// del navegador del lead, y las reenvía a FFA. Protegido por firma.

const FFA_CLIENT_ID = 5;
const FFA_CLIENT_NAME = "Santiago Rama";

// Mismos mapeos que el tracking client-side, para que FFA reciba lo mismo.
const mapPresupuesto = (answer: string): string => {
  if (answer.includes("No estoy dispuesto")) return "No invertir";
  if (answer.includes("800") && answer.includes("1000")) return "$800-1000+";
  if (answer.includes("400") && answer.includes("800")) return "$400-800";
  if (answer.includes("200") || answer.includes("plan de pagos")) return "Plan pagos ~$200";
  return answer;
};
const mapOcupacion = (answer: string): string => {
  const idx = answer.indexOf(" (");
  return idx !== -1 ? answer.substring(0, idx).trim() : answer.trim();
};

function verifySignature(rawBody: string, header: string | null, key: string): boolean {
  if (!header) return false;
  // Formato: "t=1700000000,v1=<hmac hex>"
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=")));
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;
  const expected = crypto.createHmac("sha256", key).update(`${t}.${rawBody}`).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(v1), Buffer.from(expected));
  } catch {
    return false;
  }
}

async function sendLeadToFFA(lead: Record<string, unknown>) {
  const payload = { clientId: FFA_CLIENT_ID, clientName: FFA_CLIENT_NAME, lead };
  const res = await fetch("https://fit-funnels-analytics.vercel.app/api/webhook/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.FFA_API_KEY ?? "" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  console.log("[Calendly webhook → FFA]", res.status, text);
  return res.ok;
}

export async function POST(req: Request) {
  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  if (!signingKey) {
    console.error("[Calendly webhook] CALENDLY_WEBHOOK_SIGNING_KEY no configurado");
    return NextResponse.json({ error: "no configurado" }, { status: 500 });
  }

  const rawBody = await req.text();
  const sig = req.headers.get("calendly-webhook-signature");
  if (!verifySignature(rawBody, sig, signingKey)) {
    return NextResponse.json({ error: "firma inválida" }, { status: 401 });
  }

  let body: {
    event?: string;
    payload?: {
      email?: string;
      name?: string;
      text_reminder_number?: string;
      questions_and_answers?: { answer: string; question: string; position: number }[];
      scheduled_event?: { start_time?: string };
      tracking?: { utm_campaign?: string; utm_source?: string; utm_content?: string };
    };
  };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "body inválido" }, { status: 400 });
  }

  // Solo nos interesa la reserva creada.
  if (body.event !== "invitee.created") {
    return NextResponse.json({ ok: true, ignored: body.event });
  }

  const p = body.payload ?? {};
  const qa = p.questions_and_answers ?? [];
  const byPos = (pos: number) => qa.find((q) => q.position === pos)?.answer;

  const edad = byPos(0);
  const ocupacion = byPos(1) ? mapOcupacion(byPos(1)!) : undefined;
  const objetivo = byPos(2);
  const presupuesto = byPos(3) ? mapPresupuesto(byPos(3)!) : undefined;

  const ad = p.tracking?.utm_campaign || p.tracking?.utm_content || undefined;

  const lead: Record<string, unknown> = {
    nombre: p.name,
    correo: p.email,
    telefono: p.text_reminder_number,
    agendo: "Si",
    ...(edad !== undefined && { edad }),
    ...(ocupacion !== undefined && { ocupacion }),
    ...(objetivo !== undefined && { objetivo }),
    ...(presupuesto !== undefined && { presupuesto }),
    ...(ad !== undefined && { campana: ad }),
    ...(p.scheduled_event?.start_time && { cita: p.scheduled_event.start_time }),
  };

  await sendLeadToFFA(lead).catch((e) => console.error("[Calendly webhook] FFA error:", e));

  // Siempre 200: si no, Calendly reintenta.
  return NextResponse.json({ ok: true });
}
