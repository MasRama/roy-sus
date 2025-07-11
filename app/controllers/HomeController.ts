import { Response, Request } from "../../type";

class Controller {
    
    public async index (request : Request, response : Response) { 
        try {
            // Simple landing page without sensitive questionnaire data
            return response.inertia("Landing", {
                title: "CuciBaju Xperience Survey - Bantu Kami Meningkatkan Layanan",
                description: "Berpartisipasilah dalam survei pengalaman pengguna CuciBaju.id. Pendapat Anda sangat berharga untuk meningkatkan kualitas layanan laundry online terpercaya kami.",
                message: "Welcome to CuciBaju.id SUS Questionnaire System"
            });
            
        } catch (error) {
            console.error('Error loading landing page:', error);
            
            // Fallback to basic landing page
            return response.inertia("Landing", {
                title: "CuciBaju Xperience Survey - Bantu Kami Meningkatkan Layanan",
                description: "Berpartisipasilah dalam survei pengalaman pengguna CuciBaju.id. Pendapat Anda sangat berharga untuk meningkatkan kualitas layanan laundry online terpercaya kami.",
                message: "Welcome to CuciBaju.id SUS Questionnaire System"
            });
        }
    }
}

export default new Controller()
