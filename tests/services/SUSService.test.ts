/**
 * Unit Tests for SUSService
 * Tests comprehensive SUS Score calculation scenarios and edge cases
 */

import SUSService, { SUSResponses } from '../../app/services/SUSService';

describe('SUSService', () => {
  
  describe('calculateScore', () => {
    
    test('should return 0 for all "Sangat Tidak Setuju" (1) responses', () => {
      const responses: SUSResponses = {
        q1: 1, q2: 1, q3: 1, q4: 1, q5: 1,
        q6: 1, q7: 1, q8: 1, q9: 1, q10: 1
      };
      
      const score = SUSService.calculateScore(responses);
      expect(score).toBe(0);
    });

    test('should return 50 for all "Setuju" (4) responses', () => {
      const responses: SUSResponses = {
        q1: 4, q2: 4, q3: 4, q4: 4, q5: 4,
        q6: 4, q7: 4, q8: 4, q9: 4, q10: 4
      };
      
      const score = SUSService.calculateScore(responses);
      expect(score).toBe(50);
    });

    test('should return 100 for optimal responses (odd=5, even=1)', () => {
      const responses: SUSResponses = {
        q1: 5, q2: 1, q3: 5, q4: 1, q5: 5,
        q6: 1, q7: 5, q8: 1, q9: 5, q10: 1
      };
      
      const score = SUSService.calculateScore(responses);
      expect(score).toBe(100);
    });

    test('should return 50 for all "Sangat Setuju" (5) responses', () => {
      const responses: SUSResponses = {
        q1: 5, q2: 5, q3: 5, q4: 5, q5: 5,
        q6: 5, q7: 5, q8: 5, q9: 5, q10: 5
      };
      
      const score = SUSService.calculateScore(responses);
      expect(score).toBe(50);
    });

    test('should calculate correct score for mixed responses', () => {
      const responses: SUSResponses = {
        q1: 4, q2: 2, q3: 5, q4: 1, q5: 3,
        q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
      };
      
      // Manual calculation:
      // Odd: (4-1)*2.5 + (5-1)*2.5 + (3-1)*2.5 + (4-1)*2.5 + (5-1)*2.5 = 7.5 + 10 + 5 + 7.5 + 10 = 40
      // Even: (5-2)*2.5 + (5-1)*2.5 + (5-3)*2.5 + (5-2)*2.5 + (5-1)*2.5 = 7.5 + 10 + 5 + 7.5 + 10 = 40
      // Total: 40 + 40 = 80
      
      const score = SUSService.calculateScore(responses);
      expect(score).toBe(80);
    });

    test('should handle string responses correctly', () => {
      const responses = {
        q1: '4', q2: '2', q3: '5', q4: '1', q5: '3',
        q6: '3', q7: '4', q8: '2', q9: '5', q10: '1'
      };
      
      const score = SUSService.calculateScore(responses);
      expect(score).toBe(80);
    });

    test('should return 0 for empty responses object', () => {
      const responses = {};
      
      const score = SUSService.calculateScore(responses);
      expect(score).toBe(0);
    });

    test('should return 0 for null responses', () => {
      const score = SUSService.calculateScore(null);
      expect(score).toBe(0);
    });

    test('should return 0 for undefined responses', () => {
      const score = SUSService.calculateScore(undefined);
      expect(score).toBe(0);
    });

    test('should handle missing individual responses', () => {
      const responses: SUSResponses = {
        q1: 4, q2: 2, q3: 5, q4: 1, q5: 3,
        // q6, q7, q8, q9, q10 missing
      };
      
      const score = SUSService.calculateScore(responses);
      expect(score).toBe(0); // Should return 0 for incomplete responses
    });

    test('should handle invalid response values', () => {
      const responses = {
        q1: 6, q2: 0, q3: 5, q4: -1, q5: 3,
        q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
      };
      
      const score = SUSService.calculateScore(responses);
      expect(score).toBe(0); // Should return 0 for invalid values
    });

    test('should clamp score to 0-100 range', () => {
      // This test ensures the score never goes below 0 or above 100
      const responses: SUSResponses = {
        q1: 1, q2: 5, q3: 1, q4: 5, q5: 1,
        q6: 5, q7: 1, q8: 5, q9: 1, q10: 5
      };
      
      const score = SUSService.calculateScore(responses);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('interpretScore', () => {
    
    test('should interpret score 95 as Excellent', () => {
      const interpretation = SUSService.interpretScore(95);
      
      expect(interpretation.adjectiveRating).toBe('Excellent');
      expect(interpretation.acceptability).toBe('Acceptable');
      expect(interpretation.grade).toBe('A');
      expect(interpretation.percentileRank).toBe(95);
    });

    test('should interpret score 82 as Excellent', () => {
      const interpretation = SUSService.interpretScore(82);
      
      expect(interpretation.adjectiveRating).toBe('Excellent');
      expect(interpretation.acceptability).toBe('Acceptable');
      expect(interpretation.grade).toBe('A-');
      expect(interpretation.percentileRank).toBe(90);
    });

    test('should interpret score 75 as Good', () => {
      const interpretation = SUSService.interpretScore(75);
      
      expect(interpretation.adjectiveRating).toBe('Good');
      expect(interpretation.acceptability).toBe('Acceptable');
      expect(interpretation.grade).toBe('B+');
      expect(interpretation.percentileRank).toBe(80);
    });

    test('should interpret score 68 as Good (industry average)', () => {
      const interpretation = SUSService.interpretScore(68);
      
      expect(interpretation.adjectiveRating).toBe('Good');
      expect(interpretation.acceptability).toBe('Acceptable');
      expect(interpretation.grade).toBe('B');
      expect(interpretation.percentileRank).toBe(70);
    });

    test('should interpret score 60 as OK', () => {
      const interpretation = SUSService.interpretScore(60);
      
      expect(interpretation.adjectiveRating).toBe('OK');
      expect(interpretation.acceptability).toBe('Marginal');
      expect(interpretation.grade).toBe('C+');
      expect(interpretation.percentileRank).toBe(50);
    });

    test('should interpret score 50 as Poor', () => {
      const interpretation = SUSService.interpretScore(50);
      
      expect(interpretation.adjectiveRating).toBe('Poor');
      expect(interpretation.acceptability).toBe('Not Acceptable');
      expect(interpretation.grade).toBe('C-');
      expect(interpretation.percentileRank).toBe(30);
    });

    test('should interpret score 30 as Poor', () => {
      const interpretation = SUSService.interpretScore(30);
      
      expect(interpretation.adjectiveRating).toBe('Poor');
      expect(interpretation.acceptability).toBe('Not Acceptable');
      expect(interpretation.grade).toBe('F');
      expect(interpretation.percentileRank).toBe(10);
    });

    test('should handle invalid scores', () => {
      const interpretation = SUSService.interpretScore(-10);
      
      expect(interpretation.adjectiveRating).toBe('Invalid');
      expect(interpretation.acceptability).toBe('Invalid');
      expect(interpretation.grade).toBe('F');
      expect(interpretation.percentileRank).toBe(0);
    });

    test('should handle scores above 100', () => {
      const interpretation = SUSService.interpretScore(150);
      
      expect(interpretation.adjectiveRating).toBe('Invalid');
      expect(interpretation.acceptability).toBe('Invalid');
      expect(interpretation.grade).toBe('F');
      expect(interpretation.percentileRank).toBe(0);
    });
  });

  describe('validateResponses', () => {
    
    test('should validate complete and correct responses', () => {
      const responses: SUSResponses = {
        q1: 4, q2: 2, q3: 5, q4: 1, q5: 3,
        q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
      };
      
      const validation = SUSService.validateResponses(responses);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should invalidate missing responses', () => {
      const responses: SUSResponses = {
        q1: 4, q2: 2, q3: 5, q4: 1, q5: 3
        // q6-q10 missing
      };
      
      const validation = SUSService.validateResponses(responses);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Question 6 is required');
      expect(validation.errors).toContain('Question 10 is required');
    });

    test('should invalidate out-of-range responses', () => {
      const responses = {
        q1: 6, q2: 0, q3: 5, q4: 1, q5: 3,
        q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
      };
      
      const validation = SUSService.validateResponses(responses);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Question 1 must be a number between 1 and 5');
      expect(validation.errors).toContain('Question 2 must be a number between 1 and 5');
    });

    test('should invalidate null responses object', () => {
      const validation = SUSService.validateResponses(null);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Responses object is required');
    });

    test('should invalidate undefined responses object', () => {
      const validation = SUSService.validateResponses(undefined);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Responses object is required');
    });
  });

  describe('analyzeResponses', () => {
    
    test('should analyze typical user responses', () => {
      const responses: SUSResponses = {
        q1: 4, q2: 2, q3: 5, q4: 1, q5: 3,
        q6: 3, q7: 4, q8: 2, q9: 5, q10: 1
      };
      
      const analysis = SUSService.analyzeResponses(responses);
      
      expect(analysis.totalScore).toBe(80);
      expect(analysis.oddQuestionsTotal).toBe(40);
      expect(analysis.evenQuestionsTotal).toBe(40);
      expect(analysis.averageResponse).toBeCloseTo(2.7);
      expect(analysis.responseDistribution).toHaveProperty('1');
      expect(analysis.responseDistribution).toHaveProperty('5');
    });

    test('should handle edge case analysis', () => {
      const responses: SUSResponses = {
        q1: 1, q2: 1, q3: 1, q4: 1, q5: 1,
        q6: 1, q7: 1, q8: 1, q9: 1, q10: 1
      };
      
      const analysis = SUSService.analyzeResponses(responses);
      
      expect(analysis.totalScore).toBe(0);
      expect(analysis.oddQuestionsTotal).toBe(0);
      expect(analysis.evenQuestionsTotal).toBe(0);
      expect(analysis.averageResponse).toBe(1);
      expect(analysis.responseDistribution['1']).toBe(10);
    });
  });

  describe('normalizeResponses', () => {
    
    test('should normalize string responses to numbers', () => {
      const responses = {
        q1: '4', q2: '2', q3: '5', q4: '1', q5: '3',
        q6: '3', q7: '4', q8: '2', q9: '5', q10: '1'
      };
      
      const normalized = SUSService.normalizeResponses(responses);
      
      expect(typeof normalized.q1).toBe('number');
      expect(normalized.q1).toBe(4);
      expect(normalized.q10).toBe(1);
    });

    test('should handle mixed data types', () => {
      const responses = {
        q1: 4, q2: '2', q3: 5, q4: '1', q5: 3,
        q6: '3', q7: 4, q8: '2', q9: 5, q10: '1'
      };
      
      const normalized = SUSService.normalizeResponses(responses);
      
      Object.values(normalized).forEach(value => {
        expect(typeof value).toBe('number');
      });
    });

    test('should filter out invalid responses', () => {
      const responses = {
        q1: 4, q2: 'invalid', q3: 5, q4: null, q5: 3,
        q6: 3, q7: 4, q8: undefined, q9: 5, q10: 1
      };
      
      const normalized = SUSService.normalizeResponses(responses);
      
      expect(normalized.q1).toBe(4);
      expect(normalized.q2).toBeUndefined();
      expect(normalized.q4).toBeUndefined();
      expect(normalized.q8).toBeUndefined();
      expect(normalized.q10).toBe(1);
    });
  });

  describe('Integration scenarios', () => {
    
    test('should handle complete workflow for typical user', () => {
      const rawResponses = {
        q1: '4', q2: '2', q3: '5', q4: '1', q5: '3',
        q6: '3', q7: '4', q8: '2', q9: '5', q10: '1'
      };
      
      // Normalize responses
      const normalized = SUSService.normalizeResponses(rawResponses);
      
      // Validate responses
      const validation = SUSService.validateResponses(normalized);
      expect(validation.isValid).toBe(true);
      
      // Calculate score
      const score = SUSService.calculateScore(normalized);
      expect(score).toBe(80);
      
      // Interpret score
      const interpretation = SUSService.interpretScore(score);
      expect(interpretation.adjectiveRating).toBe('Good');
      
      // Analyze responses
      const analysis = SUSService.analyzeResponses(normalized);
      expect(analysis.totalScore).toBe(80);
    });

    test('should handle industry average scenario (68 points)', () => {
      // Create responses that should result in approximately 68 points
      const responses: SUSResponses = {
        q1: 4, q2: 3, q3: 4, q4: 2, q5: 3,
        q6: 2, q7: 4, q8: 3, q9: 4, q10: 2
      };
      
      const score = SUSService.calculateScore(responses);
      const interpretation = SUSService.interpretScore(score);
      
      // Should be around industry average
      expect(score).toBeGreaterThanOrEqual(65);
      expect(score).toBeLessThanOrEqual(70);
      expect(interpretation.acceptability).toBe('Acceptable');
    });

    test('should demonstrate why "agree all" gives 50 points', () => {
      const agreeAllResponses: SUSResponses = {
        q1: 4, q2: 4, q3: 4, q4: 4, q5: 4,
        q6: 4, q7: 4, q8: 4, q9: 4, q10: 4
      };
      
      const score = SUSService.calculateScore(agreeAllResponses);
      const interpretation = SUSService.interpretScore(score);
      
      expect(score).toBe(50);
      expect(interpretation.adjectiveRating).toBe('Poor');
      expect(interpretation.acceptability).toBe('Not Acceptable');
      
      // This demonstrates that "agree all" is below industry average
      expect(score).toBeLessThan(68); // Below industry average
    });
  });
}); 