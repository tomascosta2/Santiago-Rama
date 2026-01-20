// app/components/FAQs.tsx (o donde prefieras)
// Si estás en App Router, esto es un Client Component porque usa useState.
'use client';

import { useState } from 'react';

const faqs = [
	{
		pregunta: "¿Realmente puedo bajar tanto peso en tan poco tiempo, o es solo humo?",
		respuesta:
			"Respuesta"
	},
	{
		pregunta: "¿Realmente puedo bajar tanto peso en tan poco tiempo, o es solo humo?",
		respuesta:
			"Respuesta"
	},
	{
		pregunta: "¿Realmente puedo bajar tanto peso en tan poco tiempo, o es solo humo?",
		respuesta:
			"Respuesta"
	},
	{
		pregunta: "¿Realmente puedo bajar tanto peso en tan poco tiempo, o es solo humo?",
		respuesta:
			"Respuesta"
	},
];

function PlusIcon({ rotated }: { rotated: boolean }) {
	return (
		<div className="rounded-[10px] w-[35px] h-[35px] bg-[var(--primary)]/30 min-w-[35px] flex items-center justify-center">
			<svg
				className={`faq-icon size-[14px] transition-all duration-300 ${rotated ? 'rotate-45' : ''}`}
				fill="#FFF"
				viewBox="0 0 448 512"
			>
				<path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
			</svg>
		</div>
	);
}

export default function Faqs() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	return (
			<div>
				<h2 className="text-[36px] md:text-[44px] font-bold text-white text-center max-w-[500px] leading-[120%] mx-auto">
					Las Dudas Más Frecuentes
				</h2>

				<div className="max-w-[700px] mx-auto my-12 grid gap-4" id="faq-container">
					{faqs.map((item, index) => {
						const isOpen = openIndex === index;

						return (
							<div
								key={index}
								className="w-full cursor-pointer p-[20px] bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-[14px]"
								onClick={() => setOpenIndex(isOpen ? null : index)}
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') setOpenIndex(isOpen ? null : index);
								}}
								aria-expanded={isOpen}
							>
								<h3 className="font-medium tracking-normal text-[16px] md:text-[18px] text-white flex justify-between items-center">
									<span className="pe-8">{item.pregunta}</span>
									<PlusIcon rotated={isOpen} />
								</h3>

								<div
									className={[
										'normal-case overflow-hidden transition-all duration-500',
										isOpen ? 'max-h-[2000px]' : 'max-h-0',
									].join(' ')}
								>
									<p className="text-white/80 text-[18px] pt-[10px]">{item.respuesta}</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
	);
}
