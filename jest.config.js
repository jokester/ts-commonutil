module.exports = {
  "transform": {
    ".(ts|tsx)": "ts-jest"
  },
  "roots": [
    "src",
    "build"
  ],
  "testMatch": [
    "**/__test__/*\\.(ts|js|tsx|jsx)",
    "**/*\\.(spec|test)\\.(ts|js|tsx|jsx)"
  ],
  "collectCoverageFrom": [
    "src/**/*.(ts|tsx)",
    "!build/",
    "!**/node_modules",
    "!/coverage"
  ],
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json"
  ],
  "coverageReporters": [
    "json",
    "lcov",
    "text",
    "html"
  ],
  "globals": {
    "ts-jest": {
      // https://kulshekhar.github.io/ts-jest/user/config/diagnostics
      "diagnostics": false,
    }
  }
}
