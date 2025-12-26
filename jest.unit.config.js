// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
process.env.NODE_ENV = 'UNITTEST';
module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    './src/**/*.{ts,tsx}',
    '!./src/**/index.ts',
    '!./src/model/**/*.ts',
    '!./src/app.ts',
    '!./src/app-config.ts',
    '!./src/http-request-context.ts',
    '!./src/server.ts'
  ],
  coverageDirectory: '<rootDir>/test/coverage',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testResultsProcessor: 'jest-sonar-reporter',
  preset: 'ts-jest',
  setupFiles: ['./test/jestSetup'],
  setupFilesAfterEnv: ['jest-extended']
};
