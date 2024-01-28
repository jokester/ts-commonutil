import { AbstractMutex, IllegalArgumentError, MutexError } from "./mutex";
import { Bucket, File } from '@google-cloud/storage';
import debug from 'debug';

const log = debug('ts-commonutil:gcp-mutex');

interface LockOptions {
  acquireTimeout?: number;
  refreshInterval?: number;
  lockTimeout?: number;
}

enum LockState {
  ACQUIRED = 0,
  IN_OPERATION = 1,
  RELEASED,
}

export async function _tryRequire(f: File) {}

type MutexState = {state: LockState.IN_OPERATION | LockState.RELEASED} | {state: LockState.ACQUIRED, timer: NodeJS.Timeout}

type SafeMutexState = MutexState & { inOperation: false };

function assertX(s: MutexState): s is SafeMutexState {
  if (s.inOperation) {
    throw new MutexError.IllegalArgument(`Mutex is in operation`);
  }
  return true
}

/**
 * see @google-cloud/storage
 */
export class GcsMutex extends AbstractMutex {
  private readonly keyFile: File;

  private _state: MutexState = {
    acquired: false,
    inOperation: false
  };

  constructor(
    bucket: Bucket,
    private readonly _key: string,
  ) {
    super();
    this.keyFile = bucket.file(_key);
  }

  private acquire(): Promise<void> {
    const s = assertX(this._state)
    if (this._state.) {
      throw new IllegalArgumentError(`Lock already acquired`);
    }
    this._state = {
      inOperation: true,
      acquired: false,
    }

    return Promise.resolve(undefined);
  }

  withLock<T>(io: () => PromiseLike<T>): Promise<Lock> {
    return Promise.resolve(undefined);
  }

  private x(): x {}
}
