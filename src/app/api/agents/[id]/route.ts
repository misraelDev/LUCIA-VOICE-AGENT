import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Validar el ID del agente
    const validIds = ['hoteles', 'clinica', 'inmobiliaria', 'ecommerce', 'ventas']
    if (!validIds.includes(id)) {
      return NextResponse.json(
        { error: 'Invalid agent ID' },
        { status: 400 }
      )
    }

    // Construir la ruta al archivo JSON del agente
    const agentPath = join(process.cwd(), 'src', 'prompts', 'agents', `${id}.json`)
    
    // Leer el archivo JSON
    const agentData = readFileSync(agentPath, 'utf-8')
    const agent = JSON.parse(agentData)

    return NextResponse.json(agent)
  } catch (error) {
    console.error('Error loading agent:', error)
    return NextResponse.json(
      { error: 'Failed to load agent' },
      { status: 500 }
    )
  }
}
