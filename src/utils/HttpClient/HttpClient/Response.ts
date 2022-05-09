export default interface HttpClientResponse<T = any> {
  body: T;
  statusCode: number;
  headers: Record<string, string>;
}
