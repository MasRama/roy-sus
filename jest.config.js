/**
 * Jest Configuration for SUS Score Testing
 * Supports both backend TypeScript and frontend JavaScript testing
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Test files patterns
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/tests/**/*.test.js'
  ],

  // Module file extensions
  moduleFileExtensions: ['js', 'ts', 'json'],

  // Transform files
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest'
  },

  // Module name mapping for absolute imports
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@resources/(.*)$': '<rootDir>/resources/$1'
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'app/services/SUSService.ts',
    'app/controllers/QuestionnaireController.ts',
    'app/controllers/AdminController.ts',
    'resources/js/utils/susCalculator.js',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    './app/services/SUSService.ts': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html'],

  // Test timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Error on deprecated features
  errorOnDeprecated: true,

  // Globals
  globals: {
    'ts-jest': {
      tsconfig: {
        target: 'es2020',
        module: 'commonjs',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true
      }
    }
  },

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/public/'
  ],

  // Module paths
  modulePaths: ['<rootDir>'],

  // Preset for TypeScript
  preset: 'ts-jest'
}; 