/**
 * Logger centralizado para ReseñasYa.
 *
 * Prefija todos los mensajes con [ReseñasYa] para facilitar
 * el filtrado en los logs de producción (Vercel, etc.).
 */

const PREFIX = "[ReseñasYa]";

export const logger = {
  /** Información general sobre el flujo de la aplicación */
  info(message: string, data?: unknown): void {
    if (data !== undefined) {
      console.log(`${PREFIX} ${message}`, data);
    } else {
      console.log(`${PREFIX} ${message}`);
    }
  },

  /** Errores que impiden completar una operación */
  error(message: string, error?: unknown): void {
    if (error !== undefined) {
      console.error(`${PREFIX} ❌ ${message}`, error);
    } else {
      console.error(`${PREFIX} ❌ ${message}`);
    }
  },

  /** Situaciones anómalas que no bloquean el flujo pero merecen atención */
  warn(message: string, data?: unknown): void {
    if (data !== undefined) {
      console.warn(`${PREFIX} ⚠️  ${message}`, data);
    } else {
      console.warn(`${PREFIX} ⚠️  ${message}`);
    }
  },
};
