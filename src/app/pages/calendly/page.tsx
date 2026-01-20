"use client";
import {
  ALT_IMG_GENERIC,
  CALENDLY_SPAN,
  CALENDLY_TITLE_PART1,
  CALENDLY_TITLE_PART2,
  calendlyBaseUrl,
  TESTIMONIALS,
  waNumber,
} from "@/app/utils/constantes";
import { useEffect, useMemo, useState } from "react";

export default function CalendlyFast() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [frameLoaded, setFrameLoaded] = useState(false);

  // Cargar prefill desde localStorage
  useEffect(() => {
    setName(localStorage.getItem("name") || "");
    setEmail(localStorage.getItem("email") || "");
    setPhone(localStorage.getItem("phone") || "");
  }, []);

  // Listener de eventos de Calendly (funciona igual con iframe)
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return;

      if (e.data?.event === "calendly.event_scheduled") {
        // https://hook.us2.make.com/2a7gkby3xtgo4annvy16nbu74laekhem

        fetch("https://hook.us2.make.com/2a7gkby3xtgo4annvy16nbu74laekhem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
          }),
        }).catch((err) => console.error("Tracking error:", err));

        const isQualified = localStorage.getItem("isQualified");
        const fbp = localStorage.getItem("_fbp");
        const fbc = localStorage.getItem("_fbc");

        // Envío del evento a tu API sólo si calificado
        if (isQualified === "true") {
          fetch("/api/track/qualified-shedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventName: "Schedule",
              email,
              phone,
              fbp,
              fbc,
              eventId: `schedule-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,
            }),
          });
        }

        // Redirección a Thank You
        setTimeout(() => {
          window.location.href = "/pages/thankyou";
        }, 600);
      }
    };

    window.addEventListener("message", handleCalendlyEvent);
    return () => window.removeEventListener("message", handleCalendlyEvent);
  }, [email, phone]);

  // Construir la URL de Calendly sin widget.js
  const calendlyUrl = useMemo(() => {
    const params = new URLSearchParams({
      hide_gdpr_banner: "1",
      embed_type: "InlineWidget",
      embed_domain:
        typeof window !== "undefined" ? window.location.hostname : "",
      name,
      email,
      // Opcionales (pueden ahorrar recursos visuales):
      // hide_landing_page_details: "1",
      // hide_event_type_details: "1",
      // text_color: "000000",
      // primary_color: "0051ff",
    });
    return `${calendlyBaseUrl}?${params.toString()}`;
  }, [name, email]);

  return (
    <main>
      {/* HERO + contenido tuyo igual que antes… */}
      <section className="pt-8 pb-[80px]">
        <div className="max-w-[1200px] mx-auto px-4">
          <h1 className="text-[24px] md:text-[32px] font-bold leading-[120%] max-w-[800px] mb-8 mx-auto text-center">
            <span className="text-[var(--primary)]">¡Último paso!</span> Elegí
            una fecha y hora que te queden cómodas y empezá hoy mismo!
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Columna de textos (igual que la tuya) */}
            <div className="md:-order-1 order-2">
              <h2 className="text-[20px] sm:text-[28px] font-bold leading-[120%] mb-6 sm:mb-8 text-white">
                {CALENDLY_TITLE_PART1}{" "}
                <span className="underline">{CALENDLY_SPAN}</span>.{" "}
                {CALENDLY_TITLE_PART2}
              </h2>
              <ul className="mb-8 text-[18px]">
                <li>
                  ✅ Cómo bajar de peso sin dietas extremas ni rutinas
                  imposibles
                </li>
                <li>
                  ✅ El método para hombres ocupados que garantiza resultados
                  visibles y duraderos
                </li>
                <li>
                  ✅ Cómo mantener los resultados a largo plazo sin morir en el
                  intento
                </li>
              </ul>
              <p className="text-[15px] sm:text-[18px] text-white">
                Te <strong>garantizamos</strong> que te vas con ideas claras de
                cómo bajar de peso de un experto certificado.
              </p>
              {/* <div className="mt-8 hidden md:block">
                <img
                  className="h-[40px]"
                  src="/images/reviews-nano.png"
                  alt={`${ALT_IMG_GENERIC}`}
                />
              </div> */}
            </div>

            {/* Calendly ultra rápido con iframe directo */}
            <div className="bg-white w-full min-h-[600px] rounded-lg overflow-clip relative">
              {/* Skeleton para percepción instantánea */}
              {!frameLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gray-100">
                  <div className="h-10 w-3/4 mx-auto mt-6 rounded bg-gray-200" />
                  <div className="h-6 w-1/2 mx-auto mt-4 rounded bg-gray-200" />
                  <div className="h-[560px] mt-6 mx-4 rounded-lg bg-gray-200" />
                </div>
              )}

              <iframe
                key={calendlyUrl} // fuerza refresh si cambian name/email
                title="Calendly Inline"
                src={calendlyUrl}
                loading="eager" // carga inmediata
                width="100%"
                height="800"
                className="w-full h-[800px] border-0"
                onLoad={() => setFrameLoaded(true)}
                // Nota: no uses sandbox aquí; Calendly requiere ejecutar scripts dentro del iframe
                referrerPolicy="no-referrer-when-downgrade"
                allow="clipboard-write; geolocation; microphone; camera"
              />
            </div>

            <p>
              En caso de no encontrar horarios disponibles escribime por
              WhatsApp al{" "}
              <a
                className="underline text-blue-500"
                href="https://wa.me/5492216720769"
                target="_blank"
              >
                +{waNumber}
              </a>
            </p>

            {/* <div className="mt-8 md:hidden block mx-auto">
              <img
                className="h-[40px]"
                src="/images/reviews-nano.png"
                alt={`${ALT_IMG_GENERIC}`}
              />
            </div> */}
          </div>
        </div>
      </section>

       {/* Social proof – sin cambios */}
      <section className="py-[40px] px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {TESTIMONIALS.map((t, i) => (
              <div className="rounded-[14px] w-full md:w-[32%] bg-[var(--primary)] p-1 overflow-hidden">
                <p className="text-center py-2 bg-[var(--primary)] text-[#111] font-semibold">
                  {t.weight}
                </p>
                <img
                  className="w-full aspect-square rounded-[10px] md:h-[290px] max-h-full object-cover"
                  src={`${t.img}`}
                  alt={`${ALT_IMG_GENERIC} cambio ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
