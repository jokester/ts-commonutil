import { MutableRefObject } from 'react';

export type MutationCounts = Record<MutationRecordType, number>;
export type HTMLElementResolvable = HTMLElement | MutableRefObject<HTMLElement> | null | /* id */ string | undefined;

export const initialCount = (): MutationCounts => ({ attributes: 0, characterData: 0, childList: 0 });

/**
 * @param target DOM element to observe
 * @param callback
 * @param options additional options to MutationObserver#observe()
 * @return dispose()
 */
export function startObserve(
  target: HTMLElement,
  callback: (count: MutationCounts) => void,
  options?: MutationObserverInit,
): () => void {
  const count = initialCount();
  const observer = new MutationObserver((mutationList) => {
    for (const m of mutationList) count[m.type]++;
    callback({ ...count });
  });
  observer.observe(target, { attributes: true, characterData: true, childList: true, subtree: true, ...options });
  return () => observer.disconnect();
}

export function resolveHTMLElement(maybeElem: HTMLElementResolvable): HTMLElement | null {
  return maybeElem instanceof HTMLElement
    ? maybeElem
    : typeof maybeElem === 'string'
    ? document.getElementById(maybeElem)
    : maybeElem && maybeElem.current
    ? maybeElem.current
    : null;
}
