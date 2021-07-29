import { Doomed } from './timing';

export const enum PromiseState {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}

interface ReplaceOptions {
  onPending?: boolean;
  onFulfilled?: boolean;
  onRejected?: boolean;
}

export class PromiseContainer<T> implements PromiseLike<T> {
  private innerPromise!: Promise<T>;
  private _state!: PromiseState;

  private _value: null | T = null;
  private _reason: unknown = null;

  constructor(initial?: T | PromiseLike<T>) {
    this.replaceInnerPromise(initial ?? Doomed);
  }

  get state(): PromiseState {
    return this._state;
  }

  isFulfilled(): this is { readonly value: T } {
    return this._state === PromiseState.fulfilled;
  }

  isRejected(): this is { readonly reason: unknown } {
    return this._state === PromiseState.rejected;
  }

  isPending(): boolean {
    return this._state === PromiseState.pending;
  }

  protected get value(): T {
    return this._value as T;
  }

  protected get reason(): unknown {
    return this._reason;
  }

  /**
   *
   * @param {(previous: Promise<T>) => PromiseLike<T>} generator
   * @param {ReplaceOptions} options
   * @returns {Promise<T>} a Promise that completes *after*  {@code this} is updated
   */
  replace(generator: (previous: PromiseLike<T>) => T | PromiseLike<T>, options: ReplaceOptions = {}): Promise<T> {
    const { onPending = false, onFulfilled = false, onRejected = true } = options;

    if (
      (onPending && this._state === PromiseState.pending) ||
      (onFulfilled && this._state === PromiseState.fulfilled) ||
      (onRejected && this._state === PromiseState.rejected)
    ) {
      return this.replaceInnerPromise(generator(this.innerPromise));
    }
    return this.innerPromise;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => PromiseLike<TResult1> | TResult1) | undefined | null,
    onrejected?: ((reason: any) => PromiseLike<TResult2> | TResult2) | undefined | null,
  ): Promise<TResult1 | TResult2> {
    return this.innerPromise.then(onfulfilled, onrejected);
  }

  private replaceInnerPromise(p: T | PromiseLike<T>): Promise<T> {
    this._state = PromiseState.pending;
    this._value = this._reason = null;
    const newInner = Promise.resolve(p);
    newInner.then(
      (v) => this.onInnerPromiseComplete(newInner, PromiseState.fulfilled, v),
      (e) => this.onInnerPromiseComplete(newInner, PromiseState.rejected, e),
    );
    return (this.innerPromise = newInner);
  }

  private onInnerPromiseComplete(innerOnStart: Promise<T>, newState: PromiseState, fulfillOrReject: any) {
    if (this.innerPromise === innerOnStart) {
      this._state = newState;
      if (newState === PromiseState.fulfilled) {
        this._value = fulfillOrReject;
        this._reason = null;
      } else if (newState === PromiseState.rejected) {
        this._value = null;
        this._reason = fulfillOrReject;
      }
    }
  }
}
