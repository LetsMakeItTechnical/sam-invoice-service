import axios from 'axios';

import HttpClient, { HttpClientConfig } from './HttpClient';
import IHttpClient from './IHttpClient';

export default class HttpClientFactory {
  public create(options?: HttpClientConfig): IHttpClient {
    return new HttpClient(
      axios.create({
        timeout: 28000,
        ...options,
      }),
    );
  }
}
