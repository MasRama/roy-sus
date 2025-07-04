import { Response, Request } from "../../type";

class DashboardController {
    
    public async index (request : Request, response : Response) { 
        return response.inertia("Dashboard", {
            title: "CuciBaju Xperience Survey",
            description: "Bantu kami mengevaluasi pengalaman pengguna website cucibaju.id melalui kuesioner System Usability Scale (SUS). Feedback Anda akan membantu kami meningkatkan kemudahan dan kenyamanan dalam menggunakan platform digital kami."
        });
    }
}

export default new DashboardController();