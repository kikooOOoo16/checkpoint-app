import {CommonObject} from '../model';
import {HttpMethod, HttpRequest} from './http-request';

const AUTHORIZATION_HEADER = 'Authorization';

/**
 * Http request builder.
 */
export class HttpRequestBuilder<TRequestBody = void> {
  private readonly httpRequest: HttpRequest<TRequestBody>;

  constructor() {
    this.httpRequest = {
      method: undefined,
      url: undefined,
      payload: undefined,
      headers: {},
      queryParameters: {}
    };
  }

  setUrl(url: string): HttpRequestBuilder<TRequestBody> {
    this.httpRequest.url = url;
    return this;
  }

  setPayload(payload: TRequestBody): HttpRequestBuilder<TRequestBody> {
    this.httpRequest.payload = payload;
    return this;
  }

  setFormPayload(payload: CommonObject): HttpRequestBuilder<TRequestBody> {
    const data = Object.keys(payload)
      .map(key => `${key}=${encodeURIComponent(payload[key])}`)
      .join('&');

    this.httpRequest.payload = data as any;
    return this;
  }

  setBearerAuthorization(jwtToken: string): HttpRequestBuilder<TRequestBody> {
    this.addHeader(AUTHORIZATION_HEADER, 'Bearer ' + jwtToken);
    return this;
  }

  setBasicAuthorization(username: string, password: string): HttpRequestBuilder<TRequestBody> {
    this.addHeader(AUTHORIZATION_HEADER, 'Basic ' + HttpRequestBuilder.encodeBasicAuthentication(username, password));
    return this;
  }

  addHeader(name: string, value: string): HttpRequestBuilder<TRequestBody> {
    this.httpRequest.headers[name] = value;
    return this;
  }

  addHeaders(headers: {[key: string]: string}): HttpRequestBuilder<TRequestBody> {
    this.httpRequest.headers = {...this.httpRequest.headers, ...headers};
    return this;
  }

  addQueryParameter(name: string, value: string): HttpRequestBuilder<TRequestBody> {
    this.httpRequest.queryParameters[name] = value;
    return this;
  }

  addQueryParameters(queryParameters: {[key: string]: string}): HttpRequestBuilder<TRequestBody> {
    this.httpRequest.queryParameters = {...this.httpRequest.queryParameters, ...queryParameters};
    return this;
  }

  setMethod(method: HttpMethod): HttpRequestBuilder<TRequestBody> {
    this.httpRequest.method = method;
    return this;
  }

  build(): HttpRequest<TRequestBody> {
    return this.httpRequest;
  }

  private static encodeBasicAuthentication(username: string, password: string): string {
    return Buffer.from(`${username}:${password}`).toString('base64');
  }
}
