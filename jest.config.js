module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'],
  clearMocks: true,
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
};
