function LiftPromiseArray<T>(from: Promise<T>[]): Promise<T[]> {
    return Promise.all(from);
}

/**
 * lift2 f to Promise
 */
export function liftA2<T1, T2, T3>(f: (a1: T1, a2: T2) => T3) {
    async function transformed(pa1: Promise<T1> | T1, pa2: Promise<T2> | T2): Promise<T3> {
        const v1 = await pa1;
        const v2 = await pa2;
        return Promise.resolve(f(v1, v2));
    }
    return transformed;
}

/**
 * Methods that convert (err, result)=>void callback to promise
 *
 * NOTE not working well with overloaded functions
 * NOTE not working well with parameter names
 */
export namespace Promisify {

    interface CallbackFun1<A1, R> {
        (arg1: A1, callback: (err?: Error, result?: R) => void): void;
    }

    interface CallbackFun2<A1, A2, R> {
        (arg1: A1, arg2: A2, callback: (err?: Error, result?: R) => void): void;
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
