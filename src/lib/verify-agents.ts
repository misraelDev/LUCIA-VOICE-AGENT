// Verificar configuración de agentes en runtime (sin logs salvo depuración explícita)
export function verifyAgentConfig() {
  const config = {
    currentDateTime: new Date().toISOString(),
    retellAgents: {
      clinica: "agent_cbaa013d8fc7d75d9f917eed69",
      ecommerce: "agent_3532a60adad2615dd9252fe161",
      hoteles: "agent_75f681cfd947149a3600f7c4da",
      inmobiliaria: "agent_6095633c9934cc2fef35718f49",
      ventas: "agent_55be7d3a53a5adab44db1ec36f",
    },
    environment: process.env.NODE_ENV,
    retellApiKey: process.env.RETELL_API_KEY ? "✅ SET" : "❌ MISSING",
  };

  if (process.env.NEXT_PUBLIC_DEBUG_RETELL === "true") {
    console.log(
      "🔍 Agent Config Verification:",
      JSON.stringify(config, null, 2),
    );
  }

  return config;
}