import DB from "../services/DB";
import { Response, Request } from "../../type";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

class QuestionnaireController {
    /**
     * Menampilkan halaman informasi pengguna (langkah 1)
     */
    public async userInfoPage(request: Request, response: Response) {
        return response.inertia("questionnaire/UserInfo", {});
    }

    /**
     * Memproses data informasi pengguna dan menyimpan ke session
     */
    public async processUserInfo(request: Request, response: Response) {
        try {
            // Mendapatkan data dari request body menggunakan HyperExpress method
            const body = await request.json();
            const { name, age, gender, digital_proficiency } = body;
            
            console.log('Received data:', { name, age, gender, digital_proficiency });

            // Validasi data
            if (!name || !age || !gender || !digital_proficiency) {
                return response
                    .cookie("error", "Semua field harus diisi", 3000)
                    .redirect("/questionnaire");
            }

            // Validasi usia
            if (age < 1 || age > 120) {
                return response
                    .cookie("error", "Usia tidak valid", 3000)
                    .redirect("/questionnaire");
            }

            // Validasi gender
            if (!['Laki-laki', 'Perempuan'].includes(gender)) {
                return response
                    .cookie("error", "Jenis kelamin tidak valid", 3000)
                    .redirect("/questionnaire");
            }

            // Validasi digital proficiency
            if (!['Pemula', 'Menengah', 'Mahir'].includes(digital_proficiency)) {
                return response
                    .cookie("error", "Kemahiran digital tidak valid", 3000)
                    .redirect("/questionnaire");
            }

            // Simpan data ke session
            const userInfo = {
                name: name.trim(),
                age: parseInt(age),
                gender,
                digital_proficiency
            };

            // Simpan ke cookie session untuk sementara
            return response
                .cookie("questionnaire_user_info", JSON.stringify(userInfo), 3600000) // 1 jam
                .redirect("/questionnaire/survey");

        } catch (error) {
            console.error("Error processing user info:", error);
            return response
                .cookie("error", "Terjadi kesalahan server", 3000)
                .redirect("/questionnaire");
        }
    }

    /**
     * Menampilkan halaman kuesioner (langkah 2)
     */
    public async surveyPage(request: Request, response: Response) {
        try {
            // Ambil data user info dari session
            const userInfoCookie = request.cookies.questionnaire_user_info;
            
            if (!userInfoCookie) {
                return response.redirect("/questionnaire");
            }

            const userInfo = JSON.parse(userInfoCookie);
            
            return response.inertia("questionnaire/Survey", {
                userInfo
            });

        } catch (error) {
            console.error("Error loading survey page:", error);
            return response.redirect("/questionnaire");
        }
    }

    /**
     * Menyimpan hasil kuesioner final ke database
     */
    public async submitSurvey(request: Request, response: Response) {
        try {
            const { responses } = await request.json();

            // Ambil data user info dari session
            const userInfoCookie = request.cookies.questionnaire_user_info;
            
            if (!userInfoCookie) {
                return response
                    .cookie("error", "Data pengguna tidak ditemukan. Silakan mulai dari awal.", 3000)
                    .redirect("/questionnaire");
            }

            const userInfo = JSON.parse(userInfoCookie);

            // Validasi responses
            if (!responses || typeof responses !== 'object') {
                return response
                    .cookie("error", "Data kuesioner tidak valid", 3000)
                    .redirect("/questionnaire/survey");
            }

            // Simpan ke database
            const questionnaireData = {
                id: randomUUID(),
                name: userInfo.name,
                age: userInfo.age,
                gender: userInfo.gender,
                digital_proficiency: userInfo.digital_proficiency,
                responses: JSON.stringify(responses),
                created_at: dayjs().valueOf(),
                updated_at: dayjs().valueOf()
            };

            await DB.from("questionnaire_responses").insert(questionnaireData);

            // Hapus cookie session setelah berhasil disimpan
            return response
                .cookie("questionnaire_user_info", "", 0) // Hapus cookie
                .redirect(`/questionnaire/result/${questionnaireData.id}`);

        } catch (error) {
            console.error("Error submitting survey:", error);
            return response
                .cookie("error", "Terjadi kesalahan saat menyimpan data", 3000)
                .redirect("/questionnaire/survey");
        }
    }

    /**
     * Menampilkan halaman hasil survey dengan SUS score
     */
    public async resultPage(request: Request, response: Response) {
        try {
            const surveyId = request.params.id;

            // Ambil data survey dari database
            const surveyData = await DB.from("questionnaire_responses")
                .where("id", surveyId)
                .first();

            if (!surveyData) {
                return response.status(404).send("Data survey tidak ditemukan");
            }

            // Parse responses dari JSON
            const responses = JSON.parse(surveyData.responses);

            // Hitung SUS Score
            let totalScore = 0;
            for (let i = 1; i <= 10; i++) {
                const questionKey = `q${i}`;
                const value = parseInt(responses[questionKey]);
                
                if (i % 2 === 1) {
                    // Pertanyaan ganjil (1,3,5,7,9): score - 1
                    totalScore += (value - 1);
                } else {
                    // Pertanyaan genap (2,4,6,8,10): 5 - score
                    totalScore += (5 - value);
                }
            }

            // Total SUS Score = sum * 2.5
            const susScore = totalScore * 2.5;

            // Tentukan kategori score
            let category = "";
            let categoryColor = "";
            if (susScore >= 85) {
                category = "Excellent";
                categoryColor = "green";
            } else if (susScore >= 70) {
                category = "Good";
                categoryColor = "blue";
            } else if (susScore >= 50) {
                category = "OK";
                categoryColor = "yellow";
            } else {
                category = "Poor";
                categoryColor = "red";
            }

            // Siapkan data untuk halaman hasil
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
                surveyId: surveyId,
                submittedAt: dayjs(surveyData.created_at).format("DD MMMM YYYY, HH:mm")
            };

            return response.inertia("questionnaire/Result", resultData);

        } catch (error) {
            console.error("Error loading result page:", error);
            return response.status(500).send("Terjadi kesalahan saat memuat halaman hasil");
        }
    }

    /**
     * Menampilkan halaman terima kasih setelah submit
     */
    public async thankYouPage(request: Request, response: Response) {
        return response.inertia("questionnaire/ThankYou", {});
    }
}

export default new QuestionnaireController(); 