/**
 * Deferred: a wrapper for Promise that exposes fulfill / reject / resolved
 */
export class Deferred<T> implements PromiseLike<T> {
  #fulfill: (v: T | PromiseLike<T>) => void = nop;
  #reject: (e: any) => void = nop;
  #resolved: boolean = false;

  static fromCallback<T>(
    creator: (callback: (error: unknown, value: T) => void) => void,
    strict?: boolean,
  ): Deferred<T> {
    const d = new Deferred<T>(strict);
    try {
      creator(d.completeCallback);
    } catch (e) {
      d.reject(e);
    }
    return d;
  }

  private readonly _promise = new Promise<T>((fulfill, reject) => {
    this.#fulfill = (v: T | PromiseLike<T>) => {
      fulfill(v);
      this.#resolved = true;
      this.#fulfill = this.#reject = nop;
    };
    this.#reject = (e: unknown) => {
      reject(e);
      this.#resolved = true;
      this.#fulfill = this.#reject = nop;
    };
  });

  constructor(private readonly strict = false) {}

  get resolved(): boolean {
    return this.#resolved;
  }

  readonly then = this._promise.then.bind(this._promise);

  /**
   * @param v the value
   */
  readonly fulfill = (v: T | PromiseLike<T>): void => {
    if (this.strict && this.#resolved) {
      throw new Error('already resolved');
    } else {
      this.#fulfill(v);
    }
  };

  readonly reject = (e: unknown): void => {
    if (this.strict && this.#resolved) {
      throw new Error('already resolved');
    } else {
      this.#reject(e);
    }
  };

  /**
   * complete the Deferred with a node-style callback
   * @param error
   * @param resolved
   */
  readonly completeCallback = (error: unknown, resolved: T): void => {
    if (error) {
      this.reject(error);
    } else {
      this.fulfill(resolved!);
    }
  };
}

function nop() {}
