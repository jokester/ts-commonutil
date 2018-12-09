function nop() {
}

/**
 * Deferred: a wrapper for Promise that exposes fulfill / reject / resolved
 */
export class Deferred<T> {
  private readonly _promise: Promise<T>;
  private readonly _fulfill!: (v: T) => void;
  private readonly _reject!: (e: any) => void;
  readonly resolved = false;

  constructor(private readonly strict = false) {
    const self = this as any;
    this._promise = new Promise<T>((fulfill, reject) => {
      self._fulfill = (v: T) => {
        fulfill(v);
        self.resolved = true;
        self._fulfill = self._reject = nop;
      };
      self._reject = (e: any) => {
        reject(e);
        self.resolved = true;
        self._fulfill = self._reject = nop;
      };
    });
  }

  toPromise() {
    return this._promise;
  }

  follow(pv: PromiseLike<T>) {
    pv.then(this._fulfill, this._reject);
  }

  /**
   * NOTE v must be a value
   * @param v the value
   */
  fulfill(v: T) {
    if (this.strict && this.resolved) {
      throw new Error("already resolved");
    } else {
      this._fulfill(v);
    }
  }

  reject(e: any) {
    if (this.strict && this.resolved) {
      throw new Error("already resolved");
    } else {
      this._reject(e);
    }
  }
}
