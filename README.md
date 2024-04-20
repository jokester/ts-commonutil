# ts-commonutil

---

Simply and generic TypeScript utils.

![Check](https://github.com/jokester/ts-commonutil/workflows/Check/badge.svg)
[![codecov](https://codecov.io/gh/jokester/ts-commonutil/graph/badge.svg?token=95f53H027x)](https://codecov.io/gh/jokester/ts-commonutil)
[![npm version](https://badge.fury.io/js/%40jokester%2Fts-commonutil.svg)](https://badge.fury.io/js/%40jokester%2Fts-commonutil)

## How to Use

install `@jokester/ts-commonutil` from NPM.

## Not included but my go-to libraries

- LRU: [lru-cache](https://www.npmjs.com/package/lru-cache)
- fp: [fp-ts](https://www.npmjs.com/package/fp-ts)
- React hooks
  - [foxact](https://foxact.skk.moe/)

## Content

### Algorithm / Graph

- Fast multiplication on monoid
- Directed graph

### nodejs only

- fs: promised version of node `fs` module
- subprocess: start subprocess and capture stdout/stderr

### Logging

- console-logger
- loglevel-logger
    - requires `loglevel` `@types/loglevel`
- `winston-logger` (nodejs only)
    - requires `winston` `@types/winston`

### Concurrency Control

- Resource Pool

### Text

### Type Computation

- deepFreeze

### Util

- LRU cache

## License

MIT
