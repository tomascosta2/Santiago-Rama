"use client";
import { useRef, useState, useEffect } from "react";
import CalificationFormDirect from "./components/CalificationFormDirect";
import Faqs from "./components/Faqs";
import {
  ALT_IMG_GENERIC,
  coachName,
  idVsl,
  METHOD_INCLUDES,
  MORE_CHANGES_IMG,
  srcVsl,
  TESTIMONIALS,
  TESTIMONIALS_VIDEO_PAGE,
} from "./utils/constantes";

export default function Home() {
  const [isFormOpened, setIsFormOpened] = useState(false);

  // 🔒 Nuevo: control de bloqueo por 5 minutos
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsUnlocked(true);
      },
      0 * 60 * 1000,
    ); // 5 minutos

    return () => clearTimeout(timer);
  }, []);

  const variantRef = useRef<"A" | "B">(Math.random() < 0.5 ? "A" : "B");
  const variant = variantRef.current;
  console.log(variant);

  const headlineText = "Elimina la Grasa Abdominal Bajando entre 10 y 20 kg, Recupera tu energía y Vitalidad con mi Método Sostenible en 12 semanas";

  return (
    <div className="relative overflow-clip pt-12">
      <img
        src="/images/Sombra.webp"
        alt="Sombra"
        className="w-[700px] absolute right-0 top-0 -z-50 hidden md:block"
      />
      <img
        src="/images/Sombra.webp"
        alt="Sombra"
        className="w-[700px] absolute left-0 top-0 scale-x-[-1] -z-50 hidden md:block"
      />
      <div className="bg-[var(--primary)]/80 size-[600px] rounded-full left-1/2 transform hidden md:block -translate-x-1/2 absolute -z-50  blur-[800px] -top-[400px]"></div>
      {isFormOpened && (
        <CalificationFormDirect
          variant={variant}
          onClose={() => setIsFormOpened(false)}
        />
      )}
      {/*       
        LOGO
      <img
        src="/images/logo.png"
        className="h-[25px] object-contain mx-auto"
        alt="Logo"
      /> */}
      <header className="bg-linear-0 from-[#0E0E0E] to-[#1C1B1B] max-w-[85%] w-[500px] rounded-full mx-auto border border-[var(--primary)]/30 z-50">
        <div className="cf-container">
          <h3 className="text-center uppercase text-[var(--text-primary)]/80 tracking-widest text-[12px] py-3 leading-[130%]">
            <span>Exclusivo para Padres con altas Responsabilidades Laborales</span>
          </h3>
        </div>
      </header>

      {/* Sección VSL (siempre visible) */}
      <section className="mt-6 pb-[60px] md:pb-[100px] border-b border-[var(--primary)] rounded-b-[45px] md:rounded-b-[60px] relative overflow-clip">
        <div className="cf-container">
          <h1 className="text-center text-[22px] md:text-[38px] font-bold uppercase leading-[140%] md:px-4">
            <span>
              {headlineText}
            </span>
          </h1>
          <p className="text-white/80 text-center mt-2">
            (Sin dietas extremas ni rutinas agobiantes y nunca solo, sino con un experto en pérdida de peso sostenible a tu lado)
          </p>
          <section className="relative">
            <div className="bg-[#131313] p-1 pt-0 border-1 border-[var(--primary)] overflow-clip rounded-[12px] md:rounded-[16px] border-[var(--primary)] mt-6 max-w-[750px] mx-auto">
              <div className="p-2 text-center text-[12px] uppercase text-[var(--text-primary)] tracking-widest bg-[#131313]">
                <span>Paso 1 de 2:</span> Mirá este video completo
              </div>
              <div className="bg-[#131313] aspect-video rounded-[8px] md:rounded-[12px] overflow-clip">
                <iframe
                  className="w-full aspect-video"
                  id={`${idVsl}`}
                  src={`${srcVsl}`}
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                ></iframe>
              </div>
            </div>
          </section>
          <p className="mt-6 text-center text-[14px] mx-auto max-w-[350px]">
            <strong className="uppercase tracking-widest">Paso 2 de 2:</strong>{" "}
            <span className="text-white/80">
              Agenda una Llamada para Asegurar tu Lugar y tu Cambio Fisico.
            </span>
          </p>

          {/* Botón bloqueado 5 minutos */}
          <div className="mt-6">
            <button
              className="cf-btn disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!isUnlocked}
              onClick={() => {
                if (!isUnlocked) return;
                setIsFormOpened(true);
              }}
            >
              ¡AGENDAR MI SESIÓN DE DIAGNÓSTICO!
            </button>
            <div className="h-[1px] relative overflow-clip max-w-[212px] mx-auto mt-4">
              <div className="bg-radial from-white to-black/0 size-[200px]"></div>
            </div>
            <p className="text-center mt-4 leading-[90%] text-white/40 mx-auto max-w-[350px] text-[14px] flex items-center justify-center gap-2">
              {isUnlocked
                ? "+50 alumnos activos"
                : "⚠️ El botón se habilitará luego de ver el video."}
              <img src="/images/Estrella.svg" alt="Estrellas" />
            </p>
          </div>
        </div>

        <div className="bg-[var(--primary)]/80 size-[600px] rounded-full left-[-400px] absolute -z-50  blur-[200px] -bottom-[300px]"></div>
        <div className="bg-[var(--primary)]/80 size-[600px] rounded-full right-[-400px] absolute -z-50  blur-[200px] -bottom-[300px]"></div>
      </section>

      {isUnlocked && (
        <>
          <section className="py-[100px] bg-[#0E0E0E] border-b border-[#282828] relative z-20">
            <div className="cf-container">
              <h2 className="text-[36px] md:text-[44px] font-bold text-white text-center max-w-[500px] leading-[130%] mx-auto">
                Ellos Ya Lo Lograron ¿Y Vos Qué Esperas?
              </h2>
              <div className="my-8 md:my-12 max-w-[900px] mx-auto space-y-6">
                {TESTIMONIALS_VIDEO_PAGE.map((testimonial) => {
                  return (
                    <div
                      className="shadow-[0_4px_90px_0_#1E3AFF70] rounded-[25px]"
                      key={testimonial.video}
                    >
                      <div>
                        <div
                          key={testimonial.video}
                          className="p-1 md:p-2 rounded-[24px] relative overflow-clip z-50 bg-[var(--background)]"
                        >
                          <div className="h-[2px] absolute top-0 overflow-clip w-full">
                            <div className="bg-white size-[80px] md:size-[300px] -top-[40px] md:top-[-150px] blur-[20px] md:blur-[100px] opacity-[100%] rounded-full absolute left-[calc(50%-40px)] md:left-[calc(50%-150px)] -z-50"></div>
                          </div>
                          <div className="bg-[var(--primary)] size-[900px] top-[-450px] blur-[150px] opacity-[70%] rounded-full absolute -right-[450px] -z-40"></div>
                          <div className="bg-[var(--primary)] size-[900px] bottom-[-450px] blur-[150px] opacity-[70%] rounded-full absolute -left-[450px] -z-40"></div>
                          <div className="relative bg-[#171717] z-50 p-4 md:p-[50px] rounded-[20px] flex md:flex-row flex-col gap-4 md:gap-8">
                            <div className="w-full max-w-[400px] aspect-video rounded-[10px] overflow-hidden">
                              <iframe
                                className="w-full h-full"
                                src={testimonial.video}
                                title={testimonial.titulo}
                                allow="autoplay; fullscreen"
                              ></iframe>
                            </div>
                            <div className="py-4 flex flex-col justify-between">
                              <div>
                                <h3 className="text-[24px] leading-[120%] font-bold">
                                  {testimonial.titulo}
                                </h3>
                                <p className="text-white/80 mt-4">
                                  {testimonial.story}
                                </p>
                              </div>
                              <div className="mt-4">
                                <p>{testimonial.nombre}</p>
                                <p className="text-white/80 mt-2 text-[14px]">
                                  {testimonial.dato}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                className="cf-btn"
                onClick={() => {
                  setIsFormOpened(true);
                }}
              >
                ¡AGENDAR MI SESIÓN DE DIAGNÓSTICO!
              </button>
              <div className="h-[1px] relative overflow-clip max-w-[212px] mx-auto mt-4">
                <div className="bg-radial from-white to-black/0 size-[200px]"></div>
              </div>
              <p className="text-center mt-4 text-white/40 mx-auto max-w-[350px] text-[14px]">
                Solo 6 cupos nuevos por mes
              </p>
            </div>
          </section>
        </>
      )}
      {/* 
      Seccion [M] no es para cualquiera
      <section className="py-[60px] md:py-[90px] relative overflow-clip">
        <div className="absolute w-full h-full -z-40 top-0 left-0 bg-[url('/images/fondo-cuadritos.webp')] filter saturate-0 bg-black bg-no-repeat bg-top"></div>
        <div className="">
          <div className="cf-container">
            <header className="bg-linear-0 from-[#0E0E0E] to-[#1C1B1B] max-w-[85%] w-fit px-8 rounded-full mx-auto border border-[var(--primary)]/30 z-50">
              <div className="cf-container">
                <h3 className="text-center uppercase text-[var(--text-primary)]/80 tracking-widest text-[12px] py-3 leading-[130%]">
                  <span>Antes de seguir, esto es clave</span>
                </h3>
              </div>
            </header>
            <h2 className="text-[24px] md:text-[40px] mt-6 font-bold text-white text-center uppercase max-w-[780px] leading-[130%] mx-auto">
              [M] no es para cualquiera. Pero si es para vos,{" "}
              <span className="text-[var(--primary)]">
                puede cambiarte la vida en 90 días...
              </span>
            </h2>
            <p className="text-white/80 text-[18px] text-center mx-auto max-w-[550px] mt-4">
              Este método fue diseñado especialmente para profesionales mayores
              de 35 años que buscan un cambio real y sostenible en su salud y
              apariencia física.
            </p>
            <div className="my-8 md:my-12 grid md:grid-cols-2 gap-6 md:gap-12 max-w-[900px] mx-auto">
              <div className="overflow-clip relative p-1 rounded-[20px] bg-linear-[-142deg] from-[#FFF]/5 via-[#B4B4B4]/50 to-[#FFF]/5">
                <div className="bg-linear-0 z-50 border border-[#252525] from-[#070707] to-[#161616] p-8 rounded-[18px] h-full">
                  <h3 className="text-white text-[24px] font-semibold tracking-[-1%]">
                    Para quién NO es [M]
                  </h3>
                  <ul className="mt-4 max-w-[600px] mx-auto space-y-4 md:pe-12 list-disc list-inside text-white/60 text-[18px] leading-[24px]">
                    <li className="flex items-start gap-4">
                      <img
                        src="/images/cross.webp"
                        className="mt-[8px] size-[22px]"
                        alt="Es para vos"
                      />
                      Queres cambiar de la noche a la mañana.
                    </li>
                    <li className="flex items-start gap-4">
                      <img
                        src="/images/cross.webp"
                        className="mt-[8px] size-[22px]"
                        alt="Es para vos"
                      />
                      No te dejas ayudar en el proceso.
                    </li>
                    <li className="flex items-start gap-4">
                      <img
                        src="/images/cross.webp"
                        className="mt-[8px] size-[22px]"
                        alt="Es para vos"
                      />
                      No queres cambiar tu situación actual.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="overflow-clip relative p-1 rounded-[20px] bg-linear-[-142deg] from-[#1E3AFF]/20 via-[#1E3AFF]/100 to-[#1E3AFF]/20">
                <div className="absolute w-full top-[5px] left-0 z-50">
                  <div className="h-[2px] relative overflow-clip w-full mx-auto">
                    <div className="bg-linear-90 from-[#1E3AFF]/0 via-white to-[#1E3AFF]/0 h-[200px] w-80 left-10 absolute -top-[100px]"></div>
                  </div>
                </div>
                <div
                  className="bg-linear-0 z-40 border relative 
	                border-[#1E3AFF]/30 
	                from-[#070707] to-[#161616] 
	                p-8 rounded-[18px]
	                shadow-[0_0_20px_rgba(30,58,255,0.15)]"
                >
                  <div className="size-[200px] bg-[var(--primary)]/20 blur-[100px] absolute z-10 -top-[100px] -left-[100px]"></div>
                  <h3 className="text-white text-[24px] font-semibold tracking-[-1%] relative z-20">
                    Para quién <span className="text-[var(--primary)]">SÍ</span>{" "}
                    es [M]
                  </h3>
                  <ul className="mt-4 max-w-[600px] mx-auto space-y-4 md:pe-12 list-disc list-inside text-white/60 text-[18px] leading-[24px] relative z-20">
                    <li className="flex items-start gap-4">
                      <img
                        src="/images/circle-check.svg"
                        className="mt-[8px] size-[22px]"
                        alt="Es para vos"
                      />
                      Tenes 30 años o más con una carrera profesional
                      demandante.
                    </li>
                    <li className="flex items-start gap-4">
                      <img
                        src="/images/circle-check.svg"
                        className="mt-[8px] size-[22px]"
                        alt="Es para vos"
                      />
                      Sentis estrés frecuentemente, desgano y baja energía.
                    </li>
                    <li className="flex items-start gap-4">
                      <img
                        src="/images/circle-check.svg"
                        className="mt-[8px] size-[22px]"
                        alt="Es para vos"
                      />
                      Poder dedicarle al método 3 horas a la semana.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <button
              className="cf-btn"
              onClick={() => {
                setIsFormOpened(true);
              }}
            >
              ¡AGENDAR MI SESIÓN DE DIAGNÓSTICO!
            </button>
            <div className="h-[1px] relative overflow-clip max-w-[212px] mx-auto mt-4">
              <div className="bg-radial from-white to-black/0 size-[200px]"></div>
            </div>
            <p className="text-center mt-4 text-white/40 mx-auto max-w-[350px] text-[14px]">
              Solo 6 cupos nuevos por mes
            </p>
          </div>
        </div>
      </section> */}
      {/* 
      Seccion que inluye el metodo
      <div className="bg-black">
        <section
          className="
              relative
              py-[60px]
              md:py-[90px]
              rounded-t-[45px]
              md:rounded-t-[60px]
              overflow-hidden
              border-t border-[var(--primary)]
            "
        >
          <div className="bg-[var(--primary)]/80 size-[900px] rounded-full left-[-400px] absolute  blur-[200px] -top-[600px]"></div>
          <div className="bg-[var(--primary)]/80 size-[900px] rounded-full right-[-400px] absolute  blur-[200px] -top-[600px]"></div>
          <div className="bg-black w-full h-[700px] rounded-[200px] z-10  blur-[150px] absolute left-0 top-[50px]"></div>
          <div className="cf-container z-50 relative">
            <div
              className="
                flex items-center justify-center
                mx-auto w-fit lg:w-[305px]
                h-[41px] px-5
                border border-[var(--primary)]/24
                rounded-full
                text-center
                bg-[linear-gradient(0deg,#1C1B1B_0%,#0E0E0E_100%)]
              "
            >
              <p className="text-[#FFF]/80 text-[11px] leading-[37px] tracking-[0.25em]">
                EL MÉTODO QUE ORDENA TODO
              </p>
            </div>
            <div className="mt-8">
              <h2 className="text-[36px] md:text-[40px] font-bold text-white text-center max-w-[900px] leading-[130%] mx-auto">
                ¿Que incluye el metodo [M]?
              </h2>
              <p className="text-white/80 text-center mt-4 max-w-[600px] text-[18px] mx-auto">
                FIT90 no es una rutina más: es una estructura simple y probada
                que te dice qué hacer, cuándo hacerlo y cómo mantener los
                resultados sin depender de la motivación.
              </p>
            </div>
            <div className="my-8 md:my-12 grid md:grid-cols-3 gap-[12px] max-w-[900px] mx-auto">
              {METHOD_INCLUDES.map((m, i) => (
                <div
                  key={i}
                  className="
                    relative
                    p-8 rounded-[24px]
                    text-center
                    bg-black
                    border-[2px] border-[var(--primary)]/34
                "
                >
                  <div className="-top-[2px] absolute z-50 h-[2px] w-[60%] left-[20%] bg-linear bg-linear-90 bg-center from-[var(--primary)]/0 via-[#1E3AFF]/70 to-[var(--primary)]/0"></div>

                  <div className="absolute w-full h-full overflow-clip top-0 left-0 rounded-[24px]">
                    <div className="size-[140px] blur-[80px] bg-[var(--primary)]/80 absolute rounded-full -top-[70px] left-[calc(50%-70px)]"></div>
                  </div>

                  <div
                    className="
                      z-50 relative
                      mx-auto mb-5
                      flex p-[25px] items-center justify-center
                      rounded-2xl
                      bg-gradient-to-b from-[#1E3AFF] to-[#000]
                      outline-1 outline-[var(--primary)]/60 outline-offset-[4px]  
                      w-fit
                      shadow-[0_4px_30px_0_rgba(30,58,255,0.45)]
                    "
                  >
                    <img src={m.img} alt={m.title} className="size-[42px]" />
                  </div>

                  <p className="text-white text-[18px] mt-8 font-semibold">
                    {m.title}
                  </p>
                </div>
              ))}
            </div>
            <button
              className="cf-btn"
              onClick={() => {
                setIsFormOpened(true);
              }}
            >
              ¡AGENDAR MI SESIÓN DE DIAGNÓSTICO!
            </button>
            <div className="h-[1px] relative overflow-clip max-w-[212px] mx-auto mt-4">
              <div className="bg-radial from-white to-black/0 size-[200px]"></div>
            </div>
            <p className="text-center mt-4 text-white/40 mx-auto max-w-[350px] text-[14px]">
              Solo 6 cupos nuevos por mes
            </p>
          </div>
        </section>
      </div> */}
      {/* 
      <section className="w-full  bg-[#000] relative pt-[80px] md:pt-[160px]">
        <div className="h-[2px] top-0 absolute overflow-clip w-full z-50 hidden md:block">
          <div className="size-[400px] blur-[200px] left-[calc(50%-200px)] -top-[200px] absolute bg-[var(--primary)]"></div>
        </div>
        <img
          src="/images/img_background_testimonials.webp"
          className="absolute md:top-0 top-[130px] w-full object-contain"
          alt="Fit Funnels"
        />
        <div className="cf-container relative">
          <div className="mx-auto w-full max-w-[1200px] text-center">
            <h2 className="text-[32px] md:text-[50px] max-w-[750px] mx-auto font-bold text-white leading-[130%]">
              Estos Resultados podes Obtener Si Agendas Hoy
            </h2>
            <p className="mt-4 text-white/80 text-[18px] max-w-[400px] mx-auto">
              Si ellos pudieron, vos también podés.
            </p>
            <div className="grid md:grid-cols-3 mt-[140px] md:mt-[192px] gap-4">
              {TESTIMONIALS.map((t, i) => (
                <div
                  className="
                    rounded-[14px]
                    w-full
                    h-[350px] flex flex-col
                    bg-linear-150 from-[var(--primary)]/20 via-[var(--primary)] to-[var(--primary)]/20
                    p-1
                    overflow-clip
                  "
                >
                  <p className="text-center py-2 tracking-wider text-[#f5f5f5]">
                    {t.weight}
                  </p>

                  <div className="relative flex-1 overflow-clip rounded-[10px]">
                    <div className="absolute inset-0 rounded-[10px] bg-gradient-to-t from-black/90 from-5% to-transparent to-65%" />

                    <img
                      className="w-full h-full object-cover rounded-[10px]"
                      src={t.img}
                      alt={`${ALT_IMG_GENERIC} cambio ${i + 1}`}
                    />
                  </div>
                </div>
              ))}
              <div
                className="
                  rounded-[14px]
                  w-full
                  bg-linear-150 from-[var(--primary)]/20 via-[var(--primary)] to-[var(--primary)]/20
                  p-1
                  overflow-clip
                  flex
                  flex-col
                  h-[350px]
                "
              >
                <p className="text-center py-2 tracking-wider text-[#f5f5f5]">
                  TU PRÓXIMO CAMBIO
                </p>
                <div className="relative flex-1 overflow-clip rounded-[10px]">
                  <div className="absolute inset-0 rounded-[10px] bg-gradient-to-t from-black/90 from-5% to-transparent to-65%" />

                  <img
                    className="w-full h-full object-cover rounded-[10px]"
                    src={`${MORE_CHANGES_IMG}`}
                    alt={`${ALT_IMG_GENERIC}`}
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 md:mt-12">
              <button
                className="cf-btn disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!isUnlocked}
                onClick={() => {
                  if (!isUnlocked) return;
                  setIsFormOpened(true);
                }}
              >
                ¡AGENDAR MI SESIÓN DE DIAGNÓSTICO!
              </button>
              <div className="h-[1px] relative overflow-clip max-w-[212px] mx-auto mt-4">
                <div className="bg-radial from-white to-black/0 size-[200px]"></div>
              </div>
              <p className="text-center my-4 text-white/40 mx-auto max-w-[350px] text-[14px] ">
                {isUnlocked
                  ? "Solo 6 cupos nuevos por mes"
                  : "⚠️ El botón se habilitará luego de ver el video."}
              </p>
            </div>
          </div>
        </div>
        {/* </div> 
      </section> */}

      {/* Seccion Faqs
      <section className="pt-[120px] pb-[80px]">
        <div className="cf-container">
          <Faqs />
          
          <div className="mt-8">
            <button
              className="cf-btn disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!isUnlocked}
              onClick={() => {
                if (!isUnlocked) return;
                setIsFormOpened(true);
              }}
            >
              ¡AGENDAR MI SESIÓN DE DIAGNÓSTICO!
            </button>
            <div className="h-[1px] relative overflow-clip max-w-[212px] mx-auto mt-4">
              <div className="bg-radial from-white to-black/0 size-[200px]"></div>
            </div>
            <p className="text-center mt-4 text-white/40 mx-auto max-w-[350px] text-[14px]">
              {isUnlocked
                ? "Solo 6 cupos nuevos por mes"
                : "⚠️ El botón se habilitará luego de ver el video."}
            </p>
          </div>
        </div>
      </section> 
      */}

      {/* <div className="bg-[var(--primary)] overflow-hidden w-full">
  <div className="relative flex w-full">
    
    <div className="flex w-max animate-marquee gap-10 px-6 py-4 text-white tracking-wider font-medium">
      <span>+50 CAMBIOS FÍSICOS LOGRADOS</span>
      <span>CUPOS LIMITADOS POR MES</span>
      <span>+50 CAMBIOS FÍSICOS LOGRADOS</span>
      <span>CUPOS LIMITADOS POR MES</span>
      <span>+50 CAMBIOS FÍSICOS LOGRADOS</span>
    </div>

  </div>
</div> */}

      <p className="pb-6 pt-8 text-[14px] text-center px-4 text-white/60">
        © {coachName} 2025. Todos los derechos reservados.
        <br />
        <span className="mt-2 block max-w-[500px] mx-auto text-[12px] text-white/40">
          Este sitio no forma parte ni está avalado por Meta™ (Facebook™ o Instagram™).
          Facebook™ e Instagram™ son marcas registradas de Meta Platforms, Inc.

          Al utilizar este sitio aceptás nuestra <a href="/pages/politicas-de-privacidad">Política de Privacidad</a> y <a href="/pages/terminos-y-condiciones">Términos y Condiciones</a>.
        </span>
      </p>
      {/* <div className="bg-[var(--primary)] size-[600px] md:size-[700px] blur-[100px] md:blur-[200px] opacity-[50%] rounded-full absolute left-[calc(50%-300px)] md:-left-[300px] -bottom-[300px] md:block hidden -z-50"></div>
      <div className="bg-[var(--primary)] size-[600px] md:size-[700px] blur-[100px] md:blur-[200px] opacity-[50%] rounded-full absolute right-[calc(50%-300px)] md:-right-[300px] -bottom-[300px] md:block hidden -z-50"></div> */}
    </div>
  );
}
