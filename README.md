# typescript-commonutil

---

Common TypeScript code I used in multiple app.

## How to Use

1. Add this repository as a git submodule
1. `exclude` this submodule `exclude` in `tsconfig.json`
    - example: `"exclude": [ "node_modules", "lib-ts/common" ]`
    - This prevent unused dependencies from causing compile error

1. `import` required modules from your code

## License

WTFPL
