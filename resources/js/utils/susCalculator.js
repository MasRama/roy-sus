/**
 * SUS (System Usability Scale) Calculator Utility
 * Frontend utility that mirrors the backend SUSService logic
 * Ensures consistent SUS score calculation across the application
 */

/**
 * Calculate SUS Score from questionnaire responses
 * @param {Object} responses - Object containing q1-q10 responses (1-5 scale)
 * @returns {number} SUS Score (0-100)
 */
export function calculateSUSScore(responses) {
  try {
    // Parse responses if it's a string
    const parsed = typeof responses === 'string' ? JSON.parse(responses) : responses;
    
    // Validate responses object
    if (!parsed || typeof parsed !== 'object') {
      console.error('Invalid responses object');
      return 0;
    }

    let totalScore = 0;
    
    // Calculate SUS score using the standard formula
    for (let i = 1; i <= 10; i++) {
      const questionKey = `q${i}`;
      const value = parseInt(parsed[questionKey]);
      
      // Validate individual response
      if (isNaN(value) || value < 1 || value > 5) {
        console.error(`Invalid response for ${questionKey}: ${value}`);
        return 0;
      }
      
      if (i % 2 === 1) {
        // Odd questions (1,3,5,7,9): (response - 1) * 2.5
        totalScore += (value - 1) * 2.5;
      } else {
        // Even questions (2,4,6,8,10): (5 - response) * 2.5
        totalScore += (5 - value) * 2.5;
      }
    }
    
    // Ensure score is within valid range (0-100)
    return Math.max(0, Math.min(100, totalScore));
    
  } catch (error) {
    console.error('Error calculating SUS score:', error);
    return 0;
  }
}

/**
 * Interpret SUS Score according to international standards
 * @param {number} score - SUS Score (0-100)
 * @returns {Object} Interpretation object with percentile, adjective, acceptability, and grade
 */
export function interpretSUSScore(score) {
  const numScore = parseFloat(score);
  
  if (isNaN(numScore) || numScore < 0 || numScore > 100) {
    return {
      percentileRank: 0,
      percentileText: '0%',
      adjectiveRating: 'Invalid',
      acceptability: 'Invalid',
      grade: 'F'
    };
  }
  
  // Based on Bangor, Kortum, and Miller (2008) research
  if (numScore >= 85) {
    return {
      percentileRank: 95,
      percentileText: '95%',
      adjectiveRating: 'Excellent',
      acceptability: 'Acceptable',
      grade: 'A'
    };
  } else if (numScore >= 80) {
    return {
      percentileRank: 90,
      percentileText: '90%',
      adjectiveRating: 'Excellent',
      acceptability: 'Acceptable',
      grade: 'A-'
    };
  } else if (numScore >= 75) {
    return {
      percentileRank: 80,
      percentileText: '80%',
      adjectiveRating: 'Good',
      acceptability: 'Acceptable',
      grade: 'B+'
    };
  } else if (numScore >= 70) {
    return {
      percentileRank: 70,
      percentileText: '70%',
      adjectiveRating: 'Good',
      acceptability: 'Acceptable',
      grade: 'B'
    };
  } else if (numScore >= 65) {
    return {
      percentileRank: 60,
      percentileText: '60%',
      adjectiveRating: 'OK',
      acceptability: 'Marginal',
      grade: 'B-'
    };
  } else if (numScore >= 60) {
    return {
      percentileRank: 50,
      percentileText: '50%',
      adjectiveRating: 'OK',
      acceptability: 'Marginal',
      grade: 'C+'
    };
  } else if (numScore >= 55) {
    return {
      percentileRank: 40,
      percentileText: '40%',
      adjectiveRating: 'OK',
      acceptability: 'Marginal',
      grade: 'C'
    };
  } else if (numScore >= 50) {
    return {
      percentileRank: 30,
      percentileText: '30%',
      adjectiveRating: 'Poor',
      acceptability: 'Not Acceptable',
      grade: 'C-'
    };
  } else if (numScore >= 40) {
    return {
      percentileRank: 20,
      percentileText: '20%',
      adjectiveRating: 'Poor',
      acceptability: 'Not Acceptable',
      grade: 'D'
    };
  } else {
    return {
      percentileRank: 10,
      percentileText: '10%',
      adjectiveRating: 'Poor',
      acceptability: 'Not Acceptable',
      grade: 'F'
    };
  }
}

/**
 * Validate SUS questionnaire responses
 * @param {Object} responses - Object containing q1-q10 responses
 * @returns {Object} Validation result with isValid flag and errors array
 */
export function validateSUSResponses(responses) {
  const errors = [];
  
  // Check if responses object exists
  if (!responses || typeof responses !== 'object') {
    errors.push('Responses object is required');
    return { isValid: false, errors };
  }
  
  // Check each question response
  for (let i = 1; i <= 10; i++) {
    const questionKey = `q${i}`;
    const value = responses[questionKey];
    
    if (value === undefined || value === null) {
      errors.push(`Question ${i} is required`);
    } else {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 1 || numValue > 5) {
        errors.push(`Question ${i} must be a number between 1 and 5`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get color class based on SUS score for UI styling
 * @param {number} score - SUS Score (0-100)
 * @returns {Object} Color classes for different UI elements
 */
export function getSUSScoreColors(score) {
  const numScore = parseFloat(score);
  
  if (numScore >= 70) {
    return {
      badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      background: 'bg-green-500',
      text: 'text-green-600',
      border: 'border-green-500'
    };
  } else if (numScore >= 50) {
    return {
      badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      background: 'bg-yellow-500',
      text: 'text-yellow-600',
      border: 'border-yellow-500'
    };
  } else {
    return {
      badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      background: 'bg-red-500',
      text: 'text-red-600',
      border: 'border-red-500'
    };
  }
}

/**
 * Normalize responses to ensure consistent format
 * @param {Object} responses - Raw responses object
 * @returns {Object} Normalized responses object
 */
export function normalizeResponses(responses) {
  const normalized = {};
  
  for (let i = 1; i <= 10; i++) {
    const questionKey = `q${i}`;
    const value = responses[questionKey];
    
    if (value !== undefined && value !== null) {
      normalized[questionKey] = parseInt(value);
    }
  }
  
  return normalized;
}

export default {
  calculateSUSScore,
  interpretSUSScore,
  validateSUSResponses,
  getSUSScoreColors,
  normalizeResponses
}; 