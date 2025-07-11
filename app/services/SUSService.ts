/**
 * SUS (System Usability Scale) Service
 * Handles SUS score calculation and interpretation according to international standards.
 * Provides centralized logic for consistent SUS scoring across the application.
 */

import DB from "./DB";

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
 * Interface for dashboard statistics data
 */
export interface DashboardStatistics {
   totalResponden: number;
   averageScore: string;
   totalKuesioner: number;
   grade: string;
   interpretation: SUSInterpretation;
}

/**
 * Interface for chart data
 */
export interface ChartData {
   scoreDistribution: {
      labels: string[];
      data: number[];
   };
   trendData: {
      labels: string[];
      data: number[];
   };
   genderDistribution: {
      labels: string[];
      data: number[];
   };
   ageDistribution: {
      labels: string[];
      data: number[];
   };
}

/**
 * Interface for paginated response data
 */
export interface PaginatedResponse {
   responses: any[];
   total: number;
   currentPage: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPreviousPage: boolean;
   itemsPerPage: number;
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
    * Gets comprehensive dashboard statistics from questionnaire responses
    * @returns {Promise<DashboardStatistics>} Dashboard statistics data
    */
   async getDashboardStatistics(): Promise<DashboardStatistics> {
      try {
         console.log('🔍 [DEBUG] Starting getDashboardStatistics()...');
         const responses = await DB.from("questionnaire_responses").select("*");
         console.log('🔍 [DEBUG] Database responses found:', responses.length);
         
         if (responses.length > 0) {
            console.log('🔍 [DEBUG] First response sample:', {
               id: responses[0].id,
               name: responses[0].name,
               sus_score: responses[0].sus_score,
               has_responses: !!responses[0].responses
            });
         }
         
         const totalResponden = responses.length;
         const totalKuesioner = totalResponden; // Same as total responden
         
         if (totalResponden === 0) {
            console.log('🔍 [DEBUG] No responses found, returning empty stats');
            return {
               totalResponden: 0,
               averageScore: "0.0",
               totalKuesioner: 0,
               grade: "F",
               interpretation: this.interpretScore(0)
            };
         }

         // Calculate average SUS score from all valid responses
         let totalScore = 0;
         let validResponses = 0;

         for (const response of responses) {
            try {
               console.log('🔍 [DEBUG] Processing response:', {
                  id: response.id,
                  name: response.name,
                  sus_score: response.sus_score,
                  sus_score_type: typeof response.sus_score
               });
               
               if (response.sus_score && response.sus_score > 0) {
                  totalScore += response.sus_score;
                  validResponses++;
                  console.log('🔍 [DEBUG] Added sus_score:', response.sus_score, 'Total:', totalScore, 'Valid:', validResponses);
               } else if (response.responses) {
                  // Fallback: calculate from responses JSON if sus_score not available
                  const parsedResponses = JSON.parse(response.responses);
                  const calculatedScore = this.calculateScore(parsedResponses);
                  if (calculatedScore > 0) {
                     totalScore += calculatedScore;
                     validResponses++;
                     console.log('🔍 [DEBUG] Calculated score:', calculatedScore, 'Total:', totalScore, 'Valid:', validResponses);
                  }
               } else {
                  console.log('🔍 [DEBUG] Skipping response (no valid score):', response.id);
               }
            } catch (error) {
               console.warn(`Error processing response ${response.id}:`, error);
            }
         }

         const averageScore = validResponses > 0 ? (totalScore / validResponses) : 0;
         const grade = this.calculateGrade(averageScore);
         const interpretation = this.interpretScore(averageScore);

         console.log('🔍 [DEBUG] Final calculation:', {
            totalResponden,
            totalScore,
            validResponses,
            averageScore,
            grade
         });

         return {
            totalResponden,
            averageScore: averageScore.toFixed(1),
            totalKuesioner,
            grade,
            interpretation
         };

      } catch (error) {
         console.error('Error getting dashboard statistics:', error);
         return {
            totalResponden: 0,
            averageScore: "0.0",
            totalKuesioner: 0,
            grade: "F",
            interpretation: this.interpretScore(0)
         };
      }
   }

