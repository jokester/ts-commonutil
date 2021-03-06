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

  readonly then = this._promise.then.bind(this._promise);

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

  /**
   * complete the Deferred with a node-style callback
   * @param error
   * @param resolved
   */
  readonly completeCallback = (error: unknown, resolved: T) => {
    if (error) {
      this.reject(error);
    } else {
      this.fulfill(resolved!);
    }
  };
}

function nop() {}
