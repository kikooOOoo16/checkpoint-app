import {getTraceId} from './logger';
import {ConnectionDetails} from './model';
import * as httpContext from 'express-http-context';

/**
 * Wrapper for http context.
 */
export class HttpRequestContext {
  // TODO update to use adapter name
  private static TOKEN_MAP = 'seed_token_map';
  private static TENANT_NAME_KEY = 'tenant-name';
  private static TRACE_ID_KEY = 'trace-id';

  /**
   * Retrieves map of tokens
   * Migration step to work with CMO v5
   * @returns {Map<string, string>}
   */
  getTokenCacheMap(): Map<string, ConnectionDetails> {
    return httpContext.get(HttpRequestContext.TOKEN_MAP);
  }

  /**
   * Stores map of token cache
   * Migration step to work with CMO v5
   * @param {Map<string, string>} tokenMap
   */
  setTokenCacheMap(tokenMap: Map<string, ConnectionDetails>): void {
    httpContext.set(HttpRequestContext.TOKEN_MAP, tokenMap);
  }

  /**
   * Sets request tenant name to http context.
   */
  setTenantName(tenantName: string): void {
    httpContext.set(HttpRequestContext.TENANT_NAME_KEY, tenantName);
  }

  /**
   * Retrieves request tenant name from http context.
   */
  getTenantName(): string {
    return httpContext.get(HttpRequestContext.TENANT_NAME_KEY);
  }

  /**
   * Sets request traceID value to http context.
   */
  setTraceId(reqTraceId?: string): void {
    httpContext.set(HttpRequestContext.TRACE_ID_KEY, reqTraceId || getTraceId());
  }

  /**
   * Retrieves request traceID value from http context.
   */
  getTraceId(): string {
    return httpContext.get(HttpRequestContext.TRACE_ID_KEY);
  }
}

export const httpRequestContext = new HttpRequestContext();
