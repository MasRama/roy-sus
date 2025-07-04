<script>
  import { inertia, router } from '@inertiajs/svelte';
  import { fly, fade } from 'svelte/transition';
  import SurveyProgress from '../../Components/SurveyProgress.svelte';

  let form = {
    user_name: '',
    user_age: '',
    user_gender: '',
    digital_skill_level: ''
  };

  let errors = {};
  let isSubmitting = false;

  export let error;

  // Form validation
  $: {
    errors = {};
    
    if (form.user_name && form.user_name.length < 2) {
      errors.user_name = 'Nama lengkap minimal 2 karakter';
    }
    
    if (form.user_age && (form.user_age < 13 || form.user_age > 100)) {
      errors.user_age = 'Usia harus antara 13-100 tahun';
    }
  }

  $: isFormValid = form.user_name.length >= 2 && 
                   form.user_age >= 13 && 
                   form.user_age <= 100 && 
                   form.user_gender && 
                   form.digital_skill_level;

  function submitForm() {
    if (!isFormValid || isSubmitting) return;
    
    isSubmitting = true;
    router.post('/survey/user-info', form, {
      onFinish: () => {
        isSubmitting = false;
      }
    });
  }
</script>

<svelte:head>
  <title>Informasi Pengguna - CuciBaju Survey</title>
  <meta name="description" content="Isi informasi dasar Anda untuk memulai survey pengalaman pengguna CuciBaju.id">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico">
</svelte:head>

<section class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 relative overflow-hidden">
  <!-- Background Decorations -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
  </div>
  
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0 relative">
    <!-- Survey Progress -->
    <div class="w-full max-w-2xl mb-8" in:fly={{ y: -30, duration: 800, delay: 200 }}>
      <SurveyProgress currentStep={1} totalSteps={2} stepLabels={['Informasi Pengguna', 'Kuesioner']} />
    </div>

    <!-- Main Form Card -->
    <div class="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 md:mt-0 sm:max-w-2xl xl:p-0" in:fly={{ y: 30, duration: 800, delay: 400 }}>
      <div class="p-8 space-y-6">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Informasi Pengguna</h1>
          <p class="text-gray-600 dark:text-gray-300">Mohon isi informasi dasar Anda untuk melanjutkan survey</p>
        </div>
      
        {#if error}
          <div class="p-4 mb-4 text-sm text-red-800 rounded-xl bg-red-50/80 dark:text-red-400 dark:bg-red-900/50 border border-red-200 dark:border-red-800" role="alert">
            {error}
          </div>
        {/if}

        <form class="space-y-6" on:submit|preventDefault={submitForm}>
          <!-- Nama Lengkap -->
          <div>
            <label for="user_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nama Lengkap <span class="text-red-500">*</span>
            </label>
            <input 
              bind:value={form.user_name} 
              required 
              type="text" 
              name="user_name" 
              id="user_name" 
              class="bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white text-sm rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none block w-full py-3 px-4 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500" 
              placeholder="Masukkan nama lengkap Anda"
              class:border-red-500={errors.user_name}
            >
            {#if errors.user_name}
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.user_name}</p>
            {/if}
          </div>

          <!-- Usia -->
          <div>
            <label for="user_age" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Usia <span class="text-red-500">*</span>
            </label>
            <input 
              bind:value={form.user_age} 
              required 
              type="number" 
              name="user_age" 
              id="user_age" 
              min="13" 
              max="100"
              class="bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white text-sm rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none block w-full py-3 px-4 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500" 
              placeholder="Masukkan usia Anda"
              class:border-red-500={errors.user_age}
            >
            {#if errors.user_age}
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.user_age}</p>
            {/if}
          </div>

          <!-- Jenis Kelamin -->
          <div>
            <label class="block mb-3 text-sm font-medium text-gray-900 dark:text-white">
              Jenis Kelamin <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-2 gap-4">
              <label class="flex items-center p-4 bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-all duration-300" class:bg-blue-50={form.user_gender === 'laki-laki'} class:border-blue-500={form.user_gender === 'laki-laki'}>
                <input 
                  bind:group={form.user_gender} 
                  value="laki-laki" 
                  type="radio" 
                  name="user_gender" 
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                >
                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-white">Laki-laki</span>
              </label>
              <label class="flex items-center p-4 bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-all duration-300" class:bg-blue-50={form.user_gender === 'perempuan'} class:border-blue-500={form.user_gender === 'perempuan'}>
                <input 
                  bind:group={form.user_gender} 
                  value="perempuan" 
                  type="radio" 
                  name="user_gender" 
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                >
                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-white">Perempuan</span>
              </label>
            </div>
          </div>

          <!-- Kemahiran Digital -->
          <div>
            <label class="block mb-3 text-sm font-medium text-gray-900 dark:text-white">
              Kemampuan Menggunakan Produk Digital <span class="text-red-500">*</span>
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">Seberapa familiar Anda dalam menggunakan aplikasi dan website?</p>
            <div class="space-y-3">
              <label class="flex items-center p-4 bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-all duration-300" class:bg-blue-50={form.digital_skill_level === 'pemula'} class:border-blue-500={form.digital_skill_level === 'pemula'}>
                <input 
                  bind:group={form.digital_skill_level} 
                  value="pemula" 
                  type="radio" 
                  name="digital_skill_level" 
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                >
                <div class="ml-3">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">Pemula</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Saya baru belajar menggunakan aplikasi dan website</p>
                </div>
              </label>
              <label class="flex items-center p-4 bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-all duration-300" class:bg-blue-50={form.digital_skill_level === 'menengah'} class:border-blue-500={form.digital_skill_level === 'menengah'}>
                <input 
                  bind:group={form.digital_skill_level} 
                  value="menengah" 
                  type="radio" 
                  name="digital_skill_level" 
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                >
                <div class="ml-3">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">Menengah</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Saya cukup familiar dengan berbagai aplikasi dan website</p>
                </div>
              </label>
              <label class="flex items-center p-4 bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-all duration-300" class:bg-blue-50={form.digital_skill_level === 'mahir'} class:border-blue-500={form.digital_skill_level === 'mahir'}>
                <input 
                  bind:group={form.digital_skill_level} 
                  value="mahir" 
                  type="radio" 
                  name="digital_skill_level" 
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                >
                <div class="ml-3">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">Mahir</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Saya sangat familiar dan mudah menggunakan platform digital</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex space-x-4">
            <a href="/" use:inertia class="flex-1 text-center py-3 px-5 text-gray-700 dark:text-gray-300 bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl hover:bg-gray-300/50 dark:hover:bg-gray-600/50 transition-all duration-300 font-medium">
              Kembali
            </a>
            <button 
              type="submit" 
              disabled={!isFormValid || isSubmitting}
              class="flex-1 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-semibold rounded-xl text-sm px-5 py-3 text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {#if isSubmitting}
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              {:else}
                Lanjut ke Kuesioner
              {/if}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>