module.exports = {
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  // roots: ['*', 'build'],
  transformIgnorePatterns: ['<rootDir>/node_modules/.*\\.js', '<rootDir>/build/.*\\.js'],
  testMatch: ['**/__test__/*\\.(ts|js|tsx|jsx)', '**/*\\.(spec|test)\\.(ts|js|tsx|jsx)'],
  collectCoverageFrom: ['**/*.(ts|tsx)', '!build/', '!**/node_modules', '!/coverage'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  coverageReporters: ['json', 'lcov', 'text', 'html'],
};
