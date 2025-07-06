/**
 * Jest Setup File
 * Global configuration and mocks for testing environment
 */

// Global test setup
global.console = {
  ...console,
  // Suppress console.log in tests unless explicitly needed
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock performance API for Node.js environment
if (typeof performance === 'undefined') {
  global.performance = {
    now: () => Date.now()
  };
}

// Mock localStorage for frontend tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage for frontend tests
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Extend Jest matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },

  toBeValidSUSScore(received) {
    const pass = typeof received === 'number' && received >= 0 && received <= 100;
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid SUS score`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid SUS score (0-100)`,
        pass: false,
      };
    }
  },

  toHaveValidSUSInterpretation(received) {
    const validRatings = ['Excellent', 'Good', 'OK', 'Poor', 'Invalid'];
    const validAcceptability = ['Acceptable', 'Marginal', 'Not Acceptable', 'Invalid'];
    const validGrades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];

    const hasValidStructure = received &&
      typeof received === 'object' &&
      'adjectiveRating' in received &&
      'acceptability' in received &&
      'grade' in received &&
      'percentileRank' in received;

    const hasValidValues = hasValidStructure &&
      validRatings.includes(received.adjectiveRating) &&
      validAcceptability.includes(received.acceptability) &&
      validGrades.includes(received.grade) &&
      typeof received.percentileRank === 'number' &&
      received.percentileRank >= 0 &&
      received.percentileRank <= 100;

    if (hasValidValues) {
      return {
        message: () => `expected ${JSON.stringify(received)} not to have valid SUS interpretation`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${JSON.stringify(received)} to have valid SUS interpretation structure and values`,
        pass: false,
      };
    }
  }
});

// Set test timeout
jest.setTimeout(10000);

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global test utilities
global.testUtils = {
  // Helper to create mock SUS responses
  createMockSUSResponses: (pattern = 'mixed') => {
    switch (pattern) {
      case 'all_agree':
        return {
          q1: 4, q2: 4, q3: 4, q4: 4, q5: 4,
          q6: 4, q7: 4, q8: 4, q9: 4, q10: 4
        };
      case 'optimal':
        return {
          q1: 5, q2: 1, q3: 5, q4: 1, q5: 5,
          q6: 1, q7: 5, q8: 1, q9: 5, q10: 1
        };
      case 'minimal':
        return {
          q1: 1, q2: 1, q3: 1, q4: 1, q5: 1,
          q6: 1, q7: 1, q8: 1, q9: 1, q10: 1
        };
      case 'mixed':
      default:
        return {
          q1: 4, q2: 2, q3: 5, q4: 1, q5: 3,
          q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
        };
    }
  },

  // Helper to create random valid SUS responses
  createRandomSUSResponses: () => {
    const responses = {};
    for (let i = 1; i <= 10; i++) {
      responses[`q${i}`] = Math.floor(Math.random() * 5) + 1;
    }
    return responses;
  },

  // Helper to create invalid SUS responses for testing edge cases
  createInvalidSUSResponses: (type = 'out_of_range') => {
    switch (type) {
      case 'out_of_range':
        return {
          q1: 6, q2: 0, q3: 5, q4: 1, q5: 3,
          q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
        };
      case 'missing_questions':
        return {
          q1: 4, q2: 2, q3: 5, q4: 1, q5: 3
          // q6-q10 missing
        };
      case 'wrong_types':
        return {
          q1: 'invalid', q2: null, q3: undefined, q4: {}, q5: [],
          q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
        };
      case 'extreme_values':
        return {
          q1: 999, q2: -999, q3: Infinity, q4: -Infinity, q5: NaN,
          q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
        };
      default:
        return null;
    }
  },

  // Helper to validate SUS score calculation manually
  calculateSUSScoreManually: (responses) => {
    if (!responses || typeof responses !== 'object') return 0;
    
    let totalScore = 0;
    let hasAllQuestions = true;
    
    for (let i = 1; i <= 10; i++) {
      const value = parseInt(responses[`q${i}`]);
      
      if (isNaN(value) || value < 1 || value > 5) {
        hasAllQuestions = false;
        break;
      }
      
      if (i % 2 === 1) {
        // Odd questions: (response - 1) * 2.5
        totalScore += (value - 1) * 2.5;
      } else {
        // Even questions: (5 - response) * 2.5
        totalScore += (5 - value) * 2.5;
      }
    }
    
    return hasAllQuestions ? totalScore : 0;
  }
};

console.log('Jest setup completed successfully'); 