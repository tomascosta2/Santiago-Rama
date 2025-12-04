// src/app/api/track/qualified-lead/route.ts
import { pixelId } from '@/app/utils/constantes';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();

  console.log("Data", data);

  if (!data.email || !data.phone) {
    return NextResponse.json({ success: false, error: "Faltan email o phone" }, { status: 400 });
  }

  const hashEmail = await hashSHA256(data.email);
  const hashPhone = await hashSHA256(data.phone);

  // Enviamos los leads calificados mediante la API
  await fetch(
    `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${process.env.API_ACCESS_TOKEN}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          {
            event_id: data.eventId ?? `lead-${Date.now()}`,
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            user_data: {
              em: [hashEmail],
              ph: [hashPhone],
              fbp: data.fbp,
              fbc: data.fbc,
              client_user_agent: req.headers.get('user-agent'),
              client_ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
            },
          },
        ],
      }),
    }
  );

  // const result = await response.json();
  // console.log("RESPONSE FROM META:", result);

  return NextResponse.json({ success: true });
}

async function hashSHA256(value: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
