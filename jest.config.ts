import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.tsx"],
  // e2e/ holds Playwright specs (run via `yarn e2e`, not Jest). Jest's
  // default testMatch picks up any *.spec.ts, so without this it tries to
  // import @playwright/test under Jest's own runtime and crashes per file.
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/e2e/"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};

export default config;
