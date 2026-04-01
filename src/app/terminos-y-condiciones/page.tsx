import { Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TerminosYCondiciones() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center justify-center mb-8">
        <Shield className="h-10 w-10 text-primary mr-2" />
        <h1 className="text-3xl font-bold text-center">Condiciones del Servicio</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <div className="text-sm  mb-6 text-right">Última actualización: 12 de mayo de 2025</div>

        <div className="prose prose-slate max-w-none">
          <p className="lead">
            Bienvenido a nuestra plataforma. Antes de utilizar nuestros servicios, te pedimos que leas detenidamente las
            siguientes condiciones. Al acceder y utilizar esta aplicación, aceptas estas condiciones de uso y nuestras
            políticas de privacidad.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">1. Alcance del Servicio</h2>
          <p>
            Esta plataforma está diseñada para facilitar la gestión de interacciones automatizadas con clientes mediante
            un asistente de voz, integrando herramientas de comunicación, seguimiento, análisis y tareas posteriores.
          </p>

          <p className="font-medium mt-4">Funcionalidades incluidas:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Integración con Vapi para procesamiento de datos en tiempo real.</li>
            <li>Visualización de interacciones a través del Panel de control.</li>
            <li>Validación de credenciales de login con mecanismos de seguridad.</li>
            <li>Integración con Google Calendar para gestión de citas.</li>
            <li>Transcripción y grabación de llamadas con fines de auditoría y mejora del servicio.</li>
            <li>Creación de tareas automáticas de seguimiento post-llamada.</li>
            <li>Panel de usuario con ficha completa, historial y estado de conversión.</li>
         </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">2. Protección de Datos y Privacidad</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Todas las llamadas son grabadas para fines de calidad, formación y trazabilidad, previa notificación al
              usuario.
            </li>
            <li>
              Los datos de contacto y la ficha de cada cliente se manejan conforme a estándares de protección de datos
              vigentes.
            </li>
            <li>
              La aplicación implementa validaciones y restricciones de acceso por rol para proteger la información
              sensible.
            </li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">3. Obligaciones del Usuario</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
            <li>No compartir ni reutilizar contenido grabado o transcripciones sin autorización expresa.</li>
            <li>
              Utilizar las funcionalidades del sistema exclusivamente para fines legales y conforme a los fines del
              servicio.
            </li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">4. Limitaciones y Responsabilidad</h2>
          <p>
            La plataforma proporciona herramientas automáticas de análisis y gestión, pero no garantiza una
            interpretación humana perfecta de todas las interacciones. Es responsabilidad del usuario auditar los datos
            y tomar decisiones basadas en múltiples fuentes.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">5. Cambios en las Condiciones</h2>
          <p>
            Nos reservamos el derecho de actualizar estas condiciones en cualquier momento. Se notificará a los usuarios
            sobre cambios relevantes dentro de la aplicación o por correo electrónico.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">6. Contacto</h2>
          <p>
            Para dudas o sugerencias sobre estas condiciones, puedes comunicarte con nuestro equipo de soporte.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center text-sm ">
        <p>© {new Date().getFullYear()} LucIA. Todos los derechos reservados.</p>
      </div>

      <div className="mt-8 flex justify-center">
        <Button asChild variant="default">
          <Link href="/dashboard">
            Volver al inicio de sesión
          </Link>
        </Button>
      </div>
    </div>
  )
} 