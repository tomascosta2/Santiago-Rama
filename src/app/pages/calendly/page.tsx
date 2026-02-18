"use client";

import {
  ALT_IMG_GENERIC,
  calendlyBaseUrl,
  CALL_SHEDULED,
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

  // si ya existe _fbc, no lo pisamos
  const existing = getCookieValue("_fbc");
  if (existing) return;

  const fbc = `fb.1.${Date.now()}.${fbclid}`;

  // En localhost, Secure puede hacer que no se setee en http
  const isLocalhost =
    window.location.hostname.includes("localhost") ||
    window.location.hostname.includes("127.0.0.1");

  const cookie = isLocalhost
    ? `_fbc=${fbc}; path=/; SameSite=Lax`
    : `_fbc=${fbc}; path=/; SameSite=None; Secure`;

  document.cookie = cookie;

  // también lo guardamos por si querés leerlo desde localStorage
  try {
    localStorage.setItem("_fbc", fbc);
  } catch {}
};

export default function CalendlyFast() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [frameLoaded, setFrameLoaded] = useState(false);

  // refs para evitar valores viejos dentro del listener
  const emailRef = useRef("");
  const phoneRef = useRef("");

  useEffect(() => {
    // Intentar garantizar _fbc si viene fbclid (útil para test)
    ensureFbcFromFbclid();

    const n = localStorage.getItem("name") || "";
    const e = localStorage.getItem("email") || "";
    const p = localStorage.getItem("phone") || "";

    setName(n);
    setEmail(e);
    setPhone(p);

    emailRef.current = e;
    phoneRef.current = p;
  }, []);

  // mantener refs actualizadas
  useEffect(() => {
    emailRef.current = email;
  }, [email]);

  useEffect(() => {
    phoneRef.current = phone;
  }, [phone]);

  // Listener de eventos de Calendly
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      // Calendly puede emitir desde calendly.com y desde subdominios
      const origin = (e.origin || "").toLowerCase();
      if (!origin.endsWith("calendly.com")) return;

      if (e.data?.event === "calendly.event_scheduled") {
        const currentEmail = emailRef.current;
        const currentPhone = phoneRef.current;

        // Track interno (tu webhook/endpoint)
        fetch(CALL_SHEDULED, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentEmail }),
        }).catch((err) => console.error("Tracking error:", err));

        const isQualified = localStorage.getItem("isQualified");

        // ✅ Leer fbp/fbc desde cookies (lo correcto)
        const fbpCookie = getCookieValue("_fbp");
        const fbcCookie = getCookieValue("_fbc");

        // fallback por si querés testear con localStorage
        const fbp = fbpCookie || localStorage.getItem("_fbp") || null;
        const fbc = fbcCookie || localStorage.getItem("_fbc") || null;

        // guardar para debugging / consistencia
        try {
          if (fbp) localStorage.setItem("_fbp", fbp);
          if (fbc) localStorage.setItem("_fbc", fbc);
        } catch {}

        // Debug local (sacalo cuando termines)
        console.log("[Calendly scheduled] email:", currentEmail);
        console.log("[Calendly scheduled] fbp:", fbp);
        console.log("[Calendly scheduled] fbc:", fbc);

        // Envío del evento a tu API sólo si calificado
        if (isQualified === "true") {
          const eventId = `schedule-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

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

        // Redirección a Thank You
        setTimeout(() => {
          window.location.href = "/pages/thankyou";
        }, 600);
      }
    };

    window.addEventListener("message", handleCalendlyEvent);
    return () => window.removeEventListener("message", handleCalendlyEvent);
  }, []);

  const calendlyUrl = useMemo(() => {
    const params = new URLSearchParams({
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

            {/* Si querés volver a mostrar imagen/alt, dejé la constante importada */}
            <span className="sr-only">{ALT_IMG_GENERIC}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
