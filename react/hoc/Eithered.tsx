import React from 'react';
import { Either } from 'fp-ts/lib/Either';

interface Props<L, R> {
  either: Either<L, R>;
  renderLeft?(v: L): React.ReactNode;
  renderRight?(v: R): React.ReactNode;
}

const nop = () => null;
export function Eithered<R, L = any>(props: Props<L, R>): React.ReactElement {
  const { either, renderLeft = nop, renderRight = nop } = props;
  return (either.fold(renderLeft, renderRight) || null) as React.ReactElement;
}
