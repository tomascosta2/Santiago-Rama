import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { inviteeUri, eventUri } = await req.json();

  if (!inviteeUri) {
    return NextResponse.json({ error: "inviteeUri requerido" }, { status: 400 });
  }

  const headers = {
    Authorization: `Bearer ${process.env.CALENDLY_TOKEN}`,
    "Content-Type": "application/json",
  };

  const [inviteeRes, eventRes] = await Promise.all([
    fetch(inviteeUri, { headers }),
    eventUri ? fetch(eventUri, { headers }) : Promise.resolve(null),
  ]);

  if (!inviteeRes.ok) {
    return NextResponse.json({ error: "Error al llamar a Calendly API", status: inviteeRes.status }, { status: 500 });
  }

  const invitee = await inviteeRes.json();
  const event = eventRes?.ok ? await eventRes.json() : null;

  return NextResponse.json({ invitee, event });
}
