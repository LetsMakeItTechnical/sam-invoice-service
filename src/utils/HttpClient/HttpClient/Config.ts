import { ResponseType } from 'axios';

export interface HttpClientConfig extends HttpClientMethodConfig {
  url?: string;
  method?: Method;
  baseURL?: string;
  data?: any;
  timeout?: number;
  responseType?: ResponseType;
}

export interface HttpClientMethodConfig {
  headers?: Record<string, string>;
  responseType?: ResponseType;
}

type Method = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'delete' | 'DELETE';
