"use client";

import {
  ALT_IMG_GENERIC,
  calendlyBaseUrl,
  CALL_SHEDULED,
  waNumber,
} from "@/app/utils/constantes";
import { useEffect, useMemo, useRef, useState } from "react";

const getCookieValue = (cookieName: string) => {
  if (typeof document === "undefined") return "";
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie || "");
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return "";
};

const ensureFbcFromFbclid = () => {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get("fbclid");
  if (!fbclid) return;

  const existing = getCookieValue("_fbc");
  if (existing) return;

  const fbc = `fb.1.${Date.now()}.${fbclid}`;

  const isLocalhost =
    window.location.hostname.includes("localhost") ||
    window.location.hostname.includes("127.0.0.1");

  const cookie = isLocalhost
    ? `_fbc=${fbc}; path=/; SameSite=Lax`
    : `_fbc=${fbc}; path=/; SameSite=None; Secure`;

  document.cookie = cookie;

  try {
    localStorage.setItem("_fbc", fbc);
  } catch {}
};

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

export default function CalendlyFast() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [frameLoaded, setFrameLoaded] = useState(false);

  const emailRef = useRef("");
  const phoneRef = useRef("");
  const adRef = useRef("");

  useEffect(() => {
    ensureFbcFromFbclid();

    const n = localStorage.getItem("name") || "";
    const e = localStorage.getItem("email") || "";
    const p = localStorage.getItem("phone") || "";

    // Anuncio: leer param "app" de la URL, fallback a localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const ad = urlParams.get("ad") || localStorage.getItem("ad") || "";

    setName(n);
    setEmail(e);
    setPhone(p);

    emailRef.current = e;
    phoneRef.current = p;
    adRef.current = ad;
  }, []);

  useEffect(() => {
    emailRef.current = email;
  }, [email]);

  useEffect(() => {
    phoneRef.current = phone;
  }, [phone]);

  // Listener de eventos de Calendly
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      const origin = (e.origin || "").toLowerCase();
      if (!origin.endsWith("calendly.com")) return;

      if (e.data?.event === "calendly.event_scheduled") {
        const currentEmail = emailRef.current;
        const currentPhone = phoneRef.current;
        const currentAd = adRef.current;
        const isQualified = localStorage.getItem("isQualified");

        const fbpCookie = getCookieValue("_fbp");
        const fbcCookie = getCookieValue("_fbc");
        const fbp = fbpCookie || localStorage.getItem("_fbp") || null;
        const fbc = fbcCookie || localStorage.getItem("_fbc") || null;

        try {
          if (fbp) localStorage.setItem("_fbp", fbp);
          if (fbc) localStorage.setItem("_fbc", fbc);
        } catch {}

        const eventId = `schedule-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const inviteeUri = e.data.payload?.invitee?.uri;
        const eventUri = e.data.payload?.event?.uri;

        const sendAll = (
          questions_and_answers: { answer: string; position: number; question: string }[] = [],
          startTime?: string
        ) => {
          const byPos = (pos: number) => questions_and_answers.find((q) => q.position === pos)?.answer;

          const edad = byPos(0);
          const ocupacion = byPos(1) ? mapOcupacion(byPos(1)!) : undefined;
          const objetivo = byPos(2);
          const presupuesto = byPos(3) ? mapPresupuesto(byPos(3)!) : undefined;

          // FFA Analytics
          fetch("/api/analytics/lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: currentEmail,
              phone: currentPhone,
              fbp,
              fbc,
              ad: currentAd || undefined,
              agendo: "Si",
              edad,
              ocupacion,
              objetivo,
              presupuesto,
              ...(startTime && { scheduledAt: startTime }),
            }),
          })
            .then((r) => r.json())
            .then((res) => console.log("[FFA] response:", res))
            .catch((err) => console.error("FFA error:", err));

          // n8n
          fetch(CALL_SHEDULED, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: currentEmail,
              phone: currentPhone,
              fbp,
              fbc,
              isQualified,
              questions_and_answers,
            }),
          }).catch((err) => console.error("CALL_SHEDULED error:", err));

          // Meta — solo si calificado
          if (isQualified === "true") {
            if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
              (window as any).fbq("track", "Schedule", {}, { eventID: eventId });
            }

            fetch("/api/track/qualified-shedule", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                eventName: "Schedule",
                email: currentEmail,
                phone: currentPhone,
                fbp,
                fbc,
                eventId,
              }),
            }).catch((err) => console.error("Qualified schedule error:", err));
          }

          console.log("[Calendly] enviado →", { email: currentEmail, isQualified, edad, ocupacion, presupuesto, objetivo, startTime, ad: currentAd });

          setTimeout(() => {
            window.location.href = "/pages/thankyou";
          }, 600);
        };

        if (inviteeUri) {
          fetch("/api/calendly/invitee", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inviteeUri, eventUri }),
          })
            .then((r) => r.json())
            .then((data) => {
              const questions = data?.invitee?.resource?.questions_and_answers ?? [];
              const startTime = data?.event?.resource?.start_time ?? undefined;
              sendAll(questions, startTime);
            })
            .catch((err) => {
              console.error("[Calendly invitee] error:", err);
              sendAll();
            });
        } else {
          sendAll();
        }
      }
    };

    window.addEventListener("message", handleCalendlyEvent);
    return () => window.removeEventListener("message", handleCalendlyEvent);
  }, []);

  const calendlyUrl = useMemo(() => {
    const params = new URLSearchParams({
      primary_color: "0050c6",
      hide_gdpr_banner: "1",
      embed_type: "InlineWidget",
      embed_domain: typeof window !== "undefined" ? window.location.hostname : "",
      name,
      email,
    });

    return `${calendlyBaseUrl}?${params.toString()}`;
  }, [name, email]);

  return (
    <main>
      <section className="pt-8 pb-[80px]">
        <div className="max-w-[1200px] mx-auto px-4">
          <h1 className="text-[24px] md:text-[32px] font-bold leading-[120%] max-w-[800px] mb-8 mx-auto text-center">
            <span className="text-[var(--primary)]">¡Último paso!</span> Elegí
            una fecha y hora que te queden cómodas y empezá hoy mismo!
          </h1>

          <div className="flex items-center gap-8">
            <div className="bg-white w-full min-h-[600px] rounded-lg overflow-clip relative">
              {!frameLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gray-100">
                  <div className="h-10 w-3/4 mx-auto mt-6 rounded bg-gray-200" />
                  <div className="h-6 w-1/2 mx-auto mt-4 rounded bg-gray-200" />
                  <div className="h-[560px] mt-6 mx-4 rounded-lg bg-gray-200" />
                </div>
              )}

              <iframe
                key={calendlyUrl}
                title="Calendly Inline"
                src={calendlyUrl}
                loading="eager"
                width="100%"
                height="800"
                className="w-full h-[800px] border-0"
                onLoad={() => setFrameLoaded(true)}
                referrerPolicy="no-referrer-when-downgrade"
                allow="clipboard-write; geolocation; microphone; camera"
              />
            </div>

            <span className="sr-only">{ALT_IMG_GENERIC}</span>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            ¿No encontrás un horario disponible?{" "}
            <a
              href={`https://wa.me/${waNumber.replace(/\D/g, "")}?text=Hola%2C%20quiero%20agendar%20una%20consulta%20pero%20no%20encuentro%20horario%20disponible`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] underline font-medium"
            >
              Escribinos por WhatsApp
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
