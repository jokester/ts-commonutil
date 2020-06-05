import { Multiset } from '../collection/multiset';
import { DefaultMap } from '../collection/default-map';

interface TopologicalLayer<T> {
  rank: number;
  edges: { from: T; to: readonly T[] }[];
}

const empty: readonly never[] = [];

export function* topologicalSort<T>(edges: Iterable<[T, T]>, throwOnLoop = true): Generator<TopologicalLayer<T>> {
  const inDegreeMap = new Multiset<T>();
  const edgesMap = new DefaultMap<T, T[]>(_ => []);

  for (const [from, to] of edges) {
    inDegreeMap.touch(from);
    inDegreeMap.setCount(to, 1 + inDegreeMap.getCount(to));
    edgesMap.getOrCreate(from).push(to);
  }

  for (let rank = 0; ; ++rank) {
    const topMost = inDegreeMap.findByCount(0);

    /**
     * when loop exists, this prevents infinite loop (but yields incomplete result)
     */
    if (!topMost.length) break;

    yield {
      rank,
      edges: topMost.map(from => ({ from, to: edgesMap.get(from) || [] })),
    };

    for (const from of topMost) {
      for (const to of edgesMap.get(from) || empty) {
        inDegreeMap.setCount(to, inDegreeMap.getCount(to) - 1);
      }
      inDegreeMap.delete(from);
      edgesMap.delete(from);
    }
  }
  if (throwOnLoop && edgesMap.size) {
    throw new Error('topologicalSort(): loop found');
  }
}
