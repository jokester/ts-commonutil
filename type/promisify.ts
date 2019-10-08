/**
 * Transform (err, result)=>void callback to promise
 *
 * NOTE: not working well with overloaded functions
 * NOTE: not working well with parameter names
 */
namespace Callback2Promise {
  export interface CallbackFun1<A1, R> {
    (arg1: A1, callback: (err: Error, result?: R) => void): void;
  }

  export interface PromiseFun1<A1, R> {
    (arg1: A1): Promise<R>;
  }

  interface CallbackFun2<A1, A2, R> {
    (arg1: A1, arg2: A2, callback: (err: Error, result?: R) => void): void;
  }

  export function toPromise1<A1, R = void>(fun: CallbackFun1<A1, R>) {
    return (arg1: A1) =>
      new Promise<R>((resolve, reject) => {
        fun(arg1, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
  }

  export function toPromise2<A1, A2, R = void>(fun: CallbackFun2<A1, A2, R>) {
    return (arg1: A1, arg2: A2) =>
      new Promise<R>((resolve, reject) => {
        fun(arg1, arg2, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
  }

  export const toPromise0 = toPromise1 as <T>(fun: CallbackFun1<void, void>) => PromiseFun1<void, void>;
}

export const toPromise0 = Callback2Promise.toPromise0;
export const toPromise1 = Callback2Promise.toPromise1;
export const toPromise2 = Callback2Promise.toPromise2;

namespace WIP {
  interface Callback<R> {
    (err: Error, result: R): void;
  }

  interface CallbackAPI<R, A1 = void, A2 = void> {
    (arg1: A1, arg2: A2, callback: Callback<R>): void;
  }

  export function toPromise<R, A1 = void, A2 = void>(origApi: CallbackAPI<R, A1, A2>) {
    return function(a1: A1, a2: A2) {
      return new Promise<R>((fulfill, reject) => {
        origApi(a1, a2, (err, result) => {
          if (err) reject(err);
          else fulfill(result);
        });
      });
    };
  }
}

type MaybePromise<T> = T | Promise<T>;

/**
 *
 */
// eslint: disable
interface LiftPromiseOverload {
  <R>(fun: () => R, thisArg?: any): () => Promise<R>;

  <A1, R>(fun: (a1: A1) => R, thisArg?: any): (a1: MaybePromise<A1>) => Promise<R>;

  <A1, A2, R>(fun: (a1: A1, a2: A2) => R, thisArg?: any): (a1: MaybePromise<A1>, a2: MaybePromise<A2>) => Promise<R>;

  <A1, A2, A3, R>(fun: (a1: A1, a2: A2, a3: A3) => R, thisArg?: any): (
    a1: MaybePromise<A1>,
    a2: MaybePromise<A2>,
    a3: MaybePromise<A3>,
  ) => Promise<R>;

  <A1, A2, A3, A4, R>(fun: (a1: A1, a2: A2, a3: A3, a4: A4) => R, thisArg?: any): (
    a1: MaybePromise<A1>,
    a2: MaybePromise<A2>,
    a3: MaybePromise<A3>,
    a4: MaybePromise<A4>,
  ) => Promise<R>;

  <A1, A2, A3, A4, A5, R>(fun: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => R, thisArg?: any): (
    a1: MaybePromise<A1>,
    a2: MaybePromise<A2>,
    a3: MaybePromise<A3>,
    a4: MaybePromise<A4>,
    a5: MaybePromise<A5>,
  ) => Promise<R>;

  /**
   * Stopping here:
   * liftPromise actually worksfor arity > 5 , but such functions are rarely seen
   */
}
// eslint: enable

/**
 * Lift a function's argument and return value to Promise
 */
export const liftPromise: LiftPromiseOverload = function(fun: Function, thisArg?: any) {
  return function(/* promised args */) {
    const args: MaybePromise<any>[] = [].slice.call(arguments);
    return Promise.all(args).then(gotAwaits => fun.apply(thisArg, gotAwaits));
  };
};
