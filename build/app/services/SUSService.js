"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("./DB"));
class SUSService {
    validateResponses(responses) {
        try {
            for (let i = 1; i <= 10; i++) {
                const questionKey = `q${i}`;
                const value = responses[questionKey];
                if (value === undefined || value === null || value < 1 || value > 5 || !Number.isInteger(value)) {
                    console.warn(`Invalid response for ${questionKey}: ${value}`);
                    return false;
                }
            }
            return true;
        }
        catch (error) {
            console.error('Error validating SUS responses:', error);
            return false;
        }
    }
    calculateScore(responses) {
        try {
            if (!this.validateResponses(responses)) {
                console.error('Invalid SUS responses provided');
                return 0;
            }
            let totalScore = 0;
            for (let i = 1; i <= 10; i++) {
                const questionKey = `q${i}`;
                const value = responses[questionKey] || 0;
                if (i % 2 === 1) {
                    totalScore += (value - 1) * 2.5;
                }
                else {
                    totalScore += (5 - value) * 2.5;
                }
            }
            const finalScore = Math.max(0, Math.min(100, totalScore));
            console.log(`SUS Score calculated: ${finalScore} from responses:`, responses);
            return finalScore;
        }
        catch (error) {
            console.error('Error calculating SUS score:', error);
            return 0;
        }
    }
    interpretScore(score) {
        try {
            const clampedScore = Math.max(0, Math.min(100, score));
            let percentileRank;
            let adjectiveRating;
            let acceptability;
            let grade;
            if (clampedScore >= 90) {
                percentileRank = 96;
                adjectiveRating = 'Excellent';
                acceptability = 'Acceptable';
                grade = 'A+';
            }
            else if (clampedScore >= 85) {
                percentileRank = 90;
                adjectiveRating = 'Excellent';
                acceptability = 'Acceptable';
                grade = 'A';
            }
            else if (clampedScore >= 80) {
                percentileRank = 80;
                adjectiveRating = 'Good';
                acceptability = 'Acceptable';
                grade = 'B+';
            }
            else if (clampedScore >= 75) {
                percentileRank = 70;
                adjectiveRating = 'Good';
                acceptability = 'Acceptable';
                grade = 'B';
            }
            else if (clampedScore >= 70) {
                percentileRank = 60;
                adjectiveRating = 'Good';
                acceptability = 'Acceptable';
                grade = 'C+';
            }
            else if (clampedScore >= 68) {
                percentileRank = 50;
                adjectiveRating = 'OK';
                acceptability = 'Marginal';
                grade = 'C';
            }
            else if (clampedScore >= 60) {
                percentileRank = 35;
                adjectiveRating = 'OK';
                acceptability = 'Marginal';
                grade = 'C-';
            }
            else if (clampedScore >= 50) {
                percentileRank = 25;
                adjectiveRating = 'Poor';
                acceptability = 'Not Acceptable';
                grade = 'D';
            }
            else {
                percentileRank = 10;
                adjectiveRating = 'Awful';
                acceptability = 'Not Acceptable';
                grade = 'F';
            }
            const interpretation = {
                score: clampedScore,
                percentileRank,
                percentileText: `${percentileRank}%`,
                adjectiveRating,
                acceptability,
                grade
            };
            console.log(`SUS Score ${clampedScore} interpreted as:`, interpretation);
            return interpretation;
        }
        catch (error) {
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
    analyzeResponses(responses) {
        const score = this.calculateScore(responses);
        return this.interpretScore(score);
    }
    async getDashboardStatistics() {
        try {
            console.log('🔍 [DEBUG] Starting getDashboardStatistics()...');
            const responses = await DB_1.default.from("questionnaire_responses").select("*");
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
            const totalKuesioner = totalResponden;
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
                    }
                    else if (response.responses) {
                        const parsedResponses = JSON.parse(response.responses);
                        const calculatedScore = this.calculateScore(parsedResponses);
                        if (calculatedScore > 0) {
                            totalScore += calculatedScore;
                            validResponses++;
                            console.log('🔍 [DEBUG] Calculated score:', calculatedScore, 'Total:', totalScore, 'Valid:', validResponses);
                        }
                    }
                    else {
                        console.log('🔍 [DEBUG] Skipping response (no valid score):', response.id);
                    }
                }
                catch (error) {
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
        }
        catch (error) {
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
    async getChartData() {
        try {
            console.log('📊 [DEBUG] Starting getChartData()...');
            const responses = await DB_1.default.from("questionnaire_responses").select("*").orderBy('created_at', 'asc');
            console.log('📊 [DEBUG] Chart data responses found:', responses.length);
            const scoreRanges = [
                { label: '0-20', min: 0, max: 20, count: 0 },
                { label: '21-40', min: 21, max: 40, count: 0 },
                { label: '41-60', min: 41, max: 60, count: 0 },
                { label: '61-80', min: 61, max: 80, count: 0 },
                { label: '81-100', min: 81, max: 100, count: 0 }
            ];
            const monthlyData = {};
            for (const response of responses) {
                let score = 0;
                try {
                    if (response.sus_score && response.sus_score > 0) {
                        score = response.sus_score;
                    }
                    else if (response.responses) {
                        const parsedResponses = JSON.parse(response.responses);
                        score = this.calculateScore(parsedResponses);
                    }
                    if (score > 0) {
                        for (const range of scoreRanges) {
                            if (score >= range.min && score <= range.max) {
                                range.count++;
                                break;
                            }
                        }
                        const date = new Date(response.created_at);
                        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                        if (!monthlyData[monthKey]) {
                            monthlyData[monthKey] = { total: 0, count: 0 };
                        }
                        monthlyData[monthKey].total += score;
                        monthlyData[monthKey].count++;
                    }
                }
                catch (error) {
                    console.warn(`Error processing response ${response.id} for chart data:`, error);
                }
            }
            const trendLabels = Object.keys(monthlyData).sort();
            const trendData = trendLabels.map(month => {
                const data = monthlyData[month];
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
                }
            };
        }
        catch (error) {
            console.error('Error getting chart data:', error);
            return {
                scoreDistribution: {
                    labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
                    data: [0, 0, 0, 0, 0]
                },
                trendData: {
                    labels: [],
                    data: []
                }
            };
        }
    }
    calculateGrade(score) {
        if (score >= 90)
            return 'A+';
        if (score >= 85)
            return 'A';
        if (score >= 80)
            return 'B+';
        if (score >= 75)
            return 'B';
        if (score >= 70)
            return 'C+';
        if (score >= 65)
            return 'C';
        if (score >= 60)
            return 'C-';
        if (score >= 50)
            return 'D';
        return 'F';
    }
    normalizeResponses(responses) {
        try {
            let normalized = {};
            if (typeof responses === 'string') {
                responses = JSON.parse(responses);
            }
            if (typeof responses === 'object' && responses !== null) {
                for (let i = 1; i <= 10; i++) {
                    const questionKey = `q${i}`;
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
        }
        catch (error) {
            console.error('Error normalizing SUS responses:', error);
            return {};
        }
    }
    async getPaginatedResponses(page = 1, limit = 10, search = "", genderFilter = "", proficiencyFilter = "") {
        try {
            const sanitizedPage = Math.max(1, Math.min(page, 1000));
            const sanitizedLimit = Math.max(1, Math.min(limit, 100));
            const sanitizedSearch = search.trim().slice(0, 100);
            let query = DB_1.default.from("questionnaire_responses")
                .select(['id', 'name', 'age', 'gender', 'digital_proficiency', 'sus_score', 'responses', 'created_at']);
            if (sanitizedSearch) {
                query = query.where(function () {
                    this.whereRaw('LOWER(name) LIKE ?', [`%${sanitizedSearch.toLowerCase()}%`]);
                });
            }
            if (genderFilter && genderFilter !== 'all' && genderFilter !== '') {
                query = query.where('gender', genderFilter);
            }
            if (proficiencyFilter && proficiencyFilter !== 'all' && proficiencyFilter !== '') {
                query = query.where('digital_proficiency', proficiencyFilter);
            }
            const countQuery = query.clone();
            const totalResult = await countQuery.count('* as count').first();
            const total = totalResult?.count || 0;
            const offset = (sanitizedPage - 1) * sanitizedLimit;
            const totalPages = Math.ceil(Number(total) / sanitizedLimit);
            const responses = await query
                .orderBy('created_at', 'desc')
                .orderBy('id', 'desc')
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
        }
        catch (error) {
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
exports.default = new SUSService();
//# sourceMappingURL=SUSService.js.map