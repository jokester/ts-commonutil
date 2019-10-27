import { useState, useEffect, useRef } from 'react';

export function usePrev<T>(value: T, ignoreUnchanged = true) {
  const ref = useRef(value);

  useEffect(
    () => {
      ref.current = value;
    },
    ignoreUnchanged
      ? [value] // when the value (the identity) changes
      : undefined, // whenever call site component runs (cant think of a valid use case ATM but who knows)
  );

  return ref.current;
}
