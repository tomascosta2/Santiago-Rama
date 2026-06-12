"use client";

import CalendlyEmbed from "@/app/components/CalendlyEmbed";

export default function CalendlyFast() {
  return (
    <main>
      <section className="pt-8 pb-[80px]">
        <div className="max-w-[1200px] mx-auto px-4">
          <h1 className="text-[24px] md:text-[32px] font-bold leading-[120%] max-w-[800px] mb-8 mx-auto text-center">
            <span className="text-[var(--primary)]">¡Último paso!</span> Elegí
            una fecha y hora que te queden cómodas y empezá hoy mismo!
          </h1>
          <CalendlyEmbed />
        </div>
      </section>
    </main>
  );
}
