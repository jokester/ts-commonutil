function nop() {}

/**
 * Deferred: a wrapper for Promise that exposes fulfill / reject / resolved
 */
export class Deferred<T> implements PromiseLike<T> {
  private _fulfill: (v: T) => void = nop;
  private _reject: (e: any) => void = nop;
  private _resolved = false;

  private readonly _promise = new Promise<T>((fulfill, reject) => {
    this._fulfill = (v: T) => {
      fulfill(v);
      this._resolved = true;
      this._fulfill = this._reject = nop;
    };
    this._reject = (e: unknown) => {
      reject(e);
      this._resolved = true;
      this._fulfill = this._reject = nop;
    };
  });

  constructor(private readonly strict = false) {}

  get resolved() {
    return this._resolved;
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => PromiseLike<TResult1> | TResult1) | undefined | null,
    onRejected?: ((reason: unknown) => PromiseLike<TResult2> | TResult2) | undefined | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this._promise.then(onFulfilled, onRejected);
  }

  /**
   * @param v the value
   */
  fulfill(v: T) {
    if (this.strict && this._resolved) {
      throw new Error('already resolved');
    } else {
      this._fulfill(v);
    }
  }

  reject(e: unknown) {
    if (this.strict && this._resolved) {
      throw new Error('already resolved');
    } else {
      this._reject(e);
    }
  }
}
