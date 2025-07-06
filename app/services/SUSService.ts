/**
 * SUS (System Usability Scale) Service
 * Handles SUS score calculation and interpretation according to international standards.
 * Provides centralized logic for consistent SUS scoring across the application.
 */

/**
 * Interface for SUS questionnaire responses
 * Each response should be a number from 1-5 representing the Likert scale
 */
export interface SUSResponses {
   q1?: number;  // I think that I would like to use this system frequently
   q2?: number;  // I found the system unnecessarily complex
   q3?: number;  // I thought the system was easy to use
   q4?: number;  // I think that I would need the support of a technical person
   q5?: number;  // I found the various functions in this system were well integrated
   q6?: number;  // I thought there was too much inconsistency in this system
   q7?: number;  // I would imagine that most people would learn to use this system very quickly
   q8?: number;  // I found the system very cumbersome to use
   q9?: number;  // I felt very confident using the system
   q10?: number; // I needed to learn a lot of things before I could get going with this system
}

/**
 * Interface for SUS score interpretation result
 */
export interface SUSInterpretation {
   score: number;
   percentileRank: number;
   percentileText: string;
   adjectiveRating: 'Excellent' | 'Good' | 'OK' | 'Poor' | 'Awful';
   acceptability: 'Acceptable' | 'Marginal' | 'Not Acceptable';
   grade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
}

/**
 * SUS Service class providing core SUS calculation and interpretation functionality
 */
class SUSService {
   /**
    * Validates SUS responses to ensure they are within valid range
    * @param {SUSResponses} responses - The SUS questionnaire responses
    * @returns {boolean} True if all responses are valid, false otherwise
    */
   validateResponses(responses: SUSResponses): boolean {
      try {
         for (let i = 1; i <= 10; i++) {
            const questionKey = `q${i}` as keyof SUSResponses;
            const value = responses[questionKey];
            
            // Check if response exists and is within valid range (1-5)
            if (value === undefined || value === null || value < 1 || value > 5 || !Number.isInteger(value)) {
               console.warn(`Invalid response for ${questionKey}: ${value}`);
               return false;
            }
         }
         return true;
      } catch (error) {
         console.error('Error validating SUS responses:', error);
         return false;
      }
   }

   /**
    * Calculates SUS score using the standard formula
    * @param {SUSResponses} responses - The SUS questionnaire responses
    * @returns {number} The calculated SUS score (0-100)
    * 
    * Formula:
    * - Odd questions (1,3,5,7,9): (response - 1) * 2.5
    * - Even questions (2,4,6,8,10): (5 - response) * 2.5
    * - Total: sum of all contributions
    */
   calculateScore(responses: SUSResponses): number {
      try {
         // Validate responses first
         if (!this.validateResponses(responses)) {
            console.error('Invalid SUS responses provided');
            return 0;
         }

         let totalScore = 0;

         for (let i = 1; i <= 10; i++) {
            const questionKey = `q${i}` as keyof SUSResponses;
            const value = responses[questionKey] || 0;
            
            if (i % 2 === 1) {
               // Odd questions (1, 3, 5, 7, 9): positive statements
               // Higher scores are better, so (response - 1) * 2.5
               totalScore += (value - 1) * 2.5;
            } else {
               // Even questions (2, 4, 6, 8, 10): negative statements
               // Lower scores are better, so (5 - response) * 2.5
               totalScore += (5 - value) * 2.5;
            }
         }

         // Ensure score is within valid range (0-100)
         const finalScore = Math.max(0, Math.min(100, totalScore));
         
         console.log(`SUS Score calculated: ${finalScore} from responses:`, responses);
         return finalScore;

      } catch (error) {
         console.error('Error calculating SUS score:', error);
         return 0;
      }
   }

