import DB from "../services/DB";
import { Response, Request } from "../../type";
import dayjs from "dayjs";
import fs from "fs";
import path from "path";

class SurveyController {
    /**
     * Menampilkan halaman informasi pengguna untuk survey
     */
    public async surveyUserInfoPage(request: Request, response: Response) {
        return response.inertia("survey/user-info");
    }

    /**
     * Memproses dan menyimpan data informasi pengguna ke session
     */
    public async processSurveyUserInfo(request: Request, response: Response) {
        try {
            const { user_name, user_age, user_gender, digital_skill_level } = await request.json();

            // Validasi input
            if (!user_name || !user_age || !user_gender || !digital_skill_level) {
                return response.status(400).json({ 
                    error: "Semua field harus diisi" 
                });
            }

            if (user_age < 13 || user_age > 120) {
                return response.status(400).json({ 
                    error: "Usia harus antara 13-120 tahun" 
                });
            }

            const validGenders = ['laki-laki', 'perempuan'];
            if (!validGenders.includes(user_gender)) {
                return response.status(400).json({ 
                    error: "Jenis kelamin tidak valid" 
                });
            }

            const validSkillLevels = ['pemula', 'menengah', 'mahir'];
            if (!validSkillLevels.includes(digital_skill_level)) {
                return response.status(400).json({ 
                    error: "Tingkat kemahiran digital tidak valid" 
                });
            }

            // Simpan data ke session
            request.session.survey_user_info = {
                user_name,
                user_age: parseInt(user_age),
                user_gender,
                digital_skill_level
            };

            return response.redirect("/survey/questions");
        } catch (error) {
            console.error("Error processing survey user info:", error);
            return response.status(500).json({ 
                error: "Terjadi kesalahan server" 
            });
        }
    }

    /**
     * Menampilkan halaman pertanyaan survey dengan data dari JSON
     */
    public async surveyQuestionsPage(request: Request, response: Response) {
        try {
            // Cek apakah user info sudah ada di session
            if (!request.session.survey_user_info) {
                return response.redirect("/survey/user-info");
            }

            // Load questions dari JSON file
            const questionsPath = path.join(process.cwd(), 'public', 'data', 'survey-questions.json');
            
            let surveyData;
            try {
                const questionsContent = fs.readFileSync(questionsPath, 'utf8');
                surveyData = JSON.parse(questionsContent);
            } catch (fileError) {
                console.error("Error loading survey questions:", fileError);
                return response.status(500).json({ 
                    error: "Gagal memuat pertanyaan survey" 
                });
            }

            return response.inertia("survey/questions", {
                surveyData,
                userInfo: request.session.survey_user_info
            });
        } catch (error) {
            console.error("Error loading survey questions page:", error);
            return response.status(500).json({ 
                error: "Terjadi kesalahan server" 
            });
        }
    }

    /**
     * Memproses dan menyimpan jawaban survey ke database
     */
    public async processSurveyQuestions(request: Request, response: Response) {
        try {
            // Cek apakah user info ada di session
            if (!request.session.survey_user_info) {
                return response.status(400).json({ 
                    error: "Data pengguna tidak ditemukan. Silakan mulai dari awal." 
                });
            }

            const { answers } = await request.json();

            if (!answers || typeof answers !== 'object') {
                return response.status(400).json({ 
                    error: "Jawaban tidak valid" 
                });
            }

            const userInfo = request.session.survey_user_info;

            // Simpan ke database
            const surveyResponse = {
                user_name: userInfo.user_name,
                user_age: userInfo.user_age,
                user_gender: userInfo.user_gender,
                digital_skill_level: userInfo.digital_skill_level,
                answers: JSON.stringify(answers),
                created_at: dayjs().valueOf(),
                updated_at: dayjs().valueOf()
            };

            await DB.table("survey_responses").insert(surveyResponse);

            // Hapus data dari session setelah berhasil disimpan
            delete request.session.survey_user_info;

            return response.json({ 
                message: "Terima kasih! Jawaban Anda telah berhasil disimpan.",
                success: true
            });
        } catch (error) {
            console.error("Error processing survey answers:", error);
            return response.status(500).json({ 
                error: "Terjadi kesalahan saat menyimpan jawaban" 
            });
        }
    }

    /**
     * Redirect dari /survey ke /survey/user-info
     */
    public async surveyIndex(request: Request, response: Response) {
        return response.redirect("/survey/user-info");
    }
}

export default new SurveyController();