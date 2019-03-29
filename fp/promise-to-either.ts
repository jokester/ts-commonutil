import { Either, Left, Right } from 'fp-ts/lib/Either';

export async function pToEither<T>(p: PromiseLike<T> | T): Promise<Either<unknown, T>> {
  try {
    return new Right<unknown, T>(await p);
  } catch (e) {
    return new Left<unknown, T>(e);
  }
}
