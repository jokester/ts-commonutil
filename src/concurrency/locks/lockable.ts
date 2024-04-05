import { ResourcePool } from '../resource-pool';

export class LockableError extends Error {
  static A = class L2 extends LockableError {};
}

export interface Lease<T> {
  value: T;
  // close(): Promise<void>;
  [Symbol.asyncDispose](): Promise<void>;
}
