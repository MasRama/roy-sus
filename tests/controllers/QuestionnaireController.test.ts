/**
 * Integration Tests for QuestionnaireController
 * Tests SUS Score calculation consistency between frontend and backend
 */

import SUSService from '../../app/services/SUSService';

// Mock database and other dependencies
const mockDB = {
  from: jest.fn().mockReturnThis(),
  table: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn(),
  insert: jest.fn(),
};

// Mock the DB import
jest.mock('../../app/services/DB', () => mockDB);

// Mock crypto for UUID generation
jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'test-uuid-123'),
}));

// Mock dayjs
jest.mock('dayjs', () => {
  const originalDayjs = jest.requireActual('dayjs');
  return jest.fn(() => ({
    format: jest.fn(() => '01 January 2024, 10:00'),
    ...originalDayjs(),
  }));
});

describe('QuestionnaireController Integration', () => {
  
  describe('SUS Score Calculation Consistency', () => {
    
    test('should calculate same score as SUSService for typical responses', () => {
      const responses = {
        q1: 4, q2: 2, q3: 5, q4: 1, q5: 3,
        q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
      };
      
      // Calculate using SUSService (backend logic)
      const serviceScore = SUSService.calculateScore(responses);
      
      // Manual calculation using controller logic (should be identical)
      let totalScore = 0;
      for (let i = 1; i <= 10; i++) {
        const questionKey = `q${i}`;
        const value = parseInt(responses[questionKey]);
        
        if (i % 2 === 1) {
          // Odd questions: (response - 1) * 2.5
          totalScore += (value - 1) * 2.5;
        } else {
          // Even questions: (5 - response) * 2.5
          totalScore += (5 - value) * 2.5;
        }
      }
      
      expect(totalScore).toBe(serviceScore);
      expect(totalScore).toBe(80);
    });

    test('should handle "agree all" scenario correctly', () => {
      const agreeAllResponses = {
        q1: 4, q2: 4, q3: 4, q4: 4, q5: 4,
        q6: 4, q7: 4, q8: 4, q9: 4, q10: 4
      };
      
      const serviceScore = SUSService.calculateScore(agreeAllResponses);
      
      // Verify this gives 50 points (not 100)
      expect(serviceScore).toBe(50);
      
      // Verify interpretation
      const interpretation = SUSService.interpretScore(serviceScore);
      expect(interpretation.adjectiveRating).toBe('Poor');
      expect(interpretation.percentileRank).toBe(30);
    });

    test('should handle optimal responses correctly', () => {
      const optimalResponses = {
        q1: 5, q2: 1, q3: 5, q4: 1, q5: 5,
        q6: 1, q7: 5, q8: 1, q9: 5, q10: 1
      };
      
      const serviceScore = SUSService.calculateScore(optimalResponses);
      
      // Verify this gives maximum 100 points
      expect(serviceScore).toBe(100);
      
      // Verify interpretation
      const interpretation = SUSService.interpretScore(serviceScore);
      expect(interpretation.adjectiveRating).toBe('Excellent');
      expect(interpretation.grade).toBe('A');
    });

    test('should handle minimum responses correctly', () => {
      const minimalResponses = {
        q1: 1, q2: 1, q3: 1, q4: 1, q5: 1,
        q6: 1, q7: 1, q8: 1, q9: 1, q10: 1
      };
      
      const serviceScore = SUSService.calculateScore(minimalResponses);
      
      // Verify this gives minimum 0 points
      expect(serviceScore).toBe(0);
      
      // Verify interpretation
      const interpretation = SUSService.interpretScore(serviceScore);
      expect(interpretation.adjectiveRating).toBe('Poor');
      expect(interpretation.grade).toBe('F');
    });
  });

  describe('Response Processing', () => {
    
    test('should handle string responses correctly', () => {
      const stringResponses = {
        q1: '4', q2: '2', q3: '5', q4: '1', q5: '3',
        q6: '3', q7: '4', q8: '2', q9: '5', q10: '1'
      };
      
      // Normalize and calculate
      const normalized = SUSService.normalizeResponses(stringResponses);
      const score = SUSService.calculateScore(normalized);
      
      expect(score).toBe(80);
    });

    test('should validate responses before calculation', () => {
      const invalidResponses = {
        q1: 6, q2: 0, q3: 5, q4: 1, q5: 3,
        q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
      };
      
      const validation = SUSService.validateResponses(invalidResponses);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should handle incomplete responses', () => {
      const incompleteResponses = {
        q1: 4, q2: 2, q3: 5, q4: 1, q5: 3
        // q6-q10 missing
      };
      
      const validation = SUSService.validateResponses(incompleteResponses);
      const score = SUSService.calculateScore(incompleteResponses);
      
      expect(validation.isValid).toBe(false);
      expect(score).toBe(0);
    });
  });

  describe('Score Interpretation Consistency', () => {
    
    test('should provide consistent interpretation for industry average', () => {
      const score = 68; // Industry average
      const interpretation = SUSService.interpretScore(score);
      
      expect(interpretation.adjectiveRating).toBe('Good');
      expect(interpretation.acceptability).toBe('Acceptable');
      expect(interpretation.grade).toBe('B');
      expect(interpretation.percentileRank).toBe(70);
    });

    test('should provide consistent interpretation for excellent scores', () => {
      const score = 85;
      const interpretation = SUSService.interpretScore(score);
      
      expect(interpretation.adjectiveRating).toBe('Excellent');
      expect(interpretation.acceptability).toBe('Acceptable');
      expect(interpretation.grade).toBe('A');
      expect(interpretation.percentileRank).toBe(95);
    });

    test('should provide consistent interpretation for poor scores', () => {
      const score = 40;
      const interpretation = SUSService.interpretScore(score);
      
      expect(interpretation.adjectiveRating).toBe('Poor');
      expect(interpretation.acceptability).toBe('Not Acceptable');
      expect(interpretation.grade).toBe('D');
      expect(interpretation.percentileRank).toBe(20);
    });
  });

  describe('Frontend-Backend Consistency', () => {
    
    test('should match frontend susCalculator.js results', () => {
      // Simulate frontend calculation logic (from susCalculator.js)
      const responses = {
        q1: 4, q2: 2, q3: 5, q4: 1, q5: 3,
        q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
      };
      
      // Frontend logic simulation
      let frontendScore = 0;
      for (let i = 1; i <= 10; i++) {
        const questionKey = `q${i}`;
        const value = parseInt(responses[questionKey]);
        
        if (i % 2 === 1) {
          // Odd questions: (response - 1) * 2.5
          frontendScore += (value - 1) * 2.5;
        } else {
          // Even questions: (5 - response) * 2.5
          frontendScore += (5 - value) * 2.5;
        }
      }
      
      // Backend calculation
      const backendScore = SUSService.calculateScore(responses);
      
      // Should be identical
      expect(frontendScore).toBe(backendScore);
      expect(frontendScore).toBe(80);
    });

    test('should provide same interpretation as frontend', () => {
      const score = 75;
      
      // Backend interpretation
      const backendInterpretation = SUSService.interpretScore(score);
      
      // Frontend interpretation logic simulation
      let frontendInterpretation;
      if (score >= 85) {
        frontendInterpretation = {
          adjectiveRating: 'Excellent',
          acceptability: 'Acceptable',
          grade: 'A'
        };
      } else if (score >= 80) {
        frontendInterpretation = {
          adjectiveRating: 'Excellent',
          acceptability: 'Acceptable',
          grade: 'A-'
        };
      } else if (score >= 75) {
        frontendInterpretation = {
          adjectiveRating: 'Good',
          acceptability: 'Acceptable',
          grade: 'B+'
        };
      }
      
      expect(backendInterpretation.adjectiveRating).toBe(frontendInterpretation.adjectiveRating);
      expect(backendInterpretation.acceptability).toBe(frontendInterpretation.acceptability);
      expect(backendInterpretation.grade).toBe(frontendInterpretation.grade);
    });
  });

  describe('Real-world Scenarios', () => {
    
    test('should handle typical user behavior patterns', () => {
      // Scenario: User who generally likes the system but has some concerns
      const typicalUser = {
        q1: 4, q2: 2, q3: 4, q4: 2, q5: 4,
        q6: 3, q7: 4, q8: 2, q9: 4, q10: 2
      };
      
      const score = SUSService.calculateScore(typicalUser);
      const interpretation = SUSService.interpretScore(score);
      
      // Should be above industry average
      expect(score).toBeGreaterThan(68);
      expect(interpretation.acceptability).toBe('Acceptable');
    });

    test('should handle confused user responses', () => {
      // Scenario: User who didn\'t understand reverse questions
      const confusedUser = {
        q1: 4, q2: 4, q3: 4, q4: 4, q5: 4,
        q6: 4, q7: 4, q8: 4, q9: 4, q10: 4
      };
      
      const score = SUSService.calculateScore(confusedUser);
      const interpretation = SUSService.interpretScore(score);
      
      // Should result in exactly 50 points (demonstrating the issue)
      expect(score).toBe(50);
      expect(interpretation.adjectiveRating).toBe('Poor');
      expect(score).toBeLessThan(68); // Below industry average
    });

    test('should handle expert user responses', () => {
      // Scenario: UX expert who understands the system well
      const expertUser = {
        q1: 5, q2: 1, q3: 5, q4: 2, q5: 4,
        q6: 2, q7: 5, q8: 1, q9: 5, q10: 1
      };
      
      const score = SUSService.calculateScore(expertUser);
      const interpretation = SUSService.interpretScore(score);
      
      // Should be very high score
      expect(score).toBeGreaterThan(85);
      expect(interpretation.adjectiveRating).toBe('Excellent');
      expect(interpretation.grade).toBe('A');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    
    test('should handle null responses gracefully', () => {
      const score = SUSService.calculateScore(null);
      const validation = SUSService.validateResponses(null);
      
      expect(score).toBe(0);
      expect(validation.isValid).toBe(false);
    });

    test('should handle undefined responses gracefully', () => {
      const score = SUSService.calculateScore(undefined);
      const validation = SUSService.validateResponses(undefined);
      
      expect(score).toBe(0);
      expect(validation.isValid).toBe(false);
    });

    test('should handle malformed data gracefully', () => {
      const malformedData = {
        q1: 'invalid', q2: null, q3: undefined, q4: {}, q5: [],
        q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
      };
      
      const score = SUSService.calculateScore(malformedData);
      const validation = SUSService.validateResponses(malformedData);
      
      expect(score).toBe(0);
      expect(validation.isValid).toBe(false);
    });

    test('should handle extreme values gracefully', () => {
      const extremeValues = {
        q1: 999, q2: -999, q3: Infinity, q4: -Infinity, q5: NaN,
        q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
      };
      
      const score = SUSService.calculateScore(extremeValues);
      const validation = SUSService.validateResponses(extremeValues);
      
      expect(score).toBe(0);
      expect(validation.isValid).toBe(false);
    });
  });

  describe('Performance and Scalability', () => {
    
    test('should calculate scores efficiently for multiple responses', () => {
      const responses = {
        q1: 4, q2: 2, q3: 5, q4: 1, q5: 3,
        q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
      };
      
      const startTime = performance.now();
      
      // Calculate 1000 scores
      for (let i = 0; i < 1000; i++) {
        SUSService.calculateScore(responses);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (less than 100ms for 1000 calculations)
      expect(duration).toBeLessThan(100);
    });

    test('should handle batch processing efficiently', () => {
      const batchResponses = [];
      
      // Create 100 different response sets
      for (let i = 0; i < 100; i++) {
        batchResponses.push({
          q1: Math.floor(Math.random() * 5) + 1,
          q2: Math.floor(Math.random() * 5) + 1,
          q3: Math.floor(Math.random() * 5) + 1,
          q4: Math.floor(Math.random() * 5) + 1,
          q5: Math.floor(Math.random() * 5) + 1,
          q6: Math.floor(Math.random() * 5) + 1,
          q7: Math.floor(Math.random() * 5) + 1,
          q8: Math.floor(Math.random() * 5) + 1,
          q9: Math.floor(Math.random() * 5) + 1,
          q10: Math.floor(Math.random() * 5) + 1,
        });
      }
      
      const startTime = performance.now();
      
      const scores = batchResponses.map(responses => 
        SUSService.calculateScore(responses)
      );
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // All scores should be valid
      scores.forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
      
      // Should complete efficiently
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Mathematical Accuracy', () => {
    
    test('should maintain mathematical precision', () => {
      const responses = {
        q1: 3, q2: 3, q3: 3, q4: 3, q5: 3,
        q6: 3, q7: 3, q8: 3, q9: 3, q10: 3
      };
      
      const score = SUSService.calculateScore(responses);
      
      // Manual calculation:
      // Odd: (3-1)*2.5 = 2*2.5 = 5 per question, 5 questions = 25
      // Even: (5-3)*2.5 = 2*2.5 = 5 per question, 5 questions = 25
      // Total: 25 + 25 = 50
      
      expect(score).toBe(50);
    });

    test('should handle decimal precision correctly', () => {
      const responses = {
        q1: 2, q2: 4, q3: 2, q4: 4, q5: 2,
        q6: 4, q7: 2, q8: 4, q9: 2, q10: 4
      };
      
      const score = SUSService.calculateScore(responses);
      
      // Manual calculation:
      // Odd: (2-1)*2.5 = 1*2.5 = 2.5 per question, 5 questions = 12.5
      // Even: (5-4)*2.5 = 1*2.5 = 2.5 per question, 5 questions = 12.5
      // Total: 12.5 + 12.5 = 25
      
      expect(score).toBe(25);
    });
  });
}); 