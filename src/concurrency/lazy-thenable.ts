export function lazyThenable<T>(action: () => PromiseLike<T>): PromiseLike<T> {
  let r: null | Promise<T> = null;
  return {
    then<TResult1, TResult2 = never>(
      onfulfilled?: ((value: T) => PromiseLike<TResult1> | TResult1) | undefined | null,
      onrejected?: ((reason: any) => PromiseLike<TResult2> | TResult2) | undefined | null,
    ): PromiseLike<TResult1 | TResult2> {
      return (r ??= Promise.resolve(action())).then(onfulfilled, onrejected);
    },
  };
}
