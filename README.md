# ts-commonutil

---

Common TypeScript code I used in multiple app.

[![CircleCI](https://circleci.com/gh/jokester/ts-commonutil.svg?style=svg)](https://circleci.com/gh/jokester/ts-commonutil)
[![codecov](https://codecov.io/gh/jokester/ts-commonutil/branch/master/graph/badge.svg)](https://codecov.io/gh/jokester/ts-commonutil)

## How to Use

1. Add this repository as a git submodule
1. `exclude` this submodule `exclude` in `tsconfig.json`
    - example: `"exclude": [ "node_modules", "lib-ts/common" ]`
    - This prevent unused dependencies from causing compile error
1. `import` required modules from your code

## Content

### Algebra

- Array monad
- Fast multiplication on monoid

### Algorithm / Graph

- Directed graph

###

### IO

(node.js only) Promised version of file IO functions.

### Concurrency Control

- Mutex

### Type



## License

WTFPL
