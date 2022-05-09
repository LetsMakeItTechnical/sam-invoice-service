import Response from './Response';

export default class HttpClientError extends Error {
  public readonly response: Response | null;

  constructor(message: string, response?: Response) {
    super(message);

    this.response = response || null;
  }
}
