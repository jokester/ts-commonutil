import { autorun, IReactionDisposer } from 'mobx';
import { useEffect, useRef, useState } from 'react';

export function useDerived<T>(foo: () => T): T {
  const [count, setCount] = useState(0);

  const valueRef = useRef<T>();
  const disposeRef = useRef<IReactionDisposer>();

  if (!disposeRef.current) {
    disposeRef.current = autorun(() => {
      const prevValue = valueRef.current;
      const newValue = (valueRef.current = foo());
      if (/* after first rendering */ disposeRef.current && !Object.is(prevValue, newValue)) {
        setCount((_) => _ + 1);
      }
    });
  }

  useEffect(() => disposeRef.current, []);

  return valueRef.current!;
}
