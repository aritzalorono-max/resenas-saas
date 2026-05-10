import Link from 'next/link'
import { Stethoscope } from 'lucide-react'

export const metadata = { title: 'Términos de uso · Guardias' }

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Guardias</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Términos de uso</h1>
        <p className="text-gray-400 text-sm mb-10">Última actualización: mayo 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Objeto y ámbito</h2>
            <p>
              Guardias es una aplicación de gestión de turnos y guardias médicas destinada a
              servicios hospitalarios y equipos sanitarios. El acceso y uso de la aplicación
              implica la aceptación de los presentes términos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Registro y cuenta</h2>
            <p>
              Para utilizar Guardias es necesario crear una cuenta con un correo electrónico
              válido y una contraseña segura. El usuario es responsable de mantener la
              confidencialidad de sus credenciales y de todas las actividades que ocurran
              bajo su cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Uso aceptable</h2>
            <p>El usuario se compromete a:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Utilizar la aplicación exclusivamente para la gestión legítima de turnos médicos.</li>
              <li>No compartir información de acceso con terceros no autorizados.</li>
              <li>No introducir datos falsos o engañosos.</li>
              <li>Respetar la privacidad de los demás miembros del equipo.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Propiedad intelectual</h2>
            <p>
              Todos los derechos sobre el software, diseño e interfaces de Guardias son propiedad
              de sus desarrolladores. El usuario recibe una licencia de uso limitada, no exclusiva
              e intransferible para acceder a la aplicación durante la vigencia de su cuenta activa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Limitación de responsabilidad</h2>
            <p>
              Guardias se proporciona tal cual. No garantizamos disponibilidad ininterrumpida ni
              ausencia de errores. No seremos responsables de daños derivados del uso o imposibilidad
              de uso de la aplicación, pérdida de datos o decisiones tomadas en base a la información
              mostrada.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Modificaciones</h2>
            <p>
              Nos reservamos el derecho a modificar estos términos en cualquier momento. Los cambios
              sustanciales se comunicarán a los usuarios por correo electrónico o mediante aviso
              en la aplicación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Legislación aplicable</h2>
            <p>
              Estos términos se rigen por la legislación española. Cualquier controversia se
              someterá a los juzgados y tribunales del domicilio del usuario.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex gap-4 text-sm">
          <Link href="/legal/privacidad" className="text-blue-600 hover:underline">
            Política de privacidad
          </Link>
          <Link href="/registro" className="text-gray-500 hover:underline">
            Volver al registro
          </Link>
        </div>
      </main>
    </div>
  )
}
