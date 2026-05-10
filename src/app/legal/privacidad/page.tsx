import Link from 'next/link'
import { Stethoscope } from 'lucide-react'

export const metadata = { title: 'Política de privacidad · Guardias' }

export default function PrivacidadPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de privacidad</h1>
        <p className="text-gray-400 text-sm mb-10">Última actualización: mayo 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Responsable del tratamiento</h2>
            <p>
              Guardias es la aplicación responsable del tratamiento de los datos personales
              recogidos a través de este servicio. Para cualquier consulta relacionada con
              privacidad puedes contactarnos a través de la aplicación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Datos que recogemos</h2>
            <p>Recogemos únicamente los datos necesarios para prestar el servicio:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Dirección de correo electrónico (para autenticación y comunicaciones).</li>
              <li>Nombre completo (para identificación dentro del equipo).</li>
              <li>Datos de turnos y guardias introducidos por el propio usuario.</li>
              <li>Información sobre ausencias y trabajos extraordinarios registrados voluntariamente.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Finalidad del tratamiento</h2>
            <p>Los datos se utilizan exclusivamente para:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Gestionar el acceso a la aplicación y la identidad del usuario.</li>
              <li>Permitir la gestión colaborativa de turnos dentro de un equipo médico.</li>
              <li>Enviar comunicaciones relacionadas con el servicio (confirmación de cuenta, invitaciones).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Base legal</h2>
            <p>
              El tratamiento se basa en el consentimiento del usuario al registrarse y aceptar
              estos términos, y en la ejecución del contrato de prestación del servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Almacenamiento y seguridad</h2>
            <p>
              Los datos se almacenan en servidores seguros proporcionados por Supabase, con
              cifrado en tránsito (TLS) y en reposo. El acceso a los datos está restringido
              mediante políticas de seguridad a nivel de fila (Row Level Security).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Compartición de datos</h2>
            <p>
              No vendemos ni cedemos datos a terceros. Los datos de un usuario son visibles
              únicamente para los miembros del mismo equipo dentro de la aplicación.
              Utilizamos proveedores de infraestructura (Supabase, Vercel) que actúan como
              encargados del tratamiento bajo acuerdos de confidencialidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Tus derechos</h2>
            <p>Tienes derecho a:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Acceder a tus datos personales.</li>
              <li>Rectificar datos inexactos.</li>
              <li>Solicitar la eliminación de tu cuenta y datos.</li>
              <li>Oponerte al tratamiento o solicitar su limitación.</li>
            </ul>
            <p className="mt-3">
              Para ejercer estos derechos, contacta con nosotros a través de la aplicación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Conservación</h2>
            <p>
              Los datos se conservan mientras la cuenta esté activa. Al eliminar la cuenta,
              los datos personales se borran en un plazo máximo de 30 días, salvo obligación
              legal de conservación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Legislación aplicable</h2>
            <p>
              Esta política se rige por el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica
              3/2018 de Protección de Datos Personales (LOPDGDD).
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex gap-4 text-sm">
          <Link href="/legal/terminos" className="text-blue-600 hover:underline">
            Términos de uso
          </Link>
          <Link href="/registro" className="text-gray-500 hover:underline">
            Volver al registro
          </Link>
        </div>
      </main>
    </div>
  )
}
