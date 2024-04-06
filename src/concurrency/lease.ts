/**
 * An acquired lock or resource
 */
export interface Lease<T> {
  value: T;
  dispose(): PromiseLike<void>;
  [Symbol.asyncDispose](): PromiseLike<void>;
}
