import HttpClientResponse from './HttpClient/Response';
import { HttpClientMethodConfig } from './HttpClient/Config';

export default interface IHttpClient {
  get(url: string, options?: HttpClientMethodConfig): Promise<HttpClientResponse>;
  post(url: string, data: any, options?: HttpClientMethodConfig): Promise<HttpClientResponse>;
  postFormEncoded(url: string, data: any, options?: HttpClientMethodConfig): Promise<HttpClientResponse>;
  put(url: string, data: any, options?: HttpClientMethodConfig): Promise<HttpClientResponse>;
  putFormEncoded(url: string, data: any, options?: HttpClientMethodConfig): Promise<HttpClientResponse>;
  patch(url: string, data: any, options?: HttpClientMethodConfig): Promise<HttpClientResponse>;
  patchFormEncoded(url: string, data: any, options?: HttpClientMethodConfig): Promise<HttpClientResponse>;
  delete(url: string, options?: HttpClientMethodConfig): Promise<HttpClientResponse>;
}
