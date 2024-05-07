/**
 * create a lazy PromiseLike to run {@name io} at most once and only after being awaited
 * @param io
 * @return
 */
export function lazyThenable<T>(io: () => T): LazyThenable<Awaited<T>> {
  let r: null | Promise<Awaited<T>> = null;
  return {
    get executed(): boolean {
      return r !== null;
    },
    then(onfulfilled, onrejected): PromiseLike<any> {
      return (r ??= Promise.resolve(io())).then(onfulfilled, onrejected);
    },
  };
}

interface LazyThenable<T> extends PromiseLike<T> {
  get executed(): boolean;
}