   /**
    * Interprets SUS score according to standard benchmarks
    * @param {number} score - The SUS score to interpret
    * @returns {SUSInterpretation} Detailed interpretation of the score
    */
   interpretScore(score: number): SUSInterpretation {
      try {
         // Clamp score to valid range
         const clampedScore = Math.max(0, Math.min(100, score));
         
         let percentileRank: number;
         let adjectiveRating: SUSInterpretation['adjectiveRating'];
         let acceptability: SUSInterpretation['acceptability'];
         let grade: SUSInterpretation['grade'];

         // Based on research by Sauro and Lewis (2016) and Bangor, Kortum & Miller (2009)
         if (clampedScore >= 90) {
            percentileRank = 96;
            adjectiveRating = 'Excellent';
            acceptability = 'Acceptable';
            grade = 'A+';
         } else if (clampedScore >= 85) {
            percentileRank = 90;
            adjectiveRating = 'Excellent';
            acceptability = 'Acceptable';
            grade = 'A';
         } else if (clampedScore >= 80) {
            percentileRank = 80;
            adjectiveRating = 'Good';
            acceptability = 'Acceptable';
            grade = 'B+';
         } else if (clampedScore >= 75) {
            percentileRank = 70;
            adjectiveRating = 'Good';
            acceptability = 'Acceptable';
            grade = 'B';
         } else if (clampedScore >= 70) {
            percentileRank = 60;
            adjectiveRating = 'Good';
            acceptability = 'Acceptable';
            grade = 'C+';
         } else if (clampedScore >= 68) {
            percentileRank = 50; // 68 is the average SUS score
            adjectiveRating = 'OK';
            acceptability = 'Marginal';
            grade = 'C';
         } else if (clampedScore >= 60) {
            percentileRank = 35;
            adjectiveRating = 'OK';
            acceptability = 'Marginal';
            grade = 'C-';
         } else if (clampedScore >= 50) {
            percentileRank = 25;
            adjectiveRating = 'Poor';
            acceptability = 'Not Acceptable';
            grade = 'D';
         } else {
            percentileRank = 10;
            adjectiveRating = 'Awful';
            acceptability = 'Not Acceptable';
            grade = 'F';
         }

         const interpretation: SUSInterpretation = {
            score: clampedScore,
            percentileRank,
            percentileText: `${percentileRank}%`,
            adjectiveRating,
            acceptability,
            grade
         };

         console.log(`SUS Score ${clampedScore} interpreted as:`, interpretation);
         return interpretation;

      } catch (error) {
         console.error('Error interpreting SUS score:', error);
         return {
            score: 0,
            percentileRank: 0,
            percentileText: '0%',
            adjectiveRating: 'Awful',
            acceptability: 'Not Acceptable',
            grade: 'F'
         };
      }
   }

   /**
    * Calculates SUS score and provides interpretation in one call
    * @param {SUSResponses} responses - The SUS questionnaire responses
    * @returns {SUSInterpretation} Complete SUS analysis with score and interpretation
    */
   analyzeResponses(responses: SUSResponses): SUSInterpretation {
      const score = this.calculateScore(responses);
      return this.interpretScore(score);
   }

   /**
    * Converts legacy response format to standard format
    * Handles both object and JSON string inputs
    * @param {any} responses - Responses in various formats
    * @returns {SUSResponses} Normalized responses object
    */
   normalizeResponses(responses: any): SUSResponses {
      try {
         let normalized: SUSResponses = {};

         // Handle JSON string input
         if (typeof responses === 'string') {
            responses = JSON.parse(responses);
         }

         // Handle object input
         if (typeof responses === 'object' && responses !== null) {
            for (let i = 1; i <= 10; i++) {
               const questionKey = `q${i}` as keyof SUSResponses;
               const value = responses[questionKey];
               
               if (value !== undefined && value !== null) {
                  const numValue = parseInt(String(value));
                  if (!isNaN(numValue)) {
                     normalized[questionKey] = numValue;
                  }
               }
            }
         }

         return normalized;
      } catch (error) {
         console.error('Error normalizing SUS responses:', error);
         return {};
      }
   }
}

// Export a singleton instance following project pattern
export default new SUSService(); 