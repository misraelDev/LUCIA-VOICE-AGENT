/**
 * Parseo del cuerpo que devuelve el API. El texto mostrado al usuario debe venir
 * del backend (ResponseDetail / RFC 7807). Ver:
 * LUCIA-API-REST/docs/README_ESTANDAR_RESPUESTAS_API.md
 *
 * Este módulo no añade mensajes de negocio en el front.
 */
export type ApiProblemPayload = {
  title?: string;
  detail: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Extrae `title` y `detail` (u homólogos que el backend envíe en JSON).
 */
export function parseApiProblemResponse(
  data: unknown,
): ApiProblemPayload | null {
  if (!isRecord(data)) return null;

  const detail =
    typeof data.detail === "string" && data.detail.length > 0
      ? data.detail
      : typeof data.message === "string" && data.message.length > 0
        ? data.message
        : null;

  if (!detail) {
    if (
      Array.isArray(data.errors) &&
      data.errors.length > 0 &&
      isRecord(data.errors[0]) &&
      typeof data.errors[0].message === "string"
    ) {
      return {
        title: typeof data.title === "string" ? data.title : undefined,
        detail: data.errors[0].message,
      };
    }
    if (typeof data.error === "string" && data.error.length > 0) {
      return {
        title: typeof data.title === "string" ? data.title : undefined,
        detail: data.error,
      };
    }
    return null;
  }

  return {
    title: typeof data.title === "string" ? data.title : undefined,
    detail,
  };
}

/** Envoltura de éxito: `title`, `detail`, `data`. */
export function parseApiSuccessEnvelope(
  data: unknown,
): { title?: string; detail?: string } {
  if (!isRecord(data)) return {};
  return {
    title: typeof data.title === "string" ? data.title : undefined,
    detail: typeof data.detail === "string" ? data.detail : undefined,
  };
}
