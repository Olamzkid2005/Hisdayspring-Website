import type { Config } from "jest";

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  transform: {
    // Deliberately not named babel.config.js: Next.js treats a root-level
    // babel.config.js as "use Babel instead of SWC" and every cold build then
    // compiles through Babel, which roughly doubles deploy time. Nothing but
    // Jest should see this file, so it is named and referenced explicitly.
    "^.+\\.(ts|tsx)$": ["babel-jest", { configFile: "./babel.config.jest.js" }],
  },
};

export default config;
