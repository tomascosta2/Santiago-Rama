'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FIRST_STEP_FORM,
  FIRST_STEP_FORM_TEST,
} from '../utils/constantes';

type Props = {
  variant: string;
  onClose: () => void;
};

type FormValues = {
  name: string;
  email: string;
  codigoPais: string;
  telefono: string;
  ad: string;
};

const PAISES = [
  { code: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: '+52', name: 'México', flag: '🇲🇽' },
  { code: '+34', name: 'España', flag: '🇪🇸' },
  { code: '+57', name: 'Colombia', flag: '🇨🇴' },
  { code: '+51', name: 'Perú', flag: '🇵🇪' },
  { code: '+56', name: 'Chile', flag: '🇨🇱' },
  { code: '+58', name: 'Venezuela', flag: '🇻🇪' },
  { code: '+593', name: 'Ecuador', flag: '🇪🇨' },
  { code: '+591', name: 'Bolivia', flag: '🇧🇴' },
  { code: '+595', name: 'Paraguay', flag: '🇵🇾' },
  { code: '+598', name: 'Uruguay', flag: '🇺🇾' },
  { code: '+55', name: 'Brasil', flag: '🇧🇷' },
  { code: '+506', name: 'Costa Rica', flag: '🇨🇷' },
  { code: '+507', name: 'Panamá', flag: '🇵🇦' },
  { code: '+503', name: 'El Salvador', flag: '🇸🇻' },
  { code: '+502', name: 'Guatemala', flag: '🇬🇹' },
  { code: '+504', name: 'Honduras', flag: '🇭🇳' },
  { code: '+505', name: 'Nicaragua', flag: '🇳🇮' },
  { code: '+1-809', name: 'República Dominicana', flag: '🇩🇴' },
  { code: '+1', name: 'Estados Unidos / Canadá', flag: '🇺🇸' },
];

export default function CalificationFormDirect({ variant, onClose }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      codigoPais: '',
      telefono: '',
      ad: '',
    },
  });

  const leadIdRef = useRef<string>('');

  useEffect(() => {
    const existing = sessionStorage.getItem('leadId');
    const id = existing ?? `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    leadIdRef.current = id;
    if (!existing) sessionStorage.setItem('leadId', id);
  }, []);

  const [loading, setLoading] = useState(false);

  const values = watch();

  const isFormValid = () => {
    const isNameValid = values.name.trim().length > 1;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
    const isPhoneValid = values.telefono.trim().length > 5 && !!values.codigoPais;
    return isNameValid && isEmailValid && isPhoneValid;
  };

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const N8N_WEBHOOK = currentHostname.includes('localhost')
    ? FIRST_STEP_FORM_TEST
    : FIRST_STEP_FORM;

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const adParam = searchParams.get('ad');
    if (adParam) setValue('ad', adParam);
  }, [setValue]);

  useEffect(() => {
    const b = document.querySelector('body');
    b?.classList.add('overflow-hidden');
    return () => b?.classList.remove('overflow-hidden');
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (!isFormValid()) return;

    try {
      setLoading(true);

      const phone = `${data.codigoPais}${data.telefono}`;

      const payload = {
        event: 'lead_contact_created',
        leadId: leadIdRef.current,
        variant,
        name: data.name,
        email: data.email,
        phone,
        codigoPais: data.codigoPais,
        telefono: data.telefono,
        ad: data.ad,
        ts: new Date().toISOString(),
      };

      // Envío a N8N (mantener para sheet + 2chat)
      fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([payload]),
        keepalive: true,
      }).catch(() => {});

      // Envío a Fit Funnels Analytics (server-side para no exponer la API key)
      fetch('/api/analytics/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone,
          ad: data.ad,
          variant,
        }),
        keepalive: true,
      }).catch(() => {});

      // Guardar en localStorage para Calendly y tracking
      localStorage.setItem('name', data.name);
      localStorage.setItem('email', data.email);
      localStorage.setItem('phone', phone);
      localStorage.setItem('isQualified', 'true');

      // Todos los leads van directo al Calendly
      window.location.href = '/pages/calendly';
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      style={{ zIndex: 10000 }}
    >
      <div className="w-full md:max-w-[720px] rounded-[20px] border border-white/10 bg-[#111] p-6 md:p-10 shadow-2xl">
        <h2 className="text-[22px] md:text-[26px] font-semibold text-white leading-tight">
          Completá tus datos para agendar tu consulta gratuita y ver si somos un buen fit
        </h2>
        <p className="text-white/70 mt-2">Tus datos son 100% confidenciales. Te tomará menos de 1 minuto.</p>

        <form className="mt-6" onSubmit={handleSubmit(onSubmit)} autoComplete="on">
          <div className="space-y-5">
            <label className="block">
              <span className="text-white text-sm">Nombre</span>
              <input
                autoFocus
                type="text"
                placeholder="Tu Nombre Completo"
                {...register('name', { required: 'Campo requerido' })}
                className="mt-2 w-full rounded-lg bg-white text-[#111] px-4 py-3 outline-none"
              />
              {errors.name && <span className="text-red-400 text-xs">{errors.name.message}</span>}
            </label>

            <label className="block">
              <span className="text-white text-sm">Correo electrónico</span>
              <input
                type="email"
                placeholder="tu@email.com"
                {...register('email', { required: 'Campo requerido' })}
                className="mt-2 w-full rounded-lg bg-white text-[#111] px-4 py-3 outline-none"
              />
              {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
            </label>

            <div>
              <span className="text-white text-sm">Número de teléfono</span>
              <div className="mt-2 flex gap-2">
                <select
                  {...register('codigoPais', { required: 'Campo requerido' })}
                  className="rounded-lg bg-white text-[#111] px-3 py-3 outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>
                    País
                  </option>
                  {PAISES.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.flag} {p.code}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  placeholder="Número"
                  {...register('telefono', {
                    required: 'Campo requerido',
                    pattern: { value: /^[0-9\s\-]+$/, message: 'Formato de teléfono inválido' },
                  })}
                  className="flex-1 bg-white text-[#111]/80 rounded-lg px-4 py-2 outline-none min-w-0"
                />
              </div>

              {errors.codigoPais && (
                <span className="text-red-400 text-xs">{errors.codigoPais.message}</span>
              )}
              {errors.telefono && (
                <span className="text-red-400 text-xs">{errors.telefono.message}</span>
              )}
            </div>
          </div>

          <input type="hidden" {...register('ad')} />

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-lg border border-white/15 text-white/90 hover:bg-white/10 transition"
              disabled={loading}
            >
              Atrás
            </button>

            <button type="submit" className="cf-btn" disabled={loading || !isFormValid()}>
              {loading ? 'Cargando...' : 'Agendar mi consulta gratuita'}
              {!loading && (
                <svg
                  width="13"
                  height="12"
                  viewBox="0 0 13 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 inline-block"
                >
                  <path
                    d="M6.41318 11.6364L5.09499 10.3296L8.55522 6.86932H0.447266V4.94887H8.55522L5.09499 1.49432L6.41318 0.181824L12.1404 5.9091L6.41318 11.6364Z"
                    fill="#FFF"
                  />
                </svg>
              )}
            </button>
          </div>

          <p className="text-white/70 text-xs mt-4">
            PD: Este programa esta pensado para padres ocupados, buscando resultados reales, mediante el cambio de
            hábitos, de forma sostenible. No es la tipica rutina o dieta extrema, que puede seguir alguien con mucho
            tiempo libre
          </p>
        </form>
      </div>
    </div>
  );
}
