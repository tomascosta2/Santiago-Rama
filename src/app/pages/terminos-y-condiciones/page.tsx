export default function TerminosYCondicionesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Aceptación de los Términos</h2>
          <p className="mb-4">
            Al acceder y utilizar este sitio web, usted acepta cumplir con estos Términos y Condiciones.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. Uso del Sitio</h2>
          <p className="mb-4">
            Usted se compromete a utilizar este sitio de manera legal y ética, respetando los derechos de terceros.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">3. Propiedad Intelectual</h2>
          <p className="mb-4">
            Todo el contenido del sitio está protegido por derechos de autor y no puede ser utilizado sin permiso.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">4. Limitación de Responsabilidad</h2>
          <p className="mb-4">
            No nos hacemos responsables por daños derivados del uso del sitio.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">5. Modificaciones de los  Términos</h2>
          <p className="mb-4">
            Nos reservamos el derecho de modificar estos Términos en cualquier momento.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">6. Ley Aplicable</h2>
          <p className="mb-4">
            Estos Términos se rigen por las leyes del país en el que operamos.
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
          <p className="text-sm">&copy; © 2026 Santiago Rama Coaching. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}