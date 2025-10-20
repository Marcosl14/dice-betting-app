import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts", "<rootDir>/src/**/*.test.ts"],
  clearMocks: true,
  setupFiles: ["reflect-metadata"],

  coverageProvider: "v8",

  collectCoverage: true,
  coverageReporters: ["text", "lcov"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.test.ts"],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 65,
      lines: 65,
      statements: 65,
    },
  },
};

export default config;
