
interface ToPromiseOverload {
    <R>(fun: () => R): Promise<R>;

    <A1, R>(fun: (a1: A1) => R,
        a1: A1): Promise<R>;

    <A1, A2, R>(fun: (a1: A1, a2: A2) => R,
        a1: A1, a2: A2): Promise<R>;

    <A1, A2, A3, R>(fun: (a1: A1, a2: A2, a3: A3) => R,
        a1: A1, a2: A2, a3: A3): Promise<R>;

    <A1, A2, A3, A4, R>(fun: (a1: A1, a2: A2, a3: A3, a4: A4) => R,
        a1: A1, a2: A2, a3: A3, a4: A4): Promise<R>;

    <A1, A2, A3, A4, A5, R>(fun: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => R,
        a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): Promise<R>;
}

/**
 * Methods that convert (err, result)=>void callback to promise
 *
 * NOTE not working well with overloaded functions
 * NOTE not working well with parameter names
 */
export namespace Callback2Promise {

    interface CallbackFun1<A1, R> {
        (arg1: A1, callback: (err: Error, result?: R) => void): void;
    }

    interface CallbackFun2<A1, A2, R> {
        (arg1: A1, arg2: A2, callback: (err: Error, result?: R) => void): void;
    }

    export function toPromise1<A1, R>(fun: CallbackFun1<A1, R>) {
        return (arg1: A1) => new Promise<R>((resolve, reject) => {
            fun(arg1, (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }

    /**
     * partial specialization of toPromise1 where R is void
     */
    export function toPromise1v<A1>(fun: CallbackFun1<A1, void>) {
        return toPromise1(fun);
    }

    export function toPromise2<A1, A2, R>(fun: CallbackFun2<A1, A2, R>) {
        return (arg1: A1, arg2: A2) => new Promise<R>((resolve, reject) => {
            fun(arg1, arg2, (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }

    /**
     * partial specialization of toPromise2 where R is void
     */
    export function toPromise2v<A1, A2>(fun: CallbackFun2<A1, A2, void>) {
        return toPromise2<A1, A2, void>(fun);
    }
}

/**
 * converts (foo(args) -> R) to Promise<R>
 *
 * @deprecated
 */
export const toPromise: ToPromiseOverload = function (fun: Function, /* args */) {
    const argArray = [].slice.call(arguments, 1);
    return new Promise((fulfill, reject) => {
        try {
            const result = fun.apply(null, argArray);
            fulfill(result);
        } catch (e) {
            reject(e);
        }
    });
};

type MaybePromise<T> = T | Promise<T>;

/**
 *
 */
interface LiftPromiseOverload {
    <R>(fun: () => R, thisArg?: any):
        () => Promise<R>;

    <A1, R>(fun: (a1: A1) => R, thisArg?: any):
        (a1: MaybePromise<A1>) => Promise<R>;

    <A1, A2, R>(fun: (a1: A1, a2: A2) => R, thisArg?: any):
        (a1: MaybePromise<A1>, a2: MaybePromise<A2>) => Promise<R>;


    <A1, A2, A3, R>(fun: (a1: A1, a2: A2, a3: A3) => R, thisArg?: any):
        (a1: MaybePromise<A1>, a2: MaybePromise<A2>,
            a3: MaybePromise<A3>) => Promise<R>;

    <A1, A2, A3, A4, R>(fun: (a1: A1, a2: A2, a3: A3, a4: A4) => R, thisArg?: any):
        (a1: MaybePromise<A1>, a2: MaybePromise<A2>,
            a3: MaybePromise<A3>, a4: MaybePromise<A4>) => Promise<R>;

    <A1, A2, A3, A4, A5, R>(fun: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => R, thisArg?: any):
        (a1: MaybePromise<A1>, a2: MaybePromise<A2>,
            a3: MaybePromise<A3>, a4: MaybePromise<A4>, a5: MaybePromise<A5>) => Promise<R>;

    /**
     * Stopping here:
     * liftPromise actually worksfor arity > 5 , but such functions are rarely seen
     */
}

/**
 * Lift a function's argument and return value to Promise
 */
export const liftPromise: LiftPromiseOverload = function (fun: Function, thisArg?: any) {
    return function (/* promised args */) {
        const args: MaybePromise<any>[] = [].slice.call(arguments);
        return Promise.all(args).then(gotAwaits => fun.apply(thisArg, gotAwaits));
    };
};
