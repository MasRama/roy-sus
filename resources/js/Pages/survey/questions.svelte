<script>
  import { inertia, router } from '@inertiajs/svelte';
  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import SurveyProgress from '../../Components/SurveyProgress.svelte';

  let surveyData = null;
  let questions = [];
  let currentQuestionIndex = 0;
  let answers = {};
  let isLoading = true;
  let isSubmitting = false;
  let loadError = null;

  export let error;

  $: currentQuestion = questions[currentQuestionIndex];
  $: isLastQuestion = currentQuestionIndex === questions.length - 1;
  $: isFirstQuestion = currentQuestionIndex === 0;
  $: questionProgress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // Check if current question is answered
  $: isCurrentQuestionAnswered = currentQuestion && answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== '';

  onMount(async () => {
    try {
      const response = await fetch('/data/survey-questions.json');
      if (!response.ok) {
        throw new Error('Failed to load survey questions');
      }
      surveyData = await response.json();
      questions = surveyData.questions || [];
      
      // Initialize answers object
      questions.forEach(q => {
        answers[q.id] = q.type === 'text' ? '' : null;
      });
      
      isLoading = false;
    } catch (err) {
      console.error('Error loading survey questions:', err);
      loadError = 'Gagal memuat pertanyaan survey. Silakan coba lagi.';
      isLoading = false;
    }
  });

  function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
    }
  }

  function previousQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
    }
  }

  function submitSurvey() {
    if (isSubmitting) return;
    
    // Validate required questions
    const unansweredRequired = questions.filter(q => 
      q.required && (answers[q.id] === null || answers[q.id] === undefined || answers[q.id] === '')
    );
    
    if (unansweredRequired.length > 0) {
      alert(`Mohon jawab semua pertanyaan yang wajib diisi (${unansweredRequired.length} pertanyaan belum dijawab)`);
      return;
    }
    
    isSubmitting = true;
    router.post('/survey/questions', { answers }, {
      onFinish: () => {
        isSubmitting = false;
      }
    });
  }

  function handleRatingChange(questionId, value) {
    answers[questionId] = value;
  }

  function handleTextChange(questionId, value) {
    answers[questionId] = value;
  }
</script>

<svelte:head>
  <title>Kuesioner - CuciBaju Survey</title>
  <meta name="description" content="Jawab pertanyaan survey untuk membantu kami meningkatkan pengalaman pengguna CuciBaju.id">
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
    <div class="w-full max-w-4xl mb-8" in:fly={{ y: -30, duration: 800, delay: 200 }}>
      <SurveyProgress currentStep={2} totalSteps={2} stepLabels={['Informasi Pengguna', 'Kuesioner']} />
    </div>

    {#if isLoading}
      <!-- Loading State -->
      <div class="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 md:mt-0 sm:max-w-4xl xl:p-0" in:fade>
        <div class="p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400">Memuat pertanyaan survey...</p>
        </div>
      </div>
    {:else if loadError}
      <!-- Error State -->
      <div class="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 md:mt-0 sm:max-w-4xl xl:p-0" in:fade>
        <div class="p-8 text-center">
          <div class="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Terjadi Kesalahan</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{loadError}</p>
          <button 
            on:click={() => window.location.reload()} 
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    {:else if questions.length > 0}
      <!-- Main Survey Card -->
      <div class="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 md:mt-0 sm:max-w-4xl xl:p-0" in:fly={{ y: 30, duration: 800, delay: 400 }}>
        <div class="p-8">
          <!-- Question Progress -->
          <div class="mb-6">
            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Pertanyaan {currentQuestionIndex + 1} dari {questions.length}</span>
              <span>{Math.round(questionProgress)}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style="width: {questionProgress}%"
              ></div>
            </div>
          </div>

          {#if error}
            <div class="p-4 mb-6 text-sm text-red-800 rounded-xl bg-red-50/80 dark:text-red-400 dark:bg-red-900/50 border border-red-200 dark:border-red-800" role="alert">
              {error}
            </div>
          {/if}

          <!-- Current Question -->
          {#key currentQuestionIndex}
            <div class="mb-8" in:fly={{ x: 50, duration: 300, delay: 100 }} out:fly={{ x: -50, duration: 200 }}>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {currentQuestion.question}
                {#if currentQuestion.required}
                  <span class="text-red-500">*</span>
                {/if}
              </h2>
              
              {#if currentQuestion.subtitle}
                <p class="text-gray-600 dark:text-gray-400 mb-6 text-lg">{currentQuestion.subtitle}</p>
              {/if}

              <!-- Question Type: Rating -->
              {#if currentQuestion.type === 'rating'}
                <div class="space-y-3">
                  {#each currentQuestion.options as option, index}
                    <label class="flex items-center p-4 bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-all duration-300" 
                           class:bg-blue-50={answers[currentQuestion.id] === index + 1} 
                           class:border-blue-500={answers[currentQuestion.id] === index + 1}>
                      <input 
                        type="radio" 
                        name="question_{currentQuestion.id}" 
                        value={index + 1}
                        on:change={() => handleRatingChange(currentQuestion.id, index + 1)}
                        checked={answers[currentQuestion.id] === index + 1}
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      >
                      <span class="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                        {index + 1}. {option}
                      </span>
                    </label>
                  {/each}
                </div>
              
              <!-- Question Type: Text -->
              {:else if currentQuestion.type === 'text'}
                <div>
                  <textarea 
                    bind:value={answers[currentQuestion.id]}
                    placeholder={currentQuestion.placeholder || 'Masukkan jawaban Anda...'}
                    rows="4"
                    maxlength={currentQuestion.max_length || 500}
                    class="w-full bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white text-sm rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none py-3 px-4 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                  ></textarea>
                  {#if currentQuestion.max_length}
                    <div class="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {(answers[currentQuestion.id] || '').length}/{currentQuestion.max_length} karakter
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
          {/key}

          <!-- Navigation Buttons -->
          <div class="flex justify-between items-center pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <button 
              on:click={previousQuestion}
              disabled={isFirstQuestion}
              class="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl hover:bg-gray-300/50 dark:hover:bg-gray-600/50 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Sebelumnya
            </button>

            <div class="text-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {#if currentQuestion.required && !isCurrentQuestionAnswered}
                  <span class="text-red-500">* Wajib dijawab</span>
                {:else if isCurrentQuestionAnswered}
                  <span class="text-green-500">✓ Terjawab</span>
                {/if}
              </span>
            </div>

            {#if isLastQuestion}
              <button 
                on:click={submitSurvey}
                disabled={isSubmitting}
                class="flex items-center px-6 py-3 text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {#if isSubmitting}
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim...
                {:else}
                  Kirim Survey
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                {/if}
              </button>
            {:else}
              <button 
                on:click={nextQuestion}
                disabled={currentQuestion.required && !isCurrentQuestionAnswered}
                class="flex items-center px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                Selanjutnya
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
</section>