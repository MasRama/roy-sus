"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
const crypto_1 = require("crypto");
const dayjs_1 = __importDefault(require("dayjs"));
const SUSService_1 = __importDefault(require("../services/SUSService"));
class QuestionnaireController {
    async userInfoPage(request, response) {
        return response.inertia("questionnaire/UserInfo", {});
    }
    async processUserInfo(request, response) {
        try {
            const body = await request.json();
            const { name, age, gender, digital_proficiency } = body;
            console.log('Received data:', { name, age, gender, digital_proficiency });
            if (!name || !age || !gender || !digital_proficiency) {
                return response
                    .cookie("error", "Semua field harus diisi", 3000)
                    .redirect("/questionnaire");
            }
            if (age < 1 || age > 120) {
                return response
                    .cookie("error", "Usia tidak valid", 3000)
                    .redirect("/questionnaire");
            }
            if (!['Laki-laki', 'Perempuan'].includes(gender)) {
                return response
                    .cookie("error", "Jenis kelamin tidak valid", 3000)
                    .redirect("/questionnaire");
            }
            if (!['Pemula', 'Menengah', 'Mahir'].includes(digital_proficiency)) {
                return response
                    .cookie("error", "Kemahiran digital tidak valid", 3000)
                    .redirect("/questionnaire");
            }
            const userInfo = {
                name: name.trim(),
                age: parseInt(age),
                gender,
                digital_proficiency
            };
            return response
                .cookie("questionnaire_user_info", JSON.stringify(userInfo), 3600000)
                .redirect("/questionnaire/survey");
        }
        catch (error) {
            console.error("Error processing user info:", error);
            return response
                .cookie("error", "Terjadi kesalahan server", 3000)
                .redirect("/questionnaire");
        }
    }
    async surveyPage(request, response) {
        try {
            const userInfoCookie = request.cookies.questionnaire_user_info;
            if (!userInfoCookie) {
                return response.redirect("/questionnaire");
            }
            const userInfo = JSON.parse(userInfoCookie);
            return response.inertia("questionnaire/Survey", {
                userInfo
            });
        }
        catch (error) {
            console.error("Error loading survey page:", error);
            return response.redirect("/questionnaire");
        }
    }
    async submitSurvey(request, response) {
        try {
            const { responses } = await request.json();
            const userInfoCookie = request.cookies.questionnaire_user_info;
            if (!userInfoCookie) {
                return response
                    .cookie("error", "Data pengguna tidak ditemukan. Silakan mulai dari awal.", 3000)
                    .redirect("/questionnaire");
            }
            const userInfo = JSON.parse(userInfoCookie);
            if (!responses || typeof responses !== 'object') {
                return response
                    .cookie("error", "Data kuesioner tidak valid", 3000)
                    .redirect("/questionnaire/survey");
            }
            const susScore = SUSService_1.default.calculateScore(responses);
            const questionnaireData = {
                id: (0, crypto_1.randomUUID)(),
                name: userInfo.name,
                age: userInfo.age,
                gender: userInfo.gender,
                digital_proficiency: userInfo.digital_proficiency,
                responses: JSON.stringify(responses),
                sus_score: susScore,
                created_at: (0, dayjs_1.default)().valueOf(),
                updated_at: (0, dayjs_1.default)().valueOf()
            };
            await DB_1.default.from("questionnaire_responses").insert(questionnaireData);
            return response
                .cookie("questionnaire_user_info", "", 0)
                .redirect(`/questionnaire/result/${questionnaireData.id}`);
        }
        catch (error) {
            console.error("Error submitting survey:", error);
            return response
                .cookie("error", "Terjadi kesalahan saat menyimpan data", 3000)
                .redirect("/questionnaire/survey");
        }
    }
    async resultPage(request, response) {
        try {
            const surveyId = request.params.id;
            const surveyData = await DB_1.default.from("questionnaire_responses")
                .where("id", surveyId)
                .first();
            if (!surveyData) {
                return response.status(404).send("Data survey tidak ditemukan");
            }
            const responses = JSON.parse(surveyData.responses);
            const susScore = SUSService_1.default.calculateScore(responses);
            const interpretation = SUSService_1.default.interpretScore(susScore);
            let category = interpretation.adjectiveRating;
            let categoryColor = "";
            if (susScore >= 85) {
                categoryColor = "green";
            }
            else if (susScore >= 70) {
                categoryColor = "blue";
            }
            else if (susScore >= 50) {
                categoryColor = "yellow";
            }
            else {
                categoryColor = "red";
            }
            const resultData = {
                userInfo: {
                    name: surveyData.name,
                    age: surveyData.age,
                    gender: surveyData.gender,
                    digital_proficiency: surveyData.digital_proficiency
                },
                susScore: susScore,
                category: category,
                categoryColor: categoryColor,
                interpretation: interpretation,
                surveyId: surveyId,
                submittedAt: (0, dayjs_1.default)(surveyData.created_at).format("DD MMMM YYYY, HH:mm")
            };
            return response.inertia("questionnaire/Result", resultData);
        }
        catch (error) {
            console.error("Error loading result page:", error);
            return response.status(500).send("Terjadi kesalahan saat memuat halaman hasil");
        }
    }
    async thankYouPage(request, response) {
        return response.inertia("questionnaire/ThankYou", {});
    }
}
exports.default = new QuestionnaireController();
//# sourceMappingURL=QuestionnaireController.js.map