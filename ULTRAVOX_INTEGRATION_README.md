# Integración con Ultravox - Lucía Voice Agent

Este documento describe la integración completa con Ultravox para el sistema de agentes de voz de Lucía.

## Arquitectura de la Integración

### 1. Tipos y Definiciones (`src/types/ultravox.d.ts`)

Define las interfaces y tipos para Ultravox:
- `Transcript`: Estructura de transcripciones
- `CallResponse`: Respuesta de la API de llamadas
- `UltravoxSessionStatus`: Estados de la sesión

### 2. Hook useUltravox (`src/hooks/useUltravox.ts`)

Hook personalizado que maneja toda la lógica de Ultravox:
- **Estado de la sesión**: Conectado, desconectado, escuchando, etc.
- **Transcripciones**: Manejo de mensajes del usuario y agente
- **Permisos de micrófono**: Verificación y solicitud de permisos
- **Creación de llamadas**: Integración con la API de Ultravox
- **Event listeners**: Manejo de eventos de la sesión

### 3. API de Llamadas (`src/app/api/calls/route.ts`)

Endpoint que crea llamadas en Ultravox:
- **Carga de agentes**: Carga configuración específica del agente
- **Prompts personalizados**: Carga prompts desde templates
- **Configuración de voz**: [Chatterbox](https://github.com/resemble-ai/chatterbox) (TTS open source) en `externalVoice.chatterbox`
- **VAD Settings**: Configuración de detección de voz

### 4. Funciones Auxiliares (`src/lib/agents.ts`)

Funciones para cargar configuración de agentes:
- `loadAgentConfig()`: Carga configuración JSON del agente
- `loadAgentPrompt()`: Carga prompt desde archivo template
- `getAvailableAgents()`: Lista agentes disponibles

## Flujo de Funcionamiento

### 1. Inicialización
```typescript
// El hook se inicializa automáticamente
const ultravox = useUltravox()
```

### 2. Creación de Llamada
```typescript
// Crear llamada con agente específico
await ultravox.createCall('hoteles')
```

### 3. Conexión Automática
```typescript
// El hook maneja automáticamente la conexión
// Event listeners se configuran automáticamente
```

### 4. Manejo de Eventos
```typescript
// Los eventos se manejan automáticamente:
// - status: Cambios de estado
// - transcripts: Transcripciones en tiempo real
// - experimental_message: Mensajes de debug
```

## Estados de Ultravox

### Estados de Sesión
- `disconnected`: No conectado
- `connecting`: Conectando a la llamada
- `idle`: Conectado, esperando
- `listening`: Escuchando al usuario
- `thinking`: Procesando respuesta
- `speaking`: Hablando

### Estados Derivados
- `isConnected`: Sesión activa
- `isRecording`: Escuchando al usuario
- `isProcessing`: Pensando o conectando
- `isSpeaking`: El agente está hablando
- `isUserSpeaking`: El usuario está hablando

## Integración con el Contexto del Agente

### Contexto Actualizado
El `AgentProvider` ahora incluye:
- Estado del modelo activo
- Estado de Ultravox
- Transcripciones en tiempo real
- Métodos para iniciar/detener llamadas

### Uso en Componentes
```typescript
const { 
  activeModel, 
  startCall, 
  stopCall,
  ultravoxStatus,
  isRecording,
  isSpeaking,
  transcripts 
} = useAgent()
```

## Configuración de Agentes

### Estructura de Agente
```json
{
  "id": "hoteles",
  "name": "Lucía - Asistente Hoteles",
  "model": "fixie-ai/ultravox",
  "externalVoice": {
    "chatterbox": {
      "modelVariant": "multilingual",
      "languageId": "es",
      "referenceAudioPath": "voices/lucia-reference.wav"
    }
  },
  "prompt": {
    "templateFile": "templates/hoteles.md"
  },
  "vadSettings": {
    "turnEndpointDelay": "0.25s",
    "minimumTurnDuration": "0.3s"
  }
}
```

### Templates de Prompt
Los prompts se cargan desde archivos Markdown en `src/prompts/templates/`.

## Características de la Integración

### 1. Detección de Voz Avanzada (VAD)
- **Turn Endpoint Delay**: Pausa natural antes de responder
- **Minimum Turn Duration**: Filtra ruidos pero permite frases cortas
- **Interruption Duration**: Permite interrupciones naturales
- **Activation Threshold**: Sensibilidad configurable

### 2. Transcripciones en Tiempo Real
- **Parciales**: Muestra texto mientras el usuario habla
- **Finales**: Texto confirmado
- **Detección de hablante**: Usuario vs Agente
- **Estado de habla**: Detecta si el usuario está hablando

### 3. Chatterbox (TTS open source)
- **Referencias**: [resemble-ai/chatterbox](https://github.com/resemble-ai/chatterbox), `pip install chatterbox-tts`
- **Variantes**: `turbo`, `multilingual`, `original` (`modelVariant` en JSON)
- **Por agente**: `languageId` (p. ej. `es`) y `referenceAudioPath` para clonación de voz

### 4. Manejo de Errores Robusto
- **Fallback automático**: Modelo por defecto si falla
- **Reconexión**: Manejo de desconexiones
- **Logging detallado**: Para debugging

## Uso en la Aplicación

### 1. Selección de Agente
```typescript
// Al cambiar de sección, se carga el modelo correspondiente
await loadModel('hoteleria') // Carga hoteles.json
```

### 2. Inicio de Llamada
```typescript
// Al presionar "Quiero hablar con Lucía"
await startCall()
```

### 3. Indicadores Visuales
- **Estado de conexión**: Muestra estado actual
- **Indicadores de volumen**: Animan según actividad
- **Transcripciones**: Muestra conversación en tiempo real

## Configuración del Entorno

### Variables de Entorno
```env
ULTRAVOX_API_KEY=SOuGhS7X.fP6dJ0HnHl9gdLsO0IyTpLOIb9iZDsXJ
```

### Script de Inicialización
El archivo `public/ultravox-init.js` carga el SDK de Ultravox automáticamente.

## Próximos Pasos

1. **Más agentes**: Agregar agentes específicos para cada caso de uso
2. **Analytics**: Tracking de uso y rendimiento
3. **Configuración avanzada**: UI para configurar agentes
4. **Integración con CRM**: Conectar con sistemas existentes
5. **Multiidioma**: Soporte para diferentes idiomas

