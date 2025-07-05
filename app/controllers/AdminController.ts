import DB from "../services/DB";
import { Request, Response } from "../../type";

class AdminController {
    /**
     * Get paginated questionnaire responses
     * For AJAX requests from the dashboard table
     */
    public async getQuestionnaireResponses(request: Request, response: Response) {
        // Check if user is admin
        if (!request.user.is_admin) {
            return response.status(403).json({ error: 'Unauthorized access' });
        }

        try {
            const page = parseInt(request.query.page as string) || 1;
            const limit = parseInt(request.query.limit as string) || 10;
            const offset = (page - 1) * limit;

            // Get total count
            const totalResult = await DB.from("questionnaire_responses")
                .count('* as total')
                .first();
            const total = totalResult?.total || 0;

            // Get paginated responses
            const responses = await DB.from("questionnaire_responses")
                .select('*')
                .orderBy('created_at', 'desc')
                .limit(limit)
                .offset(offset);

            return response.json({
                data: responses,
                pagination: {
                    current_page: page,
                    per_page: limit,
                    total: total,
                    total_pages: Math.ceil(total / limit)
                }
            });

        } catch (error) {
            console.error('Error getting questionnaire responses:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Admin Dashboard
     * Displays statistics and data for admin users only
     */
    public async dashboard(request: Request, response: Response) {
        // Check if user is admin
        if (!request.user.is_admin) {
            return response.status(403).json({ error: 'Unauthorized access' });
        }

        try {
            // Use Promise.all for parallel queries to optimize performance
            const [statisticsResult, recentResponses] = await Promise.all([
                // Get statistics from questionnaire_responses
                DB.from("questionnaire_responses")
                    .select(
                        DB.raw('COUNT(*) as total_responden'),
                        DB.raw("AVG(CAST(json_extract(responses, '$.sus_score') AS DECIMAL(5,2))) as rata_rata_sus_score"),
                        DB.raw('COUNT(DISTINCT id) as total_kuesioner')
                    )
                    .first(),
                
                // Get 10 most recent responses for the table
                DB.from("questionnaire_responses")
                    .select('*')
                    .orderBy('created_at', 'desc')
                    .limit(10)
            ]);

            // Prepare statistics data
            const statistics = {
                total_responden: statisticsResult?.total_responden || 0,
                rata_rata_sus_score: parseFloat(statisticsResult?.rata_rata_sus_score || '0').toFixed(1),
                total_kuesioner: statisticsResult?.total_kuesioner || 0
            };

            // Process recent responses for display
            const processedResponses = recentResponses.map(response => {
                let parsedResponses = {};
                let susScore = 0;
                
                try {
                    parsedResponses = JSON.parse(response.responses);
                    susScore = (parsedResponses as any).sus_score || 0;
                } catch (e) {
                    console.error('Error parsing responses:', e);
                }

                return {
                    ...response,
                    parsed_responses: parsedResponses,
                    sus_score: susScore
                };
            });

            // Calculate SUS score interpretation
            const avgScore = parseFloat(statistics.rata_rata_sus_score);
            let percentileRank = '0%';
            let adjectiveRating = 'Poor';
            let acceptability = 'Not Acceptable';

            if (avgScore >= 80) {
                percentileRank = '90%';
                adjectiveRating = 'Excellent';
                acceptability = 'Acceptable';
            } else if (avgScore >= 70) {
                percentileRank = '70%';
                adjectiveRating = 'Good';
                acceptability = 'Acceptable';
            } else if (avgScore >= 60) {
                percentileRank = '60%';
                adjectiveRating = 'OK';
                acceptability = 'Marginal';
            } else if (avgScore >= 50) {
                percentileRank = '40%';
                adjectiveRating = 'Poor';
                acceptability = 'Not Acceptable';
            }

            const susInterpretation = {
                percentile_rank: percentileRank,
                adjective_rating: adjectiveRating,
                acceptability: acceptability
            };

            // Return data to Inertia view
            return response.inertia('Admin/Dashboard', {
                statistics,
                recent_responses: processedResponses,
                sus_interpretation: susInterpretation
            });

        } catch (error) {
            console.error('Error in admin dashboard:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default new AdminController();