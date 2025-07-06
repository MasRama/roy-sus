"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Controller {
    async index(request, response) {
        try {
            return response.inertia("Landing", {
                message: "Welcome to CuciBaju.id SUS Questionnaire System"
            });
        }
        catch (error) {
            console.error('Error loading landing page:', error);
            return response.inertia("Landing", {
                message: "Welcome to CuciBaju.id SUS Questionnaire System"
            });
        }
    }
}
exports.default = new Controller();
//# sourceMappingURL=HomeController.js.map