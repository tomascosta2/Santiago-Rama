import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const payload = {
    clientId: 5,
    clientName: 'Santiago Rama',
    lead: {
      nombre: body.name,
      correo: body.email,
      telefono: body.phone,
      campana: body.ad ?? '',
      splitTest: body.variant ?? '',
      ...(body.agendo !== undefined && { agendo: body.agendo }),
      ...(body.edad !== undefined && { edad: body.edad }),
      ...(body.ocupacion !== undefined && { ocupacion: body.ocupacion }),
      ...(body.objetivo !== undefined && { objetivo: body.objetivo }),
      ...(body.presupuesto !== undefined && { presupuesto: body.presupuesto }),
      ...(body.fbc !== undefined && { fbc: body.fbc }),
      ...(body.fbp !== undefined && { fbp: body.fbp }),
    },
  };
  console.log('[FFA] Enviando payload:', JSON.stringify(payload, null, 2));

  const response = await fetch('https://fit-funnels-analytics.vercel.app/api/webhook/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.FFA_API_KEY ?? '',
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  console.log('[FFA] Respuesta:', response.status, text);

  if (!response.ok) {
    console.error('[FFA] Error al enviar lead:', response.status, text);
    return NextResponse.json({ success: false, status: response.status, body: text }, { status: 502 });
  }

  return NextResponse.json({ success: true, body: text });
}
