function nop() {}

/**
 * Deferred: a wrapper for Promise that exposes fulfill / reject / resolved
 */
export class Deferred<T> implements PromiseLike<T> {
  private readonly _promise: Promise<T>;
  private _fulfill: (v: T) => void = nop;
  private _reject: (e: any) => void = nop;
  private _resolved = false;

  constructor(private readonly strict = false) {
    const self = this;
    this._promise = new Promise<T>((fulfill, reject) => {
      self._fulfill = (v: T) => {
        fulfill(v);
        self._resolved = true;
        self._fulfill = self._reject = nop;
      };
      self._reject = (e: any) => {
        reject(e);
        self._resolved = true;
        self._fulfill = self._reject = nop;
      };
    });
  }

  get resolved() {
    return this._resolved;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => PromiseLike<TResult1> | TResult1) | undefined | null,
    onrejected?: ((reason: any) => PromiseLike<TResult2> | TResult2) | undefined | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this._promise.then(onfulfilled, onrejected);
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

  reject(e: any) {
    if (this.strict && this._resolved) {
      throw new Error('already resolved');
    } else {
      this._reject(e);
    }
  }
}
