
/**
 * lift2 f to Promise
 */
export function liftA2<T1, T2, T3>(f: (a1: T1, a2: T2) => T3) {
    async function transformed(pa1: PromiseLike<T1> | T1, pa2: PromiseLike<T2> | T2): Promise<T3> {
        const v1 = await pa1;
        const v2 = await pa2;
        return Promise.resolve(f(v1, v2));
    }

    return transformed;
}
