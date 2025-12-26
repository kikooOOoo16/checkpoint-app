/**
 * Http methods supported by microservice.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * Represents generic HTTP request.
 */
export interface HttpRequest<TRequestBody = void> {
  method?: HttpMethod;
  url: string;
  payload?: TRequestBody;
  headers?: {
    [key: string]: string;
  };
  queryParameters?: {
    [key: string]: string;
  };
}
