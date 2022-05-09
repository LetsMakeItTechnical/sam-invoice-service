import querystring from 'querystring';
import { AxiosInstance, AxiosResponse } from 'axios';

import HttpClientResponse from './HttpClient/Response';
import HttpClientError from './HttpClient/Error';
import IHttpClient from './IHttpClient';
import { HttpClientConfig, HttpClientMethodConfig } from './HttpClient/Config';

export { HttpClientConfig, HttpClientMethodConfig, HttpClientError };

export default class HttpClient implements IHttpClient {
  private readonly httpClient: AxiosInstance;

  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient as AxiosInstance;
  }

  public async get(url: string, options?: HttpClientMethodConfig): Promise<HttpClientResponse> {
    return this.request({
      method: 'GET',
      url,
      ...options,
    });
  }

  public async post(url: string, data: any, options?: HttpClientMethodConfig): Promise<HttpClientResponse> {
    return this.request({
      method: 'POST',
      url,
      data,
      ...options,
    });
  }

  public async postFormEncoded(url: string, data: any, options?: HttpClientMethodConfig): Promise<HttpClientResponse> {
    return this.post(url, querystring.stringify(data), {
      ...options,
      headers: {
        ...options?.headers,
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
  }

  public async put(url: string, data: any, options?: HttpClientMethodConfig): Promise<HttpClientResponse> {
    return this.request({
      method: 'PUT',
      url,
      data,
      ...options,
    });
  }

  public async putFormEncoded(url: string, data: any, options?: HttpClientMethodConfig): Promise<HttpClientResponse> {
    return this.put(url, querystring.stringify(data), {
      ...options,
      headers: {
        ...options?.headers,
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
  }

  public async patch(url: string, data: any, options?: HttpClientMethodConfig): Promise<HttpClientResponse> {
    return this.request({
      method: 'PATCH',
      url,
      data,
      ...options,
    });
  }

  public async patchFormEncoded(url: string, data: any, options?: HttpClientMethodConfig): Promise<HttpClientResponse> {
    return this.patch(url, querystring.stringify(data), {
      ...options,
      headers: {
        ...options?.headers,
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
  }

  public async delete(url: string, options?: HttpClientMethodConfig): Promise<HttpClientResponse> {
    return this.request({
      method: 'DELETE',
      url,
      ...options,
    });
  }

  private async request(options: HttpClientConfig): Promise<HttpClientResponse> {
    try {
      const response: AxiosResponse = await this.httpClient.request(options);

      return HttpClient.createResponseFrom(response);
    } catch (err) {
      const error = err as { code: number; message: string; response: any }
      if (error.response) {
        throw new HttpClientError(error.message, HttpClient.createResponseFrom(error.response));
      }

      throw new HttpClientError(error.message);
    }
  }

  private static createResponseFrom(response: AxiosResponse): HttpClientResponse {
    return {
      statusCode: response.status,
      body: response.data,
      headers: response.headers,
    };
  }
}
