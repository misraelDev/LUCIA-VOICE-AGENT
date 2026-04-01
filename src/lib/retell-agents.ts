export const RETELL_AGENTS = {
  clinica: 'agent_cbaa013d8fc7d75d9f917eed69',
  ecommerce: 'agent_3532a60adad2615dd9252fe161',
  hoteles: 'agent_75f681cfd947149a3600f7c4da', // ✅ Agente correcto de hoteles - FIXED
  inmobiliaria: 'agent_6095633c9934cc2fef35718f49',
  ventas: 'agent_55be7d3a53a5adab44db1ec36f', // ✅ Agente correcto de ventas
} as const

export type RetellAgentKey = keyof typeof RETELL_AGENTS


