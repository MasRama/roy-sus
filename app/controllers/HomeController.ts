import { Response, Request } from "../../type";

class Controller {
    
    public async index (request : Request, response : Response) { 
        try {
            // Simple landing page without sensitive questionnaire data
            return response.inertia("Landing", {
                // Basic landing page data only
                message: "Welcome to CuciBaju.id SUS Questionnaire System"
            });
            
        } catch (error) {
            console.error('Error loading landing page:', error);
            
            // Fallback to basic landing page
            return response.inertia("Landing", {
                message: "Welcome to CuciBaju.id SUS Questionnaire System"
            });
        }
    }
}

export default new Controller()
