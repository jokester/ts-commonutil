export class MutexError extends Error {
  static AcquireTimeout = class AcquireTimeout extends MutexError {};
  static IllegalArgument = class IllegalArgument extends MutexError {};
}

export class AcquireTimeoutError extends MutexError {}
export class TemporaryFailError extends MutexError {}
export class LockInconsistencyError extends MutexError {}
export class IllegalArgumentError extends MutexError {}

export abstract class AbstractMutex {
  // abstract acquire(): Promise<void>;
  // abstract release(): Promise<void>;
  // abstract refresh(): Promise<void>;
  abstract withLock<T>(io: () => PromiseLike<T>): Promise<Lock>;
}
