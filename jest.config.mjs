/** @type {import('jest').Config} */
export default {
    preset: "ts-jest",
    testEnvironment: "node",
    projects: [
        {
            displayName: "unit",
            preset: "ts-jest",
            testEnvironment: "node",
            moduleNameMapper: {
                // Only apply to src files, not node_modules (Zod 4 compatibility)
                "^(\\.\\./.*)\\.js$": "$1",
                "^(\\./.*)\\.js$": "$1",
            },
            roots: ["<rootDir>/tests", "<rootDir>/src/wrapper"],
            testPathIgnorePatterns: ["/tests/wire/"],
            setupFilesAfterEnv: [],
        },
        ,
        {
            displayName: "wire",
            preset: "ts-jest",
            testEnvironment: "node",
            moduleNameMapper: {
                // Only apply to src files, not node_modules (Zod 4 compatibility)
                "^(\\.\\./.*)\\.js$": "$1",
                "^(\\./.*)\\.js$": "$1",
            },
            roots: ["<rootDir>/tests/wire"],
            setupFilesAfterEnv: ["<rootDir>/tests/mock-server/setup.ts"],
        },
    ],
    workerThreads: false,
    passWithNoTests: true,
};
