# ts-commonutil

---

Common TypeScript code I used in multiple app.

[![CircleCI](https://circleci.com/gh/jokester/ts-commonutil.svg?style=svg)](https://circleci.com/gh/jokester/ts-commonutil)
[![codecov](https://codecov.io/gh/jokester/ts-commonutil/branch/master/graph/badge.svg)](https://codecov.io/gh/jokester/ts-commonutil)

## How to Use

1. Add this repository as a git submodule
2. Copy or symlink required files to anywhere appropriate
    - if the submodule causes compile error, try set `"exclude": [ "node_modules", "lib-ts/common" ]` in `tsconfig.json`

## Content

### Algebra

- Array monad
- Fast multiplication on monoid

### Algorithm / Graph

- Directed graph

### IO

(node.js only) Promised version of file IO functions.

### Concurrency Control

- Mutex
- Resource Pool

### Type



## License

WTFPL
