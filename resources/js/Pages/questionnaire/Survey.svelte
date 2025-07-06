<script>
    import { router } from '@inertiajs/svelte';
    import { fly } from 'svelte/transition';
    import SurveyProgress from '../../Components/SurveyProgress.svelte';

    export let userInfo;
    export let error = '';

    // SUS (System Usability Scale) Questions
    const susQuestions = [
        "Saya pikir akan sering menggunakan website cucibaju.id",
        "Saya merasa website cucibaju.id terlalu rumit untuk digunakan",
        "Saya pikir website cucibaju.id mudah untuk digunakan",
        "Saya memerlukan bantuan teknis untuk menggunakan website cucibaju.id",
        "Saya merasa berbagai fitur di website cucibaju.id terintegrasi dengan baik",
        "Saya pikir ada terlalu banyak hal yang tidak konsisten di website cucibaju.id",
        "Saya pikir kebanyakan orang akan belajar menggunakan website cucibaju.id dengan sangat cepat",
        "Saya merasa website cucibaju.id sangat merepotkan untuk digunakan",
        "Saya merasa sangat percaya diri menggunakan website cucibaju.id",
        "Saya perlu belajar banyak hal sebelum bisa menggunakan website cucibaju.id"
    ];

    const scaleLabels = [
        "Sangat Tidak Setuju",
        "Tidak Setuju", 
        "Netral",
        "Setuju",
        "Sangat Setuju"
    ];

    let responses = {};
    let isLoading = false;
    let clientError = '';

    // Initialize responses
    susQuestions.forEach((_, index) => {
        responses[`q${index + 1}`] = null;
    });

    function submitSurvey() {
        clientError = '';
        
        // Validate all questions are answered
        const unansweredQuestions = [];
        susQuestions.forEach((_, index) => {
            if (responses[`q${index + 1}`] === null || responses[`q${index + 1}`] === undefined) {
                unansweredQuestions.push(index + 1);
            }
        });

        if (unansweredQuestions.length > 0) {
            clientError = `Mohon jawab semua pertanyaan. Pertanyaan yang belum dijawab: ${unansweredQuestions.join(', ')}`;
            return;
        }

        isLoading = true;

        // Menggunakan Inertia.js untuk submit yang lebih baik
        router.post('/questionnaire/submit', {
            responses: responses
        }, {
            onStart: () => {
                isLoading = true;
            },
            onFinish: () => {
                isLoading = false;
            },
            onError: (errors) => {
                clientError = errors.error || 'Terjadi kesalahan saat menyimpan data';
                isLoading = false;
            }
        });
    }

    function getProgressPercentage() {
        const answeredCount = Object.values(responses).filter(response => response !== null && response !== undefined).length;
        return (answeredCount / susQuestions.length) * 100;
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
    <!-- Survey Progress -->
    <div class="pt-8">
        <SurveyProgress currentStep={2} totalSteps={2} />
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 pb-8" in:fly={{ y: 20, duration: 600, delay: 200 }}>
        <!-- User Info Review -->
        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 mb-6 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informasi Anda</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <span class="text-gray-500 dark:text-gray-400">Nama:</span>
                    <p class="font-medium text-gray-900 dark:text-white">{userInfo.name}</p>
                </div>
                <div>
                    <span class="text-gray-500 dark:text-gray-400">Usia:</span>
                    <p class="font-medium text-gray-900 dark:text-white">{userInfo.age} tahun</p>
                </div>
                <div>
                    <span class="text-gray-500 dark:text-gray-400">Jenis Kelamin:</span>
                    <p class="font-medium text-gray-900 dark:text-white">{userInfo.gender}</p>
                </div>
                <div>
                    <span class="text-gray-500 dark:text-gray-400">Kemahiran Digital:</span>
                    <p class="font-medium text-gray-900 dark:text-white">{userInfo.digital_proficiency}</p>
                </div>
            </div>
        </div>

        <!-- Survey Form -->
        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 p-8 text-center">
                <h1 class="text-2xl font-bold text-white mb-2">Kuesioner</h1>
                <p class="text-purple-100 dark:text-purple-200">
                    Berikan penilaian Anda terhadap pengalaman menggunakan website cucibaju.id
                </p>
            </div>

            <!-- Form Content -->
            <div class="p-8">
                {#if error || clientError}
                    <div class="p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400 dark:bg-red-900/50 border border-red-200 dark:border-red-800" role="alert">
                        <svg class="inline w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                        </svg>
                        {error || clientError}
                    </div>
                {/if}

                <!-- Progress Indicator -->
                <div class="mb-8">
                    <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Progress Kuesioner</span>
                        <span>{Math.round(getProgressPercentage())}% ({Object.values(responses).filter(r => r !== null && r !== undefined).length}/{susQuestions.length})</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                            class="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-300"
                            style="width: {getProgressPercentage()}%"
                        ></div>
                    </div>
                </div>

                <form class="space-y-8" on:submit|preventDefault={submitSurvey}>
                    <!-- SUS Explanation -->
                    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6 mb-6">
                        <div class="flex items-center mb-4">
                            <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <h3 class="text-lg font-medium text-indigo-900 dark:text-indigo-300">Tentang Kuesioner SUS (System Usability Scale)</h3>
                        </div>
                        <div class="space-y-3 text-sm text-indigo-800 dark:text-indigo-400">
                            <p>
                                <strong>SUS (System Usability Scale)</strong> adalah metode standar internasional untuk mengukur kemudahan penggunaan website atau aplikasi. Kuesioner ini terdiri dari 10 pernyataan yang dirancang khusus untuk menilai pengalaman pengguna.
                            </p>
                            <div class="bg-indigo-100 dark:bg-indigo-800/50 rounded-lg p-4">
                                <h4 class="font-semibold mb-2 text-indigo-900 dark:text-indigo-300">📊 Informasi Penting tentang Skor SUS:</h4>
                                <ul class="space-y-1 text-xs">
                                    <li>• <strong>Skor rata-rata industri: 68</strong> (tidak selalu berarti buruk)</li>
                                    <li>• <strong>Skor 50 untuk "setuju semua"</strong> adalah normal dan sesuai standar</li>
                                    <li>• <strong>Skor 80+ dianggap baik</strong> untuk kemudahan penggunaan</li>
                                    <li>• <strong>Pernyataan ganjil (1,3,5,7,9)</strong> bersifat positif</li>
                                    <li>• <strong>Pernyataan genap (2,4,6,8,10)</strong> bersifat negatif (terbalik)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Instructions -->
                    <div class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <h3 class="text-lg font-medium text-blue-900 dark:text-blue-300 mb-3">Petunjuk Pengisian</h3>
                        <p class="text-blue-800 dark:text-blue-400 mb-3">
                            Berikut adalah 10 pernyataan tentang website cucibaju.id. <strong>Baca dengan teliti</strong> karena beberapa pernyataan bersifat positif dan beberapa bersifat negatif. Berikan penilaian Anda untuk setiap pernyataan dengan skala:
                        </p>
                        <div class="grid grid-cols-1 md:grid-cols-5 gap-2 text-sm mb-4">
                            {#each scaleLabels as label, index}
                                <div class="text-center p-2 bg-blue-100 dark:bg-blue-800/50 rounded">
                                    <div class="font-semibold">{index + 1}</div>
                                    <div class="text-xs">{label}</div>
                                </div>
                            {/each}
                        </div>
                        <div class="bg-blue-100 dark:bg-blue-800/50 rounded-lg p-3 text-xs">
                            <strong>💡 Tips:</strong> Jawablah dengan jujur berdasarkan pengalaman Anda. Tidak ada jawaban yang benar atau salah. Perhatikan apakah pernyataan bersifat positif atau negatif sebelum memilih jawaban.
                        </div>
                    </div>

                    <!-- Questions -->
                    {#each susQuestions as question, index}
                        <div class="space-y-4 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                            <div class="flex items-start gap-3">
                                <h4 class="text-lg font-medium text-gray-900 dark:text-white flex-1">
                                    {index + 1}. {question}
                                </h4>
                                <div class="flex-shrink-0">
                                    {#if (index + 1) % 2 === 1}
                                        <div class="group relative">
                                            <div class="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs font-bold cursor-help">
                                                +
                                            </div>
                                            <div class="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10">
                                                <div class="bg-green-600 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                                                    Pernyataan Positif
                                                    <div class="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-600"></div>
                                                </div>
                                            </div>
                                        </div>
                                    {:else}
                                        <div class="group relative">
                                            <div class="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-xs font-bold cursor-help">
                                                -
                                            </div>
                                            <div class="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10">
                                                <div class="bg-orange-600 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                                                    Pernyataan Negatif
                                                    <div class="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-orange-600"></div>
                                                </div>
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-5 gap-2">
                                {#each scaleLabels as label, scaleIndex}
                                    <label class="relative cursor-pointer">
                                        <input
                                            bind:group={responses[`q${index + 1}`]}
                                            type="radio"
                                            value={scaleIndex + 1}
                                            class="sr-only peer"
                                            required
                                        />
                                        <div class="p-3 text-center rounded-lg border-2 border-gray-200 dark:border-gray-600 peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/30 peer-checked:text-purple-700 dark:peer-checked:text-purple-300 hover:border-purple-300 transition-all duration-200">
                                            <div class="font-bold text-lg">{scaleIndex + 1}</div>
                                            <div class="text-xs mt-1 leading-tight">{label}</div>
                                        </div>
                                    </label>
                                {/each}
                            </div>
                        </div>
                    {/each}

                    <!-- Additional Comments (Optional) -->
                    <div class="space-y-3">
                        <label for="comments" class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            Komentar Tambahan (Opsional)
                        </label>
                        <textarea
                            bind:value={responses.comments}
                            id="comments"
                            rows="4"
                            placeholder="Berikan saran atau komentar tambahan tentang website cucibaju.id..."
                            class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-purple-400 transition-all duration-200"
                        ></textarea>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            type="button"
                            on:click={() => router.get('/questionnaire')}
                            class="sm:w-auto px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition-all duration-200"
                        >
                            Kembali
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || getProgressPercentage() < 100}
                            class="flex-1 text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-6 py-4 text-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            {#if isLoading}
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Menyimpan...
                            {:else}
                                Selesai & Kirim
                                <svg class="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div> 