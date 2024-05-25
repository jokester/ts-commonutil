import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  HTMLElementResolvable,
  initialCount,
  MutationCounts,
  resolveHTMLElement,
  startObserve,
} from '../../web/observe-dom-mutation';

export const RenderCountsToWidget: React.FC<MutationCounts> = (counter) => (
  <>
    attrs={counter.attributes}
    <br />
    characterData={counter.characterData}
    <br />
    childList={counter.childList}
  </>
);

const RenderCountsToConsole: React.FC<MutationCounts> = (counter) => {
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
