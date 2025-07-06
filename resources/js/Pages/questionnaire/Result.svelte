<script>
    import { router } from '@inertiajs/svelte';
    import { fly } from 'svelte/transition';

    export let userInfo;
    export let susScore;
    export let category;
    export let categoryColor;
    export let surveyId;
    export let submittedAt;

    // Tentukan warna berdasarkan kategori
    function getCategoryColorClass(color) {
        switch(color) {
            case 'green':
                return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/30 dark:border-green-800';
            case 'blue':
                return 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/30 dark:border-blue-800';
            case 'yellow':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-800';
            case 'red':
                return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/30 dark:border-red-800';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-900/30 dark:border-gray-800';
        }
    }

    function getScoreDescription(score) {
        if (score >= 85) {
            return "Pengalaman pengguna sangat baik";
        } else if (score >= 70) {
            return "Pengalaman pengguna baik";
        } else if (score >= 50) {
            return "Pengalaman pengguna cukup baik";
        } else {
            return "Pengalaman pengguna perlu diperbaiki";
        }
    }

    function goToHome() {
        router.get('/');
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 py-8" in:fly={{ y: 20, duration: 600, delay: 200 }}>
        
        <!-- Header -->
        <div class="text-center mb-8" in:fly={{ y: -20, duration: 600, delay: 400 }}>
            <div class="w-20 h-20 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Terima Kasih !</h1>
            <p class="text-gray-600 dark:text-gray-300">Kuesioner Anda Telah Berhasil Diselesaikan</p>
        </div>

        <!-- User Info Card -->
        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 mb-6 p-6" in:fly={{ y: 20, duration: 600, delay: 600 }}>
            <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mr-4">
                    <span class="text-xl font-bold text-purple-600 dark:text-purple-400">{userInfo.name[0].toUpperCase()}</span>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{userInfo.name} ({userInfo.age} tahun)</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Diselesaikan pada {submittedAt}</p>
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                    <span class="text-gray-500 dark:text-gray-400">Gender:</span>
                    <p class="font-medium text-gray-900 dark:text-white">{userInfo.gender}</p>
                </div>
                <div>
                    <span class="text-gray-500 dark:text-gray-400">Usia:</span>
                    <p class="font-medium text-gray-900 dark:text-white">{userInfo.age} tahun</p>
                </div>
                <div>
                    <span class="text-gray-500 dark:text-gray-400">Kemahiran Digital:</span>
                    <p class="font-medium text-gray-900 dark:text-white">{userInfo.digital_proficiency}</p>
                </div>
            </div>
        </div>

        <!-- SUS Score Card -->
        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 mb-6 p-8" in:fly={{ y: 20, duration: 600, delay: 800 }}>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Hasil SUS Score Anda</h3>
            
            <div class="text-center mb-6">
                <div class="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white mb-4">
                    <span class="text-4xl font-bold">{susScore}</span>
                </div>
                <div class="inline-block px-4 py-2 rounded-full border-2 {getCategoryColorClass(categoryColor)} font-semibold">
                    {category}
                </div>
                <p class="text-gray-600 dark:text-gray-300 mt-2">{getScoreDescription(susScore)}</p>
            </div>

            <!-- Detailed Score Explanation -->
            <div class="space-y-6">
                <!-- SUS Score Understanding -->
                <div class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
                    <h4 class="text-lg font-medium text-indigo-900 dark:text-indigo-300 mb-4">
                        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Memahami Skor SUS Anda
                    </h4>
                    <div class="space-y-3 text-sm text-indigo-800 dark:text-indigo-400">
                        <div class="bg-indigo-100 dark:bg-indigo-800/50 rounded-lg p-4">
                            <h5 class="font-semibold mb-2 text-indigo-900 dark:text-indigo-300">📊 Fakta Penting tentang SUS Score:</h5>
                            <ul class="space-y-1 text-xs">
                                <li>• <strong>Rata-rata industri: 68</strong> - Skor di atas ini sudah baik</li>
                                <li>• <strong>Skor 50 adalah normal</strong> jika Anda menjawab "setuju" untuk semua pernyataan</li>
                                <li>• <strong>SUS menggunakan skala terbalik</strong> untuk beberapa pertanyaan</li>
                                <li>• <strong>Skor 80+ sangat baik</strong> dan menunjukkan usability yang excellent</li>
                            </ul>
                        </div>
                        {#if susScore >= 68}
                            <div class="bg-green-100 dark:bg-green-800/50 rounded-lg p-3 text-green-800 dark:text-green-300">
                                <strong>🎉 Selamat!</strong> Skor Anda ({susScore}) berada di atas rata-rata industri (68). Ini menunjukkan bahwa Anda memiliki pengalaman yang baik dengan website cucibaju.id.
                            </div>
                        {:else if susScore >= 50}
                            <div class="bg-blue-100 dark:bg-blue-800/50 rounded-lg p-3 text-blue-800 dark:text-blue-300">
                                <strong>👍 Bagus!</strong> Skor Anda ({susScore}) menunjukkan pengalaman yang cukup baik. Masih ada ruang untuk perbaikan, dan feedback Anda sangat berharga.
                            </div>
                        {:else}
                            <div class="bg-orange-100 dark:bg-orange-800/50 rounded-lg p-3 text-orange-800 dark:text-orange-300">
                                <strong>💡 Terima kasih!</strong> Feedback Anda ({susScore}) sangat penting untuk membantu kami mengidentifikasi area yang perlu diperbaiki.
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Score Range Explanation -->
                <div class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <h4 class="text-lg font-medium text-blue-900 dark:text-blue-300 mb-3">
                        Interpretasi Rentang Skor SUS
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div class="text-center p-3 bg-red-100 dark:bg-red-900/30 rounded">
                            <div class="font-semibold text-red-700 dark:text-red-400">0-50</div>
                            <div class="text-red-600 dark:text-red-400 text-xs">Poor</div>
                            <div class="text-red-500 dark:text-red-400 text-xs mt-1">Perlu perbaikan signifikan</div>
                        </div>
                        <div class="text-center p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                            <div class="font-semibold text-yellow-700 dark:text-yellow-400">50-68</div>
                            <div class="text-yellow-600 dark:text-yellow-400 text-xs">OK</div>
                            <div class="text-yellow-500 dark:text-yellow-400 text-xs mt-1">Di bawah rata-rata industri</div>
                        </div>
                        <div class="text-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded">
                            <div class="font-semibold text-blue-700 dark:text-blue-400">68-80</div>
                            <div class="text-blue-600 dark:text-blue-400 text-xs">Good</div>
                            <div class="text-blue-500 dark:text-blue-400 text-xs mt-1">Di atas rata-rata industri</div>
                        </div>
                        <div class="text-center p-3 bg-green-100 dark:bg-green-900/30 rounded">
                            <div class="font-semibold text-green-700 dark:text-green-400">80-100</div>
                            <div class="text-green-600 dark:text-green-400 text-xs">Excellent</div>
                            <div class="text-green-500 dark:text-green-400 text-xs mt-1">Usability sangat baik</div>
                        </div>
                    </div>
                    <div class="mt-4 text-xs text-blue-700 dark:text-blue-400">
                        <strong>Catatan:</strong> Standar interpretasi berdasarkan penelitian Bangor, Kortum, dan Miller (2008) yang telah digunakan secara internasional.
                    </div>
                </div>

                <!-- Additional Resources -->
                <div class="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                    <h4 class="text-lg font-medium text-gray-900 dark:text-gray-300 mb-3">
                        📚 Ingin Tahu Lebih Lanjut?
                    </h4>
                    <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                        <p>SUS (System Usability Scale) adalah metode standar yang dikembangkan oleh John Brooke pada tahun 1986 dan telah digunakan oleh ribuan perusahaan teknologi di seluruh dunia.</p>
                        <div class="flex flex-wrap gap-2 mt-3">
                            <span class="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full text-xs">📊 Standar Internasional</span>
                            <span class="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full text-xs">🔬 Penelitian Berbasis Ilmiah</span>
                            <span class="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full text-xs">🌍 Digunakan Global</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contribution Card -->
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 rounded-2xl shadow-lg p-8 text-center text-white" in:fly={{ y: 20, duration: 600, delay: 1000 }}>
            <h3 class="text-xl font-semibold mb-4">Kontribusi Anda Sangat Berharga</h3>
            <p class="text-purple-100 dark:text-purple-200 mb-6">
                Feedback Anda Membantu Kami Terus Meningkatkan Kualitas Layanan Cucibaju.id. Kami 
                Berkomitmen Untuk Memberikan Pengalaman Terbaik Bagi Semua Pengguna.
            </p>
            <button
                on:click={goToHome}
                class="bg-white text-purple-600 hover:bg-purple-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
                Kembali Ke Beranda
            </button>
        </div>

        <!-- Additional Info -->
        <div class="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>Survey ID: {surveyId}</p>
            <p class="mt-1">Jika Anda memiliki pertanyaan, silakan hubungi tim support kami.</p>
        </div>
    </div>
</div> 