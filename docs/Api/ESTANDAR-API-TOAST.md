# Estándar de respuestas API y toasts

**Objetivo:** Que desarrolladores y asistentes IA usen siempre el mismo patrón para respuestas de la API y notificaciones toast. No inventar mensajes en el front: mapear lo que devuelve la API usando las utilidades del proyecto.

---

## 1. Formato de respuesta de la API (backend)

La API sigue **RFC 7807** (Problem Details). Todas las respuestas tienen esta estructura:

**Éxito (2xx):**
```json
{
  "title": "Título descriptivo",
  "status": 200,
  "detail": "Mensaje descriptivo",
  "data": { ... }
}
```

**Error (4xx/5xx):**
```json
{
  "title": "Título del error",
  "status": 401,
  "detail": "Mensaje de error descriptivo"
}
```

- `title`: Título corto.
- `detail`: Mensaje para el usuario (o mensaje técnico en errores).
- `status`: Código HTTP.
- `data`: Solo en éxito; puede ser array u objeto.

**No hardcodear mensajes en el front.** Usar siempre `title`, `detail` y `status` que vienen de la API.

---

## 2. Utilidades del proyecto

### 2.1 `@/lib/api-response-handler`

- **`extractErrorInfo(responseData, status, statusText)`**  
  Lee `title`, `detail`, `status` de la respuesta de error y devuelve `{ title, detail, status, toastType }`.  
  Usa fallbacks si la API no envía algún campo.

- **`extractSuccessInfo(responseData, defaultTitle, defaultDetail)`**  
  Igual para respuestas exitosas.  
  Si la API no envía `title`/`detail`, usa los defaults (por ejemplo títulos genéricos por flujo).

- **`toastType`**  
  Se calcula según `status`: 2xx → `success`, 4xx/5xx → `error` (y excepciones como 409 → `warning`).

### 2.2 Toast: `@/lib/toast`

No usar `sonner` directo para mensajes que vienen de la API.

- **Firma:** `toast[toastType](title, detail?, icon?, statusCode?)`
- **Ejemplo:** `toast.success(title, detail, undefined, status)` o `toast.error(title, detail, undefined, status)`
- **Uso estándar:** `toast[result.toastType](result.title, result.detail, undefined, result.status)`

Referencia: `src/lib/toast.tsx` (toast personalizado que usa sonner por debajo).

---

## 3. Patrón en servicios (fetch + normalización)

Cuando un **servicio** hace `fetch` y la página debe mostrar un toast:

1. Hacer `fetch`, luego `response.json().catch(() => ({}))`.
2. Si **`!response.ok`**:  
   `const { title, detail, status, toastType } = extractErrorInfo(responseData, response.status, response.statusText)`  
   y devolver `{ success: false, title, detail, status, toastType, error: detail, ... }`.
3. Si **respuesta OK**:  
   `const { title, detail, status, toastType } = extractSuccessInfo(responseData, defaultTitle, defaultDetail)`  
   y devolver `{ success: true, title, detail, status, toastType, data: ..., ... }`.
4. En **catch** (red, etc.):  
   Devolver algo como:  
   `{ success: false, title: 'Error de conexión', detail: error.message, status: 500, toastType: 'error' }`.

**Ejemplo (servicio):**

```ts
import { extractErrorInfo, extractSuccessInfo } from "@/lib/api-response-handler";

const response = await fetch(url, { ... });
const responseData = await response.json().catch(() => ({}));

if (!response.ok) {
  const { title, detail, status, toastType } = extractErrorInfo(
    responseData,
    response.status,
    response.statusText
  );
  return { success: false, error: detail, title, detail, status, toastType };
}

const { title, detail, status, toastType } = extractSuccessInfo(
  responseData,
  "Título por defecto éxito",
  "Detalle por defecto éxito"
);
const payload = (responseData as { data?: unknown })?.data;
return { success: true, data: payload, title, detail, status, toastType };
```

Referencias en el repo: `UserService.login`, `AlliesService.getAlliesRegisterUrl`.

---

## 4. Patrón en páginas / componentes (toast)

Cuando el componente recibe un `result` del servicio:

- **Éxito o error de API:**  
  `toast[result.toastType](result.title, result.detail, undefined, result.status)`  
  (usar `result.toastType ?? 'error'` o `?? 'success'` si hace falta).
- **Solo en catch del componente** (error de red, sin respuesta API):  
  `toast.error('Error de conexión', errorMessage, undefined, 500)`.

**Ejemplo (página/componente):**

```tsx
import { toast } from "@/lib/toast";

const result = await myService.doAction();

if (!result.success) {
  const type = result.toastType ?? "error";
  toast[type](result.title ?? "", result.detail ?? "", undefined, result.status ?? 500);
  return;
}

const type = result.toastType ?? "success";
toast[type](result.title ?? "", result.detail ?? "", undefined, result.status ?? 200);
```

Referencias: `(auth)/sign-in/page.tsx`, `(authenticated)/admin/payments/add-investment-modal.tsx`, `(authenticated)/admin/payments/[id]/adjust-deposit-modal.tsx`, `(authenticated)/collaborator/allies/desktop-allies.tsx`, `mobile-allies.tsx`.

---

## 5. Listas de datos (GET con wrapper `data`)

Si la API devuelve listas dentro de un wrapper (como en investments/allies):

```json
{
  "title": "...",
  "status": 200,
  "detail": "...",
  "data": [ ... ]   // o { "total": N, "items": [ ... ] }
}
```

- **Normalizar en el cliente:**  
  `const data = raw?.data !== undefined ? raw.data : raw;`  
  y luego tratar `data` como array o como `{ total, items }` según el contrato.
- **Hooks:** Hacer esta normalización en el hook (por ejemplo `useInvestments`, `useAllies`) y exponer ya la lista (o `{ total, items }`) a los componentes.

No asumir que la respuesta es directamente un array; siempre soportar el wrapper `data`.

---

## 6. Resumen para devs e IA

| Dónde              | Qué hacer                                                                 |
|--------------------|---------------------------------------------------------------------------|
| **Servicio (fetch)** | Usar `extractErrorInfo` / `extractSuccessInfo` y devolver `title`, `detail`, `status`, `toastType`. |
| **Página/componente** | Usar `toast` de `@/lib/toast` y `toast[result.toastType](result.title, result.detail, undefined, result.status)`. |
| **Mensajes**       | No hardcodear; mapear desde la API. En éxito/error usar los helpers; en catch de red usar solo "Error de conexión" + mensaje. |
| **Listas (GET)**   | Normalizar `response.data` (wrapper) en hook o servicio y exponer lista/objeto normalizado. |

Siempre que se añada o modifique un flujo que llame a la API y muestre toast, seguir este estándar para mantener consistencia en todo el proyecto.
