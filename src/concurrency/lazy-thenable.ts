/**
 * create a lazy, at-most-once PromiseLike from async function
 * @param io
 */
export function lazyThenable<T>(io: () => PromiseLike<T>): PromiseLike<T> {
  let r: null | Promise<T> = null;
  return {
    then<TResult1, TResult2 = never>(
      onfulfilled?: ((value: T) => PromiseLike<TResult1> | TResult1) | undefined | null,
      onrejected?: ((reason: any) => PromiseLike<TResult2> | TResult2) | undefined | null,
    ): PromiseLike<TResult1 | TResult2> {
      return (r ??= Promise.resolve(io())).then(onfulfilled, onrejected);
    },
  };
}
