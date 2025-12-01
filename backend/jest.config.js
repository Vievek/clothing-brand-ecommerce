export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],

  // Use babel-jest to transform JS files
  transform: {
    "^.+\\.js$": "babel-jest",
  },

  // CORRECTED: moduleNameMapper instead of moduleNameMapping
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  collectCoverageFrom: ["src/**/*.js", "!src/server.js", "!src/scripts/**"],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Set environment variables for tests
  setupFiles: ["dotenv/config"],
};
