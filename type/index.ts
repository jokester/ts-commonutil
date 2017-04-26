/**
 * Type transformers and etc
 */

/**
 * Known problems:
 * 
 * Builtin types, like Function and RegExp, may be incorrectly mapped.
 * 
 */
type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>
}

/**
 * Cast a value to its DeepReadonly<T> type
 * 
 * @export
 * @template T
 * @param {T} arg
 * @returns
 */
export function deepFreeze<T>(arg: T) {
    return arg as any as DeepReadonly<T>
}

export function freeze<T>(arg: T) {
    return arg as Readonly<T>
}

interface ToPromiseOverload {
    <R>(fun: () => R): Promise<R>

    <A1, R>(fun: (a1: A1) => R,
        a1: A1): Promise<R>

    <A1, A2, R>(fun: (a1: A1, a2: A2) => R,
        a1: A1, a2: A2): Promise<R>

    <A1, A2, A3, R>(fun: (a1: A1, a2: A2, a3: A3) => R,
        a1: A1, a2: A2, a3: A3): Promise<R>

    <A1, A2, A3, A4, R>(fun: (a1: A1, a2: A2, a3: A3, a4: A4) => R,
        a1: A1, a2: A2, a3: A3, a4: A4): Promise<R>

    <A1, A2, A3, A4, A5, R>(fun: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => R,
        a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): Promise<R>
}

/**
 * converts (foo(args) -> R) to Promise<R>
 * 
 * @deprecated
 */
export const toPromise: ToPromiseOverload = function (fun: Function, /* args */) {
    const argArray = [].slice.call(arguments, 1)
    return new Promise((fulfill, reject) => {
        try {
            const result = fun.apply(null, argArray)
            fulfill(result)
        } catch (e) {
            reject(e)
        }
    })
}

type MaybePromise<T> = T | Promise<T>

/**
 * 
 */
interface LiftPromiseOverload {
    <R>(fun: () => R, thisArg?: any):
        () => Promise<R>

    <A1, R>(fun: (a1: A1) => R, thisArg?: any):
        (a1: MaybePromise<A1>) => Promise<R>

    <A1, A2, R>(fun: (a1: A1, a2: A2) => R, thisArg?: any):
        (a1: MaybePromise<A1>, a2: MaybePromise<A2>) => Promise<R>


    <A1, A2, A3, R>(fun: (a1: A1, a2: A2, a3: A3) => R, thisArg?: any):
        (a1: MaybePromise<A1>, a2: MaybePromise<A2>,
            a3: MaybePromise<A3>) => Promise<R>

    <A1, A2, A3, A4, R>(fun: (a1: A1, a2: A2, a3: A3, a4: A4) => R, thisArg?: any):
        (a1: MaybePromise<A1>, a2: MaybePromise<A2>,
            a3: MaybePromise<A3>, a4: MaybePromise<A4>) => Promise<R>

    <A1, A2, A3, A4, A5, R>(fun: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => R, thisArg?: any):
        (a1: MaybePromise<A1>, a2: MaybePromise<A2>,
            a3: MaybePromise<A3>, a4: MaybePromise<A4>, a5: MaybePromise<A5>) => Promise<R>

    /**
     * I'm stopping here:
     * liftPromise works for arity > 5 actually, but such functions are rarely seen
     */
}

/**
 * Lift a function's argument and return value to Promise
 */
export const liftPromise: LiftPromiseOverload = function (fun: Function, thisArg?: any) {
    return async function (/* promised args */) {
        const args: MaybePromise<any>[] = [].slice.call(arguments)
        const awaitedArgs = await Promise.all(args)
        return fun.apply(thisArg, awaitedArgs)
    }
}