process.env.NODE_ENV = 'UNITTEST';
module.exports = {
  clearMocks: true,
  collectCoverage: false,
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  preset: 'ts-jest',
  setupFiles: ['./test/jestSetup'],
  setupFilesAfterEnv: ['jest-extended']
};
