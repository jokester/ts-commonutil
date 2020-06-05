# ts-commonutil

---

Common TypeScript code I used in multiple app.

![Check](https://github.com/jokester/ts-commonutil/workflows/Check/badge.svg)
[![codecov](https://codecov.io/gh/jokester/ts-commonutil/branch/master/graph/badge.svg)](https://codecov.io/gh/jokester/ts-commonutil)

## How to Use

1. Add this repository as a git submodule
2. Exclude the submodule itself in *root* tsconfig.json
    - Example: `"exclude": [ "node_modules", "vendor/submodules/ts-commonutil" ]`
    - This prevents tsc from compiling all the code (unless otherwise referenced).
3. Install dependencies
    - See [Content](#content) for xx
4. Import from this submodule

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