   /**
    * Gets chart data for visualization
    * @returns {Promise<ChartData>} Chart data for dashboard
    */
   async getChartData(): Promise<ChartData> {
      try {
         console.log('📊 [DEBUG] Starting getChartData()...');
         const responses = await DB.from("questionnaire_responses").select("*").orderBy('created_at', 'desc');
         console.log('📊 [DEBUG] Chart data responses found:', responses.length);
         
         // Score Distribution Data (histogram)
         const scoreRanges = [
            { label: '0-20', min: 0, max: 20, count: 0 },
            { label: '21-40', min: 21, max: 40, count: 0 },
            { label: '41-60', min: 41, max: 60, count: 0 },
            { label: '61-80', min: 61, max: 80, count: 0 },
            { label: '81-100', min: 81, max: 100, count: 0 }
         ];

         // Trend Data (daily aggregation)
         const dailyData: { [key: string]: { total: number, count: number } } = {};

         // Gender Distribution Data
         const genderData: { [key: string]: number } = {
            'Laki-laki': 0,
            'Perempuan': 0
         };

         // Age Distribution Data
         const ageRanges = [
            { label: '< 20 tahun', min: 0, max: 19, count: 0 },
            { label: '20-24 tahun', min: 20, max: 24, count: 0 },
            { label: '25-29 tahun', min: 25, max: 29, count: 0 },
            { label: '≥ 30 tahun', min: 30, max: 999, count: 0 }
         ];

         for (const response of responses) {
            let score = 0;
            
            try {
               if (response.sus_score && response.sus_score > 0) {
                  score = response.sus_score;
               } else if (response.responses) {
                  const parsedResponses = JSON.parse(response.responses);
                  score = this.calculateScore(parsedResponses);
               }

               // Update gender distribution
               if (response.gender && genderData.hasOwnProperty(response.gender)) {
                  genderData[response.gender]++;
               }

               // Update age distribution
               if (response.age) {
                  const age = parseInt(response.age);
                  for (const range of ageRanges) {
                     if (age >= range.min && age <= range.max) {
                        range.count++;
                        break;
                     }
                  }
               }

               if (score > 0) {
                  // Update score distribution
                  for (const range of scoreRanges) {
                     if (score >= range.min && score <= range.max) {
                        range.count++;
                        break;
                     }
                  }

                  // Update trend data (group by day)
                  const date = new Date(response.created_at);
                  const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  
                  if (!dailyData[dayKey]) {
                     dailyData[dayKey] = { total: 0, count: 0 };
                  }
                  dailyData[dayKey].total += score;
                  dailyData[dayKey].count++;
               }
            } catch (error) {
               console.warn(`Error processing response ${response.id} for chart data:`, error);
            }
         }

         // Prepare trend data
         const trendLabels = Object.keys(dailyData).sort();
         const trendData = trendLabels.map(day => {
            const data = dailyData[day];
            return data.count > 0 ? (data.total / data.count) : 0;
         });

         console.log('📊 [DEBUG] Chart data results:', {
            scoreDistribution: scoreRanges.map(range => `${range.label}: ${range.count}`),
            trendLabels,
            trendData
         });

         return {
            scoreDistribution: {
               labels: scoreRanges.map(range => range.label),
               data: scoreRanges.map(range => range.count)
            },
            trendData: {
               labels: trendLabels,
               data: trendData
            },
            genderDistribution: {
               labels: Object.keys(genderData),
               data: Object.values(genderData)
            },
            ageDistribution: {
               labels: ageRanges.map(range => range.label),
               data: ageRanges.map(range => range.count)
            }
         };

      } catch (error) {
         console.error('Error getting chart data:', error);
         return {
            scoreDistribution: {
               labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
               data: [0, 0, 0, 0, 0]
            },
            trendData: {
               labels: [],
               data: []
            },
            genderDistribution: {
               labels: ['Laki-laki', 'Perempuan'],
               data: [0, 0]
            },
            ageDistribution: {
               labels: ['< 20 tahun', '20-24 tahun', '25-29 tahun', '≥ 30 tahun'],
               data: [0, 0, 0, 0]
            }
         };
      }
   }

