import {randomUUID} from 'crypto';

/**
 * Generates a unique trace ID.
 * @returns {string}
 */
export const getTraceId = (): string => {
  return randomUUID();
};
