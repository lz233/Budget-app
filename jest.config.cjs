/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/"
  },
  collectCoverageFrom: [
    "*.js",
    "!jest.config.cjs"
  ],
  coverageReporters: ["text", "lcov", "json-summary"]
};
