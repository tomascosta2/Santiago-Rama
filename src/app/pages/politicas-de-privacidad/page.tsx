export default function PoliticasDePrivacidadPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Información que Recopilamos</h2>
          <p className="mb-4">
            Recopilamos información personal que usted nos proporciona directamente, como su nombre, correo electrónico y cualquier otra información que decida compartir.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. Uso de la Información</h2>
          <p className="mb-4">
            Utilizamos la información recopilada para mejorar nuestros servicios, comunicarnos con usted y personalizar su experiencia en nuestro sitio.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">3. Compartir Información</h2>
          <p className="mb-4">
            No compartimos su información personal con terceros, excepto cuando sea necesario para cumplir con la ley o proteger nuestros derechos.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">4. Seguridad de la Información</h2>
          <p className="mb-4">
            Implementamos medidas de seguridad para proteger su información contra accesos no autorizados, alteraciones o destrucción.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">5. Sus Derechos</h2>
          <p className="mb-4">
            Usted tiene derecho a solicitarnos corregir o eliminar su información personal en cualquier momento.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">6. Cambios en la Política de Privacidad</h2>
          <p className="mb-4">
            Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Le notificaremos sobre cualquier cambio significativo.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">7. Contacto</h2>
          <p className="mb-4">
            Para cualquier consulta podes escribirnos a nuestro correo electrónico de contacto. (santiago@santiagoramacoaching.com)
          </p>
        </section>
      </main>
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; 2026 Santiago Rama Coaching. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}