import {getTraceId, logger, LogNamespace} from '../logger';
import {CredentialsConfigurationError} from '../errors';
import {RawAxiosResponseHeaders} from 'axios';

/**
 * Additional HTTP request utils namespace.
 *
 * @namespace HttpUtils
 */
export namespace HttpUtils {
  /**
   * The function to check if the URL ends with a forward slash (/) and add it if not.
   *
   * @param {string} url - The URL to normalize.
   * @returns {string} The normalized URL.
   */
  export const normalizeUrl: (url: string) => string = url => (!url || url?.endsWith('/') ? url : `${url}/`);

  /**
   * Function to validate the base URL and throw an error if it is missing or empty.
   *
   * @param {string} baseUrl - The base URL to validate.
   * @throws {CredentialsConfigurationError} Throws an error if the base URL is missing or empty.
   */
  export function validateURL(baseUrl: string): void {
    if (!baseUrl?.length) {
      const msg = 'Connection data is incomplete';
      logger(LogNamespace.HTTP_UTILS_NAMESPACE).error(msg, {
        context: {
          traceId: getTraceId()
        }
      });
      throw new CredentialsConfigurationError(msg);
    }
  }

  /**
   * Extracts specific headers from a set of HTTP headers.
   *
   * @param {RawAxiosResponseHeaders} headers - The HTTP headers.
   * @param {string[]} headerNames - The array of header names to extract.
   * @returns {RawAxiosResponseHeaders} The extracted headers as key-value pairs, or an empty object if none of the headers are found.
   */
  export function extractHeadersFromResponse(
    headers: RawAxiosResponseHeaders,
    headerNames: string[]
  ): RawAxiosResponseHeaders {
    const extractedHeaders: RawAxiosResponseHeaders = {};

    headerNames.forEach(headerName => {
      const value = headers[headerName];
      if (value !== undefined) {
        extractedHeaders[headerName] = value;
      }
    });

    return extractedHeaders;
  }
}
