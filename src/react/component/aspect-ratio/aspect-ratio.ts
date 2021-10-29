import './aspect-ratio-magic.scss';

export function createAspectRatioStyle(aspectRatio: number): /* React.CSSProperties */ Record<never, never> {
  return { '--aspect-ratio': String(aspectRatio) };
}
