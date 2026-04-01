# Configuración de Agentes

Esta carpeta contiene la configuración de los diferentes agentes virtuales disponibles.

## Estructura

```
prompts/
├── agents/          # Configuraciones JSON de cada agente
│   ├── clinica.json
│   ├── hoteles.json
│   └── inmobiliaria.json
└── templates/       # Prompts en Markdown
    ├── clinica.md
    ├── hoteles.md
    └── inmobiliaria.md
```

## Agentes Disponibles

### 🏥 Clínica
- **Archivo**: `agents/clinica.json`
- **Template**: `templates/clinica.md`
- **Descripción**: Recepcionista médica virtual especializada en atención clínica y citas

### 🏨 Hoteles
- **Archivo**: `agents/hoteles.json`
- **Template**: `templates/hoteles.md`
- **Descripción**: Asistente virtual especializada en reservas y servicios hoteleros

### 🏠 Inmobiliaria
- **Archivo**: `agents/inmobiliaria.json`
- **Template**: `templates/inmobiliaria.md`
- **Descripción**: Asistente virtual especializada en servicios inmobiliarios y visitas

## Configuración JSON

Cada agente tiene una configuración simple con:

- `id`: Identificador único del agente
- `name`: Nombre descriptivo
- `description`: Descripción breve
- `voice`: Configuración de voz (provider, voiceId, language)
- `prompt`: Referencia al template de Markdown
- `tools`: Array de herramientas (actualmente vacío)
- `settings`: Configuraciones básicas (maxTokens, temperature)

## Uso

Para seleccionar un agente en tu aplicación, simplemente carga la configuración JSON correspondiente y usa el template de Markdown referenciado.

```javascript
// Ejemplo de uso
const agentConfig = require('./agents/clinica.json');
const promptTemplate = fs.readFileSync(`./templates/${agentConfig.prompt.templateFile}`, 'utf8');
```