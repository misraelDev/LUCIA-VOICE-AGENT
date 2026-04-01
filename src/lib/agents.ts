import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

export interface AgentConfig {
  id: string
  name: string
  description: string
  model: string
  externalVoice: {
    /** TTS open source: https://github.com/resemble-ai/chatterbox */
    chatterbox: {
      modelVariant: 'turbo' | 'multilingual' | 'original'
      /** ISO code for Chatterbox-Multilingual, e.g. es, en */
      languageId?: string
      /** Ruta al WAV de referencia (~10s) para clonación / Turbo */
      referenceAudioPath?: string
    }
  }
  selectedTools: string[]
  prompt: {
    templateFile: string
  }
  tools: string[]
  settings: {
    maxTokens: number
    temperature: number
  }
  vadSettings: {
    turnEndpointDelay: string
    minimumTurnDuration: string
    minimumInterruptionDuration: string
    frameActivationThreshold: number
  }
}

export async function loadAgentConfig(agentId: string): Promise<AgentConfig> {
  try {
    // Construir la ruta al archivo JSON del agente
    const agentPath = join(process.cwd(), 'src', 'prompts', 'agents', `${agentId}.json`)
    
    // Leer el archivo JSON
    const agentData = readFileSync(agentPath, 'utf-8')
    const agent = JSON.parse(agentData)

    return agent
  } catch (error) {
    console.error(`Error loading agent config for ${agentId}:`, error)
    throw new Error(`Failed to load agent config: ${agentId}`)
  }
}

export async function loadAgentPrompt(templateFile: string): Promise<string> {
  try {
    // Construir la ruta al archivo de prompt
    const promptPath = join(process.cwd(), 'src', 'prompts', templateFile)
    
    // Leer el archivo de prompt
    const promptData = readFileSync(promptPath, 'utf-8')
    
    return promptData
  } catch (error) {
    console.error(`Error loading agent prompt from ${templateFile}:`, error)
    throw new Error(`Failed to load agent prompt: ${templateFile}`)
  }
}

export function getAvailableAgents(): string[] {
  const agentsDir = join(process.cwd(), 'src', 'prompts', 'agents')
  
  try {
    const files = readdirSync(agentsDir)
    return files
      .filter((file: string) => file.endsWith('.json'))
      .map((file: string) => file.replace('.json', ''))
  } catch (error) {
    console.error('Error reading agents directory:', error)
    return []
  }
}