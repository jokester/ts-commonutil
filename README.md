# ts-commonutil

---

Common TypeScript code I used in multiple app.

[![CircleCI](https://circleci.com/gh/jokester/ts-commonutil.svg?style=svg)](https://circleci.com/gh/jokester/ts-commonutil)
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

### Algebra

- Fast multiplication on monoid

### Algorithm / Graph

- Directed graph

### IO

(node.js only) Promised version of file IO functions.

### Logging

- for any js environment: loglevel logger
    - requires `loglevel
- for nodejs: winston logger

### Concurrency Control

- Resource Pool
- Mutex
    - effectively a 

### Type Computation

## 


## License

WTFPL
