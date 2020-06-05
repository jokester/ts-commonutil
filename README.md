# ts-commonutil

---

Common TypeScript code I used in multiple app.

![Check](https://github.com/jokester/ts-commonutil/workflows/Check/badge.svg)
[![codecov](https://codecov.io/gh/jokester/ts-commonutil/branch/master/graph/badge.svg)](https://codecov.io/gh/jokester/ts-commonutil)
[![npm version](https://badge.fury.io/js/%40jokester%2Fts-commonutil.svg)](https://badge.fury.io/js/%40jokester%2Fts-commonutil)

## How to Use

```
yarn add @jokester/ts-commonutil

```

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

WTFPL
