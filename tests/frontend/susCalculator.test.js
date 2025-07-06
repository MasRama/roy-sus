/**
 * Unit Tests for Frontend SUS Calculator
 * Tests consistency between frontend and backend SUS calculation
 */

// Import the frontend SUS calculator utility
import { 
  calculateSUSScore, 
  interpretSUSScore, 
  validateSUSResponses,
  getSUSScoreColors,
  normalizeResponses 
} from '../../resources/js/utils/susCalculator.js';

describe('Frontend SUS Calculator', () => {
  
  describe('calculateSUSScore', () => {
    
    test('should return 0 for all "Sangat Tidak Setuju" (1) responses', () => {
      const responses = {
        q1: 1, q2: 1, q3: 1, q4: 1, q5: 1,
        q6: 1, q7: 1, q8: 1, q9: 1, q10: 1
      };
      
      const score = calculateSUSScore(responses);
      expect(score).toBe(0);
    });

    test('should return 50 for all "Setuju" (4) responses', () => {
      const responses = {
        q1: 4, q2: 4, q3: 4, q4: 4, q5: 4,
        q6: 4, q7: 4, q8: 4, q9: 4, q10: 4
      };
      
      const score = calculateSUSScore(responses);
      expect(score).toBe(50);
    });

    test('should return 100 for optimal responses (odd=5, even=1)', () => {
      const responses = {
        q1: 5, q2: 1, q3: 5, q4: 1, q5: 5,
        q6: 1, q7: 5, q8: 1, q9: 5, q10: 1
      };
      
      const score = calculateSUSScore(responses);
      expect(score).toBe(100);
    });

    test('should return 50 for all "Sangat Setuju" (5) responses', () => {
      const responses = {
        q1: 5, q2: 5, q3: 5, q4: 5, q5: 5,
        q6: 5, q7: 5, q8: 5, q9: 5, q10: 5
      };
      
      const score = calculateSUSScore(responses);
      expect(score).toBe(50);
    });

    test('should calculate correct score for mixed responses', () => {
      const responses = {
        q1: 4, q2: 2, q3: 5, q4: 1, q5: 3,
        q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
      };
      
      const score = calculateSUSScore(responses);
      expect(score).toBe(80);
    });

    test('should handle string responses correctly', () => {
      const responses = {
        q1: '4', q2: '2', q3: '5', q4: '1', q5: '3',
        q6: '3', q7: '4', q8: '2', q9: '5', q10: '1'
      };
      
      const score = calculateSUSScore(responses);
      expect(score).toBe(80);
    });

    test('should handle JSON string responses', () => {
      const responsesJson = JSON.stringify({
        q1: 4, q2: 2, q3: 5, q4: 1, q5: 3,
        q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
      });
      
      const score = calculateSUSScore(responsesJson);
      expect(score).toBe(80);
    });

    test('should return 0 for invalid responses', () => {
      const score = calculateSUSScore(null);
      expect(score).toBe(0);
    });

    test('should return 0 for incomplete responses', () => {
      const responses = {
        q1: 4, q2: 2, q3: 5, q4: 1, q5: 3
        // q6-q10 missing
      };
      
      const score = calculateSUSScore(responses);
      expect(score).toBe(0);
    });
  });

  describe('interpretSUSScore', () => {
    
    test('should interpret score 95 as Excellent', () => {
      const interpretation = interpretSUSScore(95);
      
      expect(interpretation.adjectiveRating).toBe('Excellent');
      expect(interpretation.acceptability).toBe('Acceptable');
      expect(interpretation.grade).toBe('A');
      expect(interpretation.percentileRank).toBe(95);
    });

    test('should interpret score 82 as Excellent', () => {
      const interpretation = interpretSUSScore(82);
      
      expect(interpretation.adjectiveRating).toBe('Excellent');
      expect(interpretation.acceptability).toBe('Acceptable');
      expect(interpretation.grade).toBe('A-');
    });

    test('should interpret score 68 as Good (industry average)', () => {
      const interpretation = interpretSUSScore(68);
      
      expect(interpretation.adjectiveRating).toBe('Good');
      expect(interpretation.acceptability).toBe('Acceptable');
      expect(interpretation.grade).toBe('B');
    });

    test('should interpret score 50 as Poor', () => {
      const interpretation = interpretSUSScore(50);
      
      expect(interpretation.adjectiveRating).toBe('Poor');
      expect(interpretation.acceptability).toBe('Not Acceptable');
      expect(interpretation.grade).toBe('C-');
    });
  });

  describe('validateSUSResponses', () => {
    
    test('should validate complete and correct responses', () => {
      const responses = {
        q1: 4, q2: 2, q3: 5, q4: 1, q5: 3,
        q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
      };
      
      const validation = validateSUSResponses(responses);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should invalidate missing responses', () => {
      const responses = {
        q1: 4, q2: 2, q3: 5, q4: 1, q5: 3
        // q6-q10 missing
      };
      
      const validation = validateSUSResponses(responses);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should invalidate out-of-range responses', () => {
      const responses = {
        q1: 6, q2: 0, q3: 5, q4: 1, q5: 3,
        q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
      };
      
      const validation = validateSUSResponses(responses);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe('getSUSScoreColors', () => {
    
    test('should return green colors for excellent scores', () => {
      const colors = getSUSScoreColors(90);
      
      expect(colors.badge).toContain('green');
      expect(colors.background).toContain('green');
    });

    test('should return blue colors for good scores', () => {
      const colors = getSUSScoreColors(75);
      
      expect(colors.badge).toContain('blue');
      expect(colors.background).toContain('blue');
    });

    test('should return yellow colors for OK scores', () => {
      const colors = getSUSScoreColors(60);
      
      expect(colors.badge).toContain('yellow');
      expect(colors.background).toContain('yellow');
    });

    test('should return red colors for poor scores', () => {
      const colors = getSUSScoreColors(40);
      
      expect(colors.badge).toContain('red');
      expect(colors.background).toContain('red');
    });
  });

  describe('normalizeResponses', () => {
    
    test('should normalize string responses to numbers', () => {
      const responses = {
        q1: '4', q2: '2', q3: '5', q4: '1', q5: '3',
        q6: '3', q7: '4', q8: '2', q9: '5', q10: '1'
      };
      
      const normalized = normalizeResponses(responses);
      
      expect(typeof normalized.q1).toBe('number');
      expect(normalized.q1).toBe(4);
      expect(normalized.q10).toBe(1);
    });

    test('should handle mixed data types', () => {
      const responses = {
        q1: 4, q2: '2', q3: 5, q4: '1', q5: 3,
        q6: '3', q7: 4, q8: '2', q9: 5, q10: '1'
      };
      
      const normalized = normalizeResponses(responses);
      
      Object.values(normalized).forEach(value => {
        expect(typeof value).toBe('number');
      });
    });

    test('should filter out invalid responses', () => {
      const responses = {
        q1: 4, q2: 'invalid', q3: 5, q4: null, q5: 3,
        q6: 3, q7: 4, q8: undefined, q9: 5, q10: 1
      };
      
      const normalized = normalizeResponses(responses);
      
      expect(normalized.q1).toBe(4);
      expect(normalized.q2).toBeUndefined();
      expect(normalized.q4).toBeUndefined();
      expect(normalized.q8).toBeUndefined();
      expect(normalized.q10).toBe(1);
    });
  });

  describe('Frontend-Backend Consistency', () => {
    
    test('should match backend calculation results', () => {
      const testCases = [
        // Test case 1: All agree (4)
        {
          responses: {
            q1: 4, q2: 4, q3: 4, q4: 4, q5: 4,
            q6: 4, q7: 4, q8: 4, q9: 4, q10: 4
          },
          expectedScore: 50
        },
        // Test case 2: Optimal responses
        {
          responses: {
            q1: 5, q2: 1, q3: 5, q4: 1, q5: 5,
            q6: 1, q7: 5, q8: 1, q9: 5, q10: 1
          },
          expectedScore: 100
        },
        // Test case 3: All minimum (1)
        {
          responses: {
            q1: 1, q2: 1, q3: 1, q4: 1, q5: 1,
            q6: 1, q7: 1, q8: 1, q9: 1, q10: 1
          },
          expectedScore: 0
        },
        // Test case 4: Mixed responses
        {
          responses: {
            q1: 4, q2: 2, q3: 5, q4: 1, q5: 3,
            q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
          },
          expectedScore: 80
        }
      ];

      testCases.forEach((testCase, index) => {
        const score = calculateSUSScore(testCase.responses);
        expect(score).toBe(testCase.expectedScore, 
          `Test case ${index + 1} failed: expected ${testCase.expectedScore}, got ${score}`);
      });
    });

    test('should provide consistent interpretation with backend', () => {
      const testScores = [95, 85, 75, 68, 60, 50, 40, 30];
      
      testScores.forEach(score => {
        const interpretation = interpretSUSScore(score);
        
        // Verify interpretation structure
        expect(interpretation).toHaveProperty('adjectiveRating');
        expect(interpretation).toHaveProperty('acceptability');
        expect(interpretation).toHaveProperty('grade');
        expect(interpretation).toHaveProperty('percentileRank');
        expect(interpretation).toHaveProperty('percentileText');
        
        // Verify values are within expected ranges
        expect(interpretation.percentileRank).toBeGreaterThanOrEqual(0);
        expect(interpretation.percentileRank).toBeLessThanOrEqual(100);
        
        // Verify grade is valid
        const validGrades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
        expect(validGrades).toContain(interpretation.grade);
        
        // Verify adjective rating is valid
        const validRatings = ['Excellent', 'Good', 'OK', 'Poor', 'Invalid'];
        expect(validRatings).toContain(interpretation.adjectiveRating);
        
        // Verify acceptability is valid
        const validAcceptability = ['Acceptable', 'Marginal', 'Not Acceptable', 'Invalid'];
        expect(validAcceptability).toContain(interpretation.acceptability);
      });
    });
  });

  describe('Real-world Usage Scenarios', () => {
    
    test('should handle typical Svelte component usage', () => {
      // Simulate how the calculator is used in Svelte components
      const mockResponse = {
        responses: JSON.stringify({
          q1: 4, q2: 2, q3: 5, q4: 1, q5: 3,
          q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
        })
      };
      
      const score = calculateSUSScore(mockResponse.responses);
      const interpretation = interpretSUSScore(score);
      const colors = getSUSScoreColors(score);
      
      expect(score).toBe(80);
      expect(interpretation.adjectiveRating).toBe('Good');
      expect(colors.badge).toContain('blue');
    });

    test('should handle form data from SUSResultsTable component', () => {
      // Simulate data structure from SUSResultsTable.svelte
      const tableData = {
        responses: {
          q1: '4', q2: '2', q3: '5', q4: '1', q5: '3',
          q6: '3', q7: '4', q8: '2', q9: '5', q10: '1'
        }
      };
      
      const score = calculateSUSScore(tableData.responses);
      expect(score).toBe(80);
    });

    test('should handle edge cases gracefully', () => {
      const edgeCases = [
        null,
        undefined,
        {},
        '',
        'invalid json',
        { q1: 'invalid' }
      ];
      
      edgeCases.forEach(edgeCase => {
        const score = calculateSUSScore(edgeCase);
        expect(score).toBe(0);
      });
    });
  });

  describe('Performance', () => {
    
    test('should calculate scores efficiently', () => {
      const responses = {
        q1: 4, q2: 2, q3: 5, q4: 1, q5: 3,
        q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
      };
      
      const startTime = performance.now();
      
      // Calculate 1000 scores
      for (let i = 0; i < 1000; i++) {
        calculateSUSScore(responses);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (less than 50ms for 1000 calculations)
      expect(duration).toBeLessThan(50);
    });

    test('should handle large datasets efficiently', () => {
      const responses = [];
      
      // Create 100 different response sets
      for (let i = 0; i < 100; i++) {
        responses.push({
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
      
      const scores = responses.map(response => calculateSUSScore(response));
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // All scores should be valid
      scores.forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
      
      // Should complete efficiently
      expect(duration).toBeLessThan(25);
    });
  });

  describe('Mathematical Accuracy', () => {
    
    test('should maintain precision with decimal calculations', () => {
      const responses = {
        q1: 2, q2: 4, q3: 2, q4: 4, q5: 2,
        q6: 4, q7: 2, q8: 4, q9: 2, q10: 4
      };
      
      const score = calculateSUSScore(responses);
      
      // Manual calculation:
      // Odd: (2-1)*2.5 = 1*2.5 = 2.5 per question, 5 questions = 12.5
      // Even: (5-4)*2.5 = 1*2.5 = 2.5 per question, 5 questions = 12.5
      // Total: 12.5 + 12.5 = 25
      
      expect(score).toBe(25);
    });

    test('should handle boundary values correctly', () => {
      const boundaryTests = [
        { responses: { q1: 1, q2: 5, q3: 1, q4: 5, q5: 1, q6: 5, q7: 1, q8: 5, q9: 1, q10: 5 }, expected: 0 },
        { responses: { q1: 5, q2: 1, q3: 5, q4: 1, q5: 5, q6: 1, q7: 5, q8: 1, q9: 5, q10: 1 }, expected: 100 }
      ];
      
      boundaryTests.forEach(test => {
        const score = calculateSUSScore(test.responses);
        expect(score).toBe(test.expected);
      });
    });
  });
}); 