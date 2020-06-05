import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  HTMLElementResolvable,
  initialCount,
  MutationCounts,
  resolveHTMLElement,
  startObserve,
} from '../../frontend/observe-dom-mutation';

export const RenderCountsToWidget: React.FC<MutationCounts> = counter => (
  <>
    attrs={counter.attributes}
    <br />
    characterData={counter.characterData}
    <br />
    childList={counter.childList}
  </>
);

const RenderCountsToConsole: React.FC<MutationCounts> = counter => {
  console.log(counter);
  return null! as React.ReactElement;
};

/**
 * A widget to observe and show DOM mutations inside {@param target}
 * @param target the HTMLElement (or its id, or its ref) to observe
 * @param out an optional HTMLElement to render report widget in. must not be within target
 * @param render
 * @constructor
 */
export const DomMutationObserver: React.FunctionComponent<{
  target: HTMLElementResolvable;
  render?: (counts: MutationCounts) => React.ReactElement;
  out?: HTMLElementResolvable;
}> = ({ target, out, render = RenderCountsToWidget }) => {
  const [counter, setCounter] = useState<MutationCounts>(initialCount);
  const realTarget = resolveHTMLElement(target);
  const realOut = resolveHTMLElement(out);

  useEffect(() => {
    if (!realTarget) return;
    return startObserve(realTarget, setCounter);
  }, [realTarget]);

  const rendered = render(counter);

  return realOut ? createPortal(rendered, realOut) : rendered;
};

/**
 * DomMutationWidget that renders to nothing and logs to console
 * @param target
 * @constructor
 */
export const DomMutationLogger: React.FunctionComponent<{ target: HTMLElementResolvable }> = ({ target }) => {
  return <DomMutationObserver target={target} render={RenderCountsToConsole as any} />;
};

/**
 * Like as {@ref DomMutationObserver}, but obtains target from rendered child (child must have ref of a HTMLElement)
 * @param children a single React.Element that returns a HTMLElement ref
 * @param out an optional HTMLElement to render report widget in. must not be within target
 * @constructor
 */
export const DomMutationObserverContainer: React.FunctionComponent<{
  children: React.ReactElement<HTMLElement>;
  render?: (counts: MutationCounts) => React.ReactElement;
  out?: HTMLElementResolvable;
}> = ({ children, out, render }) => {
  const ref = useRef<HTMLElement>();
  const [rendered, setRendered] = useState<null | React.ReactElement>(null);
  useEffect(() => {
    if (ref.current instanceof HTMLElement) {
      setRendered(<DomMutationObserver target={ref.current} out={out} render={render} />);
    } else {
      console.warn('DomMutationObserver: expected to obtain a HTMLElement ref from child. the child was', children);
    }
  });
  return (
    <>
      {React.cloneElement(children, { ref })}
      {rendered}
    </>
  );
};
