/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  "testMatch": [
    "**/__tests__/*.spec.ts"
  ],
  "testPathIgnorePatterns": [
    "/node_modules/"
  ]
};