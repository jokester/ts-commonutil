export class LockableError extends Error {
  static A = class L2 extends LockableError {};
}

interface AutoClosable {
  close(): void;
  [Symbol.dispose](): void;
}

export abstract class Mutex<Resource extends object | true> {
  abstract lock(): AutoClosable;
  abstract unlock(): void;
  abstract tryLock(): boolean;
}