   /**
    * Calculates grade based on SUS score
    * @param {number} score - The SUS score
    * @returns {string} Grade letter
    */
   calculateGrade(score: number): string {
      if (score >= 90) return 'A+';
      if (score >= 85) return 'A';
      if (score >= 80) return 'B+';
      if (score >= 75) return 'B';
      if (score >= 70) return 'C+';
      if (score >= 65) return 'C';
      if (score >= 60) return 'C-';
      if (score >= 50) return 'D';
      return 'F';
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

   /**
    * Gets paginated questionnaire responses with search and filter capabilities
    * @param {number} page - Page number (1-based)
    * @param {number} limit - Number of items per page
    * @param {string} search - Search term for name filtering
    * @param {string} genderFilter - Gender filter
    * @param {string} proficiencyFilter - Digital proficiency filter
    * @returns {Promise<PaginatedResponse>} Paginated response data
    */
   public async getPaginatedResponses(
       page: number = 1, 
       limit: number = 10, 
       search: string = "", 
       genderFilter: string = "", 
       proficiencyFilter: string = ""
   ): Promise<PaginatedResponse> {
       try {
           // Validate and sanitize inputs for security and performance
           const sanitizedPage = Math.max(1, Math.min(page, 1000)); // Limit max page to prevent abuse
           const sanitizedLimit = Math.max(1, Math.min(limit, 100)); // Limit max items per page
           const sanitizedSearch = search.trim().slice(0, 100); // Limit search term length
           
           let query = DB.from("questionnaire_responses")
               .select(['id', 'name', 'age', 'gender', 'digital_proficiency', 'sus_score', 'responses', 'created_at']);
           
           // Apply search on name column with case-insensitive search
           if (sanitizedSearch) {
               query = query.where(function() {
                   this.whereRaw('LOWER(name) LIKE ?', [`%${sanitizedSearch.toLowerCase()}%`]);
               });
           }
           
           // Apply gender filter with exact match
           if (genderFilter && genderFilter !== 'all' && genderFilter !== '') {
               query = query.where('gender', genderFilter);
           }
           
           // Apply digital proficiency filter with exact match
           if (proficiencyFilter && proficiencyFilter !== 'all' && proficiencyFilter !== '') {
               query = query.where('digital_proficiency', proficiencyFilter);
           }
           
           // Get total count for pagination metadata
           const countQuery = query.clone();
           const totalResult = await countQuery.count('* as count').first();
           const total = totalResult?.count || 0;
           
           // Calculate pagination values using sanitized inputs
           const offset = (sanitizedPage - 1) * sanitizedLimit;
           const totalPages = Math.ceil(Number(total) / sanitizedLimit);
           
           // Get paginated results with optimized ordering
           const responses = await query
               .orderBy('created_at', 'desc')
               .orderBy('id', 'desc') // Secondary sort for consistency
               .offset(offset)
               .limit(sanitizedLimit);
           
           return {
               responses,
               total: Number(total),
               currentPage: sanitizedPage,
               totalPages,
               hasNextPage: sanitizedPage < totalPages,
               hasPreviousPage: sanitizedPage > 1,
               itemsPerPage: sanitizedLimit
           };
           
       } catch (error) {
           console.error('Error getting paginated responses:', error);
           return {
               responses: [],
               total: 0,
               currentPage: 1,
               totalPages: 0,
               hasNextPage: false,
               hasPreviousPage: false,
               itemsPerPage: limit
           };
       }
   }
}

// Export a singleton instance following project pattern
export default new SUSService();