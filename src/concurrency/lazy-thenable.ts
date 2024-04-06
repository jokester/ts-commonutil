/**
 * create a lazy PromiseLike to run {@name io} at most once and only after being awaited
 * @param io
 * @return
 */
export function lazyThenable<T>(io: () => T): PromiseLike<Awaited<T>> {
  let r: null | Promise<Awaited<T>> = null;
  return {
    then<TResult1, TResult2 = never>(
      onfulfilled?: ((value: Awaited<T>) => PromiseLike<TResult1> | TResult1) | undefined | null,
      onrejected?: ((reason: any) => PromiseLike<TResult2> | TResult2) | undefined | null,
    ): PromiseLike<TResult1 | TResult2> {
      return (r ??= Promise.resolve(io())).then(onfulfilled, onrejected);
    },
  };
}
