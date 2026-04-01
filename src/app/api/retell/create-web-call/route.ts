import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { agent_id, metadata, retell_llm_dynamic_variables } = body || {}

    console.log('🔍 Create web call request:', { agent_id, metadata, retell_llm_dynamic_variables })

    if (!agent_id) {
      return NextResponse.json({ error: 'agent_id is required' }, { status: 400 })
    }

    const apiKey = process.env.RETELL_API_KEY
    if (!apiKey) {
      console.error('❌ RETELL_API_KEY is not configured')
      return NextResponse.json({ error: 'RETELL_API_KEY is not configured' }, { status: 500 })
    }

    console.log('✅ API Key found, length:', apiKey.length)

    const payload: Record<string, unknown> = { agent_id }
    if (metadata) payload.metadata = metadata
    if (retell_llm_dynamic_variables) payload.retell_llm_dynamic_variables = retell_llm_dynamic_variables

    console.log('📡 Calling Retell API with payload:', payload)

    const resp = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    console.log('📡 Retell API response status:', resp.status)

    if (!resp.ok) {
      const errorText = await resp.text()
      console.error('❌ Retell API error:', errorText)
      return NextResponse.json({ error: 'Retell API error', details: errorText }, { status: resp.status })
    }

    const data = await resp.json()
    console.log('✅ Retell API success:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json({ error: 'Unexpected error', details: String(error) }, { status: 500 })
  }
}


