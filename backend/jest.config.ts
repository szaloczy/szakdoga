/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/**/*.d.ts",
    "!src/migration/**",
    "!src/seeds/**",
    "!src/index.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  testMatch: [
    "**/__tests__/**/*.test.{ts,js}",
    "**/?(*.)+(spec|test).{ts,js}",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/__tests__/setup.ts",
  ],
  verbose: true,
};
