<script>
    import { router } from '@inertiajs/svelte';
    import { fly } from 'svelte/transition';
    import SurveyProgress from '../../Components/SurveyProgress.svelte';

    // Props dari backend
    export let error = '';

    let form = {
        name: '',
        age: '',
        gender: '',
        digital_proficiency: ''
    };

    let isLoading = false;

    let clientError = '';

    function submitForm() {
        // Reset client error
        clientError = '';
        
        // Validasi client-side
        if (!form.name.trim()) {
            clientError = 'Nama lengkap harus diisi';
            return;
        }
        
        if (!form.age || form.age < 1 || form.age > 120) {
            clientError = 'Usia harus diisi dengan nilai yang valid (1-120)';
            return;
        }
        
        if (!form.gender) {
            clientError = 'Jenis kelamin harus dipilih';
            return;
        }
        
        if (!form.digital_proficiency) {
            clientError = 'Kemahiran menggunakan produk digital harus dipilih';
            return;
        }

        isLoading = true;
        
        // Menggunakan router.post dari Inertia.js untuk handling redirect yang lebih baik
        router.post('/questionnaire/user-info', {
            name: form.name.trim(),
            age: parseInt(form.age),
            gender: form.gender,
            digital_proficiency: form.digital_proficiency
        }, {
            onFinish: () => {
                isLoading = false;
            }
        });
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
    <!-- Survey Progress -->
    <div class="pt-8">
        <SurveyProgress currentStep={1} totalSteps={2} />
    </div>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto px-4 pb-8" in:fly={{ y: 20, duration: 600, delay: 200 }}>
        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 p-8 text-center">
                <h1 class="text-2xl font-bold text-white mb-2">Informasi Pengguna</h1>
                <p class="text-purple-100 dark:text-purple-200">
                    Sebelum memulai kuesioner, mohon lengkapi informasi berikut untuk membantu kami menganalisa data lengkap lebih baik.
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

                <form class="space-y-6" on:submit|preventDefault={submitForm}>
                    <!-- Nama Lengkap -->
                    <div class="space-y-2">
                        <label for="name" class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            Nama Lengkap
                        </label>
                        <input
                            bind:value={form.name}
                            type="text"
                            id="name"
                            placeholder="Masukkan nama lengkap anda"
                            class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-purple-400 transition-all duration-200"
                            required
                        />
                    </div>

                    <!-- Usia -->
                    <div class="space-y-2">
                        <label for="age" class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Usia
                        </label>
                        <input
                            bind:value={form.age}
                            type="number"
                            id="age"
                            min="1"
                            max="120"
                            placeholder="Contoh: 25"
                            class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-purple-400 transition-all duration-200"
                            required
                        />
                    </div>

                    <!-- Jenis Kelamin -->
                    <div class="space-y-3">
                        <label class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            Jenis Kelamin
                        </label>
                        <div class="grid grid-cols-2 gap-4">
                            <label class="relative cursor-pointer">
                                <input
                                    bind:group={form.gender}
                                    type="radio"
                                    value="Laki-laki"
                                    class="sr-only peer"
                                    required
                                />
                                <div class="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/30 peer-checked:text-purple-700 dark:peer-checked:text-purple-300 hover:border-purple-300 transition-all duration-200 text-center font-medium">
                                    Laki-laki
                                </div>
                            </label>
                            <label class="relative cursor-pointer">
                                <input
                                    bind:group={form.gender}
                                    type="radio"
                                    value="Perempuan"
                                    class="sr-only peer"
                                    required
                                />
                                <div class="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/30 peer-checked:text-purple-700 dark:peer-checked:text-purple-300 hover:border-purple-300 transition-all duration-200 text-center font-medium">
                                    Perempuan
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Kemahiran Menggunakan Produk Digital -->
                    <div class="space-y-3">
                        <label class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            Kemahiran Menggunakan Produk Digital
                        </label>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            seberapa mahir anda dalam menggunakan aplikasi mobile, website atau platform digital lainnya?
                        </p>
                        <div class="space-y-3">
                            <label class="relative cursor-pointer">
                                <input
                                    bind:group={form.digital_proficiency}
                                    type="radio"
                                    value="Pemula"
                                    class="sr-only peer"
                                    required
                                />
                                <div class="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/30 peer-checked:text-purple-700 dark:peer-checked:text-purple-300 hover:border-purple-300 transition-all duration-200">
                                    <div class="font-medium">Pemula</div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Baru belajar menggunakan aplikasi dan website</div>
                                </div>
                            </label>
                            <label class="relative cursor-pointer">
                                <input
                                    bind:group={form.digital_proficiency}
                                    type="radio"
                                    value="Menengah"
                                    class="sr-only peer"
                                    required
                                />
                                <div class="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/30 peer-checked:text-purple-700 dark:peer-checked:text-purple-300 hover:border-purple-300 transition-all duration-200">
                                    <div class="font-medium">Menengah</div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Cukup familiar dengan berbagai aplikasi dan website</div>
                                </div>
                            </label>
                            <label class="relative cursor-pointer">
                                <input
                                    bind:group={form.digital_proficiency}
                                    type="radio"
                                    value="Mahir"
                                    class="sr-only peer"
                                    required
                                />
                                <div class="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/30 peer-checked:text-purple-700 dark:peer-checked:text-purple-300 hover:border-purple-300 transition-all duration-200">
                                    <div class="font-medium">Mahir</div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Sangat terbiasa dan mudah mempelajari produk digital baru</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Privacy Notice -->
                    <div class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div class="flex items-start">
                            <svg class="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5v3a.75.75 0 001.5 0v-3A.75.75 0 009 9z" clip-rule="evenodd"></path>
                            </svg>
                            <div>
                                <h4 class="text-sm font-medium text-blue-800 dark:text-blue-300">Privasi Terjamin</h4>
                                <p class="text-sm text-blue-700 dark:text-blue-400 mt-1">
                                    Informasi yang anda berikan hanya digunakan untuk analisis statistik dan tidak akan dibagikan kepada pihak ketiga.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <button
                        type="submit"
                        disabled={isLoading}
                        class="w-full text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-6 py-4 text-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        {#if isLoading}
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Memproses...
                        {:else}
                            Lanjut Ke Kuesioner
                            <svg class="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                        {/if}
                    </button>
                </form>
            </div>
        </div>
    </div>
</div> 