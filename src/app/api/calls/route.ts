import { NextResponse } from 'next/server'

// Este endpoint pertenecía a Ultravox. Fue deshabilitado tras migración a Retell.
export async function POST() {
    return NextResponse.json({ error: 'Endpoint de Ultravox removido. Use /api/retell/create-web-call' }, { status: 410 })
}

export async function DELETE() {
    return NextResponse.json({ error: 'Endpoint de Ultravox removido. Use /api/retell/create-web-call' }, { status: 410 })
}