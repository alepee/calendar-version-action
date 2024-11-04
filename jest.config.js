module.exports = {
    clearMocks: true,
    restoreMocks: true,
    resetMocks: true,
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    preset: 'ts-jest',
    testMatch: ['**/__tests__/**/*.test.ts']
};
