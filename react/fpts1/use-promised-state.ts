import { useState } from 'react';
import { Either, Left, Right } from 'fp-ts/lib/Either';

export function usePromisedState<T>() {
  throw 'DO NOT USE: correctly reclaim hook with useEffect() first';
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
