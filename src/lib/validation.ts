/**
 * Validación y saneamiento de inputs del usuario.
 *
 * Todas las funciones devuelven un ValidationResult con:
 *   - valid: boolean
 *   - error: mensaje legible si valid === false
 *   - sanitized: valor limpio listo para usar si valid === true
 *
 * Se aplican en los endpoints de la API ANTES de cualquier operación.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: string;
}

// ---------------------------------------------------------------------------
// Nombre del cliente
// ---------------------------------------------------------------------------

/** Máximo de caracteres permitidos en el nombre */
const NAME_MAX_LENGTH = 100;

/**
 * Valida y sanea el nombre de un cliente.
 * Elimina caracteres de control que podrían usarse para inyección.
 */
export function validateCustomerName(raw: unknown): ValidationResult {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return { valid: false, error: "El nombre del cliente es obligatorio" };
  }

  const trimmed = raw.trim();

  if (trimmed.length > NAME_MAX_LENGTH) {
    return {
      valid: false,
      error: `El nombre no puede superar los ${NAME_MAX_LENGTH} caracteres`,
    };
  }

  // Eliminar caracteres de control ASCII (0x00–0x1F y 0x7F)
  const sanitized = trimmed.replace(/[\x00-\x1F\x7F]/g, "").trim();

  if (sanitized.length === 0) {
    return { valid: false, error: "El nombre contiene caracteres no válidos" };
  }

  return { valid: true, sanitized };
}

// ---------------------------------------------------------------------------
// Número de teléfono
// ---------------------------------------------------------------------------

/**
 * Expresión regular para E.164 internacional.
 * Formato: + seguido de 7 a 15 dígitos.
 * Ejemplos válidos: +34612345678, +1 (555) 234-5678 (tras limpiar), +44 7911 123456
 */
const E164_REGEX = /^\+[1-9]\d{6,14}$/;

/**
 * Valida y normaliza un número de teléfono al formato E.164.
 *
 * Acepta números con espacios, guiones y paréntesis; los elimina antes de validar.
 * El número debe incluir el prefijo internacional con +.
 */
export function validatePhone(raw: unknown): ValidationResult {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return { valid: false, error: "El teléfono del cliente es obligatorio" };
  }

  const trimmed = raw.trim();

  if (trimmed.length > 25) {
    return { valid: false, error: "El teléfono introducido es demasiado largo" };
  }

  // Conservar solo dígitos y el + inicial
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  const normalized = hasPlus ? `+${digits}` : `+${digits}`;

  if (!E164_REGEX.test(normalized)) {
    return {
      valid: false,
      error:
        "El formato del teléfono no es válido. Debe incluir el prefijo internacional (ej: +34612345678)",
    };
  }

  return { valid: true, sanitized: normalized };
}

// ---------------------------------------------------------------------------
// URL (Google Maps / web)
// ---------------------------------------------------------------------------

/** Protocolos permitidos en URLs externas */
const ALLOWED_PROTOCOLS = ["https:", "http:"];

/**
 * Valida que una cadena sea una URL bien formada con protocolo HTTP/HTTPS.
 * Devuelve valid=true con sanitized=undefined si el campo está vacío (es opcional).
 */
export function validateUrl(raw: unknown): ValidationResult {
  if (raw === undefined || raw === null || raw === "") {
    return { valid: true, sanitized: undefined }; // campo opcional
  }

  if (typeof raw !== "string") {
    return { valid: false, error: "La URL no tiene un formato válido" };
  }

  const trimmed = raw.trim();

  if (trimmed.length === 0) {
    return { valid: true, sanitized: undefined };
  }

  if (trimmed.length > 2048) {
    return { valid: false, error: "La URL es demasiado larga" };
  }

  try {
    const url = new URL(trimmed);
    if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
      return {
        valid: false,
        error: "La URL debe comenzar por https:// o http://",
      };
    }
    return { valid: true, sanitized: url.toString() };
  } catch {
    return { valid: false, error: "La URL no tiene un formato válido" };
  }
}
