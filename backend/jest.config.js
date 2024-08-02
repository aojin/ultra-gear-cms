module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  setupFiles: ["<rootDir>/jest.setup.js"], // Path to the setup file
  globalTeardown: "<rootDir>/jest.global-teardown.js", // Optional: if you use global teardown
};
