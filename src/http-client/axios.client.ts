import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {HttpRequest} from './http-request';
import * as https from 'https';

/**
 * Axios Http client.
 */
export class AxiosClient {
  private axios: AxiosInstance;
  private readonly agent: https.Agent;

  constructor() {
    this.agent = new https.Agent({
      rejectUnauthorized: false
    });

    this.axios = axios.create({
      httpsAgent: this.agent
    });
  }

  post<TRequestBody = void, TResponseBody = void>(
    httpRequest: HttpRequest<TRequestBody>,
    preserveResponse = false
  ): Promise<TResponseBody> {
    return this.axios
      .post<TRequestBody, AxiosResponse<TResponseBody>>(httpRequest.url, httpRequest.payload, {
        headers: httpRequest.headers,
        params: httpRequest.queryParameters
      })
      .then(response => {
        return response.data;
      });
  }

  get<TResponseBody = void>(httpRequest: HttpRequest, preserveResponse = false): Promise<TResponseBody> {
    return this.axios
      .get<void, AxiosResponse<TResponseBody>>(httpRequest.url, {
        headers: httpRequest.headers,
        params: httpRequest.queryParameters
      })
      .then(response => {
        return response.data;
      });
  }

  put<TRequestBody = void, TResponseBody = void>(httpRequest: HttpRequest<TRequestBody>): Promise<TResponseBody> {
    return this.axios
      .put<TRequestBody, AxiosResponse<TResponseBody>>(httpRequest.url, httpRequest.payload, {
        headers: httpRequest.headers,
        params: httpRequest.queryParameters
      })
      .then(response => response.data);
  }

  patch<TRequestBody = void, TResponseBody = void>(httpRequest: HttpRequest<TRequestBody>): Promise<TResponseBody> {
    return axios
      .patch<TRequestBody, AxiosResponse<TResponseBody>>(httpRequest.url, httpRequest.payload, {
        headers: httpRequest.headers,
        params: httpRequest.queryParameters
      })
      .then(response => response.data);
  }

  delete<TRequestBody = void, TResponseBody = void>(
    httpRequest: HttpRequest<TRequestBody>,
    preserveResponse = false
  ): Promise<TResponseBody> {
    return this.axios
      .delete<TRequestBody, AxiosResponse<TResponseBody>>(httpRequest.url, {
        headers: httpRequest.headers,
        data: httpRequest.payload,
        params: httpRequest.queryParameters
      })
      .then(response => {
        return response.data;
      });
  }

  sendRequest<TRequestBody = void, TResponseBody = void>(
    httpRequest: HttpRequest<TRequestBody>
  ): Promise<TResponseBody> {
    const axiosRequestConfig: AxiosRequestConfig = {
      method: httpRequest.method,
      url: httpRequest.url,
      data: httpRequest.payload,
      headers: httpRequest.headers,
      params: httpRequest.queryParameters
    };
    return this.axios
      .request<TRequestBody, AxiosResponse<TResponseBody>>(axiosRequestConfig)
      .then(response => response.data);
  }

  public addRequestInterceptor(
    interceptor: (config: AxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
  ): void {
    this.axios.interceptors.request.use(interceptor);
  }

  public addResponseInterceptor(
    interceptor: <T = any>(response: AxiosResponse<T>) => AxiosResponse<T> | Promise<AxiosResponse<T>>
  ): void {
    this.axios.interceptors.response.use(interceptor);
  }

  public setTimeout(timeout: number): void {
    this.axios.defaults.timeout = timeout;
  }
}
export const axiosClient = new AxiosClient();
