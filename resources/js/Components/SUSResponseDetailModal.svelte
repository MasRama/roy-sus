<script>
  import { fly, fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  
  // Props
  let {
    isOpen = false,
    responseData = null,
    onClose = () => {}
  } = $props();
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // SUS Questions mapping
  const susQuestions = [
    "Saya pikir saya akan sering menggunakan sistem ini",
    "Saya merasa sistem ini rumit untuk digunakan", 
    "Saya pikir sistem ini mudah digunakan",
    "Saya pikir saya memerlukan bantuan dari orang yang ahli teknologi untuk dapat menggunakan sistem ini",
    "Saya merasa berbagai fungsi dalam sistem ini terintegrasi dengan baik",
    "Saya pikir ada terlalu banyak hal yang tidak konsisten dalam sistem ini",
    "Saya pikir kebanyakan orang akan belajar menggunakan sistem ini dengan sangat cepat",
    "Saya merasa sistem ini sangat rumit untuk digunakan",
    "Saya merasa sangat percaya diri menggunakan sistem ini",
    "Saya perlu belajar banyak hal sebelum saya bisa menggunakan sistem ini"
  ];
  
  // Helper function to get SUS score color class
  function getSUSScoreColorClass(score) {
    if (score >= 80) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    } else if (score >= 60) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    } else {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  }
  
  // Helper function to get response text
  function getResponseText(value) {
    const responses = {
      1: 'Sangat Tidak Setuju',
      2: 'Tidak Setuju', 
      3: 'Netral',
      4: 'Setuju',
      5: 'Sangat Setuju'
    };
    return responses[value] || 'Tidak Valid';
  }
  
  // Helper function to get response color
  function getResponseColorClass(value) {
    if (value >= 4) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    } else if (value === 3) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    } else {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  }
  
  // Format date display
  function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Handle close modal
  function handleClose() {
    onClose();
    dispatch('close');
  }
  
  // Handle backdrop click
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }
  
  // Handle escape key
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      handleClose();
    }
  }
  
  // Use parsed answers from SUSFullTable or fallback to parsing
  const answersData = $derived(responseData?.answers || []);
  const hasParseError = $derived(responseData?.parseError || false);
  const hasValidResponses = $derived(responseData?.hasValidResponses !== false);
  
  // Logging untuk debugging modal
  $effect(() => {
    if (isOpen && responseData) {
      console.log('[SUS Modal Debug]', {
        timestamp: new Date().toISOString(),
        action: 'modal_opened',
        responseData: {
          id: responseData.id,
          name: responseData.name,
          age: responseData.age,
          gender: responseData.gender,
          digital_proficiency: responseData.digital_proficiency,
          sus_score: responseData.sus_score,
          created_at: responseData.created_at,
          hasParseError,
          hasValidResponses,
          answersCount: answersData.length
        },
        modalState: {
          isOpen,
          hasData: !!responseData
        }
      });
    }
  });
</script>

<!-- Modal Backdrop -->
{#if isOpen}
  <div 
    class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    on:click={handleBackdropClick}
    on:keydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
    transition:fade={{ duration: 200 }}
  >
    <!-- Modal Container -->
    <div 
      class="relative w-full max-w-4xl max-h-[90vh] bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
      transition:fly={{ y: 20, duration: 300 }}
      on:click|stopPropagation
    >
      <!-- Modal Header -->
      <div class="sticky top-0 z-10 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-b border-blue-500/20">
        <div class="flex items-center justify-between">
          <div>
            <h2 id="modal-title" class="text-xl font-semibold">Detail Responden SUS</h2>
            <p class="text-blue-100 text-sm mt-1">Informasi lengkap dan jawaban kuesioner</p>
          </div>
          <button 
            on:click={handleClose}
            class="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            aria-label="Tutup modal"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Modal Body -->
      <div class="overflow-y-auto max-h-[calc(90vh-120px)]">
        {#if responseData}
          <!-- Responder Information -->
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informasi Responden</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Nama</label>
                <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">{responseData.name}</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Usia</label>
                <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">{responseData.age} tahun</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Gender</label>
                <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">{responseData.gender}</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Kemahiran Digital</label>
                <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">{responseData.digital_proficiency}</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <label class="text-sm font-medium text-gray-600 dark:text-gray-400">SUS Score</label>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 {getSUSScoreColorClass(responseData.sus_score)}">
                  {responseData.sus_score || 'N/A'}
                </span>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Tanggal Pengisian</label>
                <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">{formatDate(responseData.created_at)}</p>
              </div>
            </div>
          </div>
          
          <!-- SUS Questions and Answers -->
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Jawaban Kuesioner SUS</h3>
              {#if hasParseError}
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  Error Parsing Data
                </span>
              {:else if !hasValidResponses}
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  Data Tidak Valid
                </span>
              {/if}
            </div>
            
            {#if answersData.length > 0}
              <div class="space-y-4">
                {#each answersData as answerData}
                  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div class="flex-1">
                        <div class="flex items-start gap-3">
                          <span class="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center justify-center text-sm font-semibold">
                            {answerData.questionNumber}
                          </span>
                          <div class="flex-1">
                            <p class="text-gray-900 dark:text-white font-medium leading-relaxed">{answerData.questionText}</p>
                            {#if !answerData.isValid && answerData.response !== 0}
                              <p class="text-red-500 dark:text-red-400 text-xs mt-1">⚠️ Jawaban tidak valid (harus 1-5)</p>
                            {/if}
                          </div>
                        </div>
                      </div>
                      <div class="flex-shrink-0 sm:ml-4">
                        {#if answerData.isValid && answerData.response > 0}
                          <div class="text-center">
                            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{answerData.response}</div>
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium {getResponseColorClass(answerData.response)}">
                              {getResponseText(answerData.response)}
                            </span>
                          </div>
                        {:else}
                          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            {answerData.response === 0 ? 'Tidak Dijawab' : `Invalid (${answerData.response})`}
                          </span>
                        {/if}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-gray-500 dark:text-gray-400">Tidak ada data jawaban tersedia</p>
              </div>
            {/if}
          </div>
        {:else}
          <!-- No Data State -->
          <div class="p-12 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-gray-500 dark:text-gray-400">Data responden tidak tersedia</p>
          </div>
        {/if}
      </div>
      
      <!-- Modal Footer -->
      <div class="sticky bottom-0 px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <div class="flex justify-end">
          <button 
            on:click={handleClose}
            class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Custom scrollbar for modal body */
  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  
  /* Dark mode scrollbar */
  .dark .overflow-y-auto::-webkit-scrollbar-track {
    background: #374151;
  }
  
  .dark .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #6b7280;
  }
  
  .dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
</style>