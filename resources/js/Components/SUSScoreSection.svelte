<script>
  import { fly } from 'svelte/transition';
  import { interpretSUSScore, getSUSScoreColors } from '../utils/susCalculator.js';
  
  // Props
  export let avgScore = 0;
  export let delay = 0;
  
  // SUS Score interpretation using utility function
  $: interpretation = (() => {
    const baseInterpretation = interpretSUSScore(avgScore);
    const colors = getSUSScoreColors(avgScore);
    
    return {
      percentileRank: baseInterpretation.percentileRank,
      percentileText: baseInterpretation.percentileText,
      adjectiveRating: baseInterpretation.adjectiveRating,
      acceptability: baseInterpretation.acceptability,
      grade: baseInterpretation.grade,
      color: {
        percentile: colors.background,
        adjective: colors.badge,
        acceptability: colors.badge
      }
    };
  })();
</script>

<div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 hover:border-white/30 dark:hover:border-gray-600/30" in:fly={{ y: 20, duration: 800, delay }}>
  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
    <svg class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
    </svg>
    Interpretasi SUS Score
  </h3>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Percentile Rank Card -->
    <div class="text-center">
      <div class="mb-4">
        <div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 relative overflow-hidden">
          <!-- Progress background -->
          <div class="absolute inset-0 rounded-full">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <!-- Background circle -->
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                stroke="currentColor" 
                stroke-width="8" 
                fill="none" 
                class="text-gray-200 dark:text-gray-600"
              />
              <!-- Progress circle -->
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                stroke="currentColor" 
                stroke-width="8" 
                fill="none" 
                stroke-linecap="round"
                class="{interpretation.color.percentile === 'bg-green-500' ? 'text-green-500' : interpretation.color.percentile === 'bg-yellow-500' ? 'text-yellow-500' : 'text-red-500'}"
                stroke-dasharray="{2 * Math.PI * 40}"
                stroke-dashoffset="{2 * Math.PI * 40 * (1 - interpretation.percentileRank / 100)}"
                style="transition: stroke-dashoffset 1s ease-in-out;"
              />
            </svg>
          </div>
          <!-- Percentage text -->
          <span class="text-lg font-bold text-gray-900 dark:text-white relative z-10">
            {interpretation.percentileText}
          </span>
        </div>
      </div>
      <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Percentile Rank</h4>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Skor di atas {interpretation.percentileText} dari pengguna
      </p>
    </div>

    <!-- Adjective Rating Card -->
    <div class="text-center">
      <div class="mb-4">
        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 {interpretation.color.adjective}">
          <span class="text-sm font-bold">{interpretation.adjectiveRating}</span>
        </div>
      </div>
      <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Adjective Rating</h4>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Penilaian kualitatif berdasarkan skor SUS
      </p>
    </div>

    <!-- Acceptability Card -->
    <div class="text-center">
      <div class="mb-4">
        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 {interpretation.color.acceptability}">
          <div class="flex flex-col items-center">
            {#if interpretation.acceptability === 'Acceptable'}
              <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            {:else if interpretation.acceptability === 'Marginal'}
              <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
            {:else}
              <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            {/if}
            <span class="text-xs font-bold">
              {interpretation.acceptability === 'Not Acceptable' ? 'Not OK' : interpretation.acceptability}
            </span>
          </div>
        </div>
      </div>
      <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Acceptability</h4>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Tingkat penerimaan sistem oleh pengguna
      </p>
    </div>
  </div>
  
  <!-- Score Display -->
  <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
    <div class="text-center">
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Rata-rata SUS Score</p>
      <div class="inline-flex items-center px-4 py-2 rounded-full text-2xl font-bold {interpretation.color.adjective}">
        {parseFloat(avgScore).toFixed(1)}
      </div>
    </div>
  </div>
</div>

<style>
  /* Custom animation for progress circle */
  circle {
    transition: stroke-dashoffset 1.5s ease-in-out;
  }
  
  /* Ensure proper dark mode transitions */
  .bg-white {
    transition: background-color 0.3s ease;
  }
</style>