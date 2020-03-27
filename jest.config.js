module.exports = {
    testEnvironment: "node",
    setupFiles: ["./test/setup.ts"],
    testPathIgnorePatterns: ["/node_modules/", "<rootDir>/dist/"],
}
