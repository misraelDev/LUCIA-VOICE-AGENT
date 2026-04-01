import { NextResponse } from 'next/server'
import { getAvailableAgents, loadAgentConfig } from '@/lib/agents'

export async function GET() {
  try {
    const agentIds = getAvailableAgents()
    const agents = []

    for (const agentId of agentIds) {
      try {
        const config = await loadAgentConfig(agentId)
        agents.push({
          id: config.id,
          name: config.name,
          description: config.description
        })
      } catch (error) {
        console.error(`Error loading agent ${agentId}:`, error)
      }
    }

    return NextResponse.json({ agents })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}