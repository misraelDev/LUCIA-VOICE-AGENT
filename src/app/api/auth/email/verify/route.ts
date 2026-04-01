import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({})) as { email?: string; token?: string }
    const { email, token } = body

    if (!token) {
      return NextResponse.json({ success: false, message: "Token de verificación es requerido" }, { status: 400 })
    }

    // Punto de extensión: aquí podrías validar el token contra tu backend o proveedor
    // Por ahora, respondemos exitosamente para permitir el flujo local de confirmación
    return NextResponse.json({ success: true, message: "Email verificado", email })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error procesando la verificación" }, { status: 500 })
  }
}


