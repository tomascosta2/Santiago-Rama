// src/app/api/track/qualified-shedule/route.ts
import { pixelId } from '@/app/utils/constantes';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();

  console.log("Data", data)

  // Alcanza con email O phone (el phone de Calendly muchas veces no viene)
  const email = (data.email ?? '').trim();
  const normalizedPhone = (data.phone ?? '').replace(/\D/g, '');
  if (!email && !normalizedPhone) {
    return NextResponse.json({ success: false, error: "Falta email o phone" }, { status: 400 });
  }

  const userData: Record<string, unknown> = {
    fbp: data.fbp,
    fbc: data.fbc,
    client_user_agent: req.headers.get('user-agent'),
    client_ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
  };
  if (email) userData.em = [await hashSHA256(email)];
  if (normalizedPhone) userData.ph = [await hashSHA256(normalizedPhone)];

  const response = await fetch(
    `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${process.env.API_ACCESS_TOKEN}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          {
            event_id: data.eventId ?? `schedule-${Date.now()}`,
            event_name: 'Schedule',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            user_data: userData,
          },
        ],
        //test_event_code: 'TEST57515'
      }),
    }
  );

  const result = await response.json();
  console.log("RESPONSE FROM META:", result);

  if (!response.ok || result.error) {
    return NextResponse.json({ success: false, error: result.error ?? result }, { status: 500 });
  }

  return NextResponse.json({ success: true, result });
}

async function hashSHA256(value: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
