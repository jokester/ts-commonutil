import { useState } from 'react';
import { Either, Left, Right } from 'fp-ts/lib/Either';

export function usePromisedState<T>() {
  const [state, setState] = useState<null | Either<unknown, T>>(null);

  const setPromisedState = async (p: Promise<T>) => {
    try {
      setState(new Right(await p));
    } catch (e) {
      setState(new Left(e));
    }
  };

  return [state, setPromisedState];
}
