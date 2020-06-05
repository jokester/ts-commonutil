import { topologicalSort } from './topological-sort';

describe('topologicalSort', () => {
  it('do topology sort', () => {
    expect(
      Array.from(
        topologicalSort([
          [1, 2],
          [2, 3],
          [2, 4],
          [3, 4],
        ]),
      ),
    ).toEqual([
      {
        rank: 0,
        edges: [{ from: 1, to: [2] }],
      },
      {
        rank: 1,
        edges: [{ from: 2, to: [3, 4] }],
      },
      {
        rank: 2,
        edges: [{ from: 3, to: [4] }],
      },
      { rank: 3, edges: [{ from: 4, to: [] }] },
    ]);
  });

  it('detects loop in edges', () => {
    expect(() =>
      Array.from(
        topologicalSort(
          [
            [1, 2],
            [2, 1],
          ],
          true,
        ),
      ),
    ).toThrowError(/loop/);
  });
});
