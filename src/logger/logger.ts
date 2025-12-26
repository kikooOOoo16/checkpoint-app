import {LogNamespace} from './log-namespace';
import {getTraceId} from './trace-id';
import {configure, getLogger} from 'log4js';

// Configure log4js
configure({
  appenders: {
    console: {
      type: 'stdout',
      layout: {
        type: 'colored'
      }
    }
  },
  categories: {
    default: {appenders: ['console'], level: 'debug'}
  }
});

/**
 * Logger facade that matches the expected API.
 * @param {LogNamespace | string} namespace
 */
export const logger = (namespace: LogNamespace | string = LogNamespace.DEFAULT) => {
  const l4jsLogger = getLogger(namespace);

  return {
    debug: (message: string, meta?: any) => {
      l4jsLogger.debug(formatMessage(message, meta));
    },
    info: (message: string, meta?: any) => {
      l4jsLogger.info(formatMessage(message, meta));
    },
    warn: (message: string, meta?: any) => {
      l4jsLogger.warn(formatMessage(message, meta));
    },
    error: (message: string, meta?: any) => {
      l4jsLogger.error(formatMessage(message, meta));
    }
  };
};

/**
 * Formats the message and meta into a single string for log4js.
 * @param {string} message
 * @param {any} meta
 * @returns {string}
 */
const formatMessage = (message: string, meta?: any): string => {
  if (!meta) {
    return message;
  }
  return `${message} ${JSON.stringify(meta)}`;
};

export {LogNamespace, getTraceId};
