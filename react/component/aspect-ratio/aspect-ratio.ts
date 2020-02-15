import './aspect-ratio-magic.scss';

export function createAspectRatioStyle(aspectRatio: number): /* React.CSSProperties */ {} {
  return { '--aspect-ratio': String(aspectRatio) };
}
