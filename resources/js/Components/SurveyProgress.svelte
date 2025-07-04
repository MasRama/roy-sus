<script>
  import { fly } from 'svelte/transition';

  export let currentStep = 1;
  export let totalSteps = 2;
  export let stepLabels = ['Informasi Pengguna', 'Kuesioner'];

  $: progressPercentage = (currentStep / totalSteps) * 100;
</script>

<div class="w-full max-w-4xl mx-auto mb-8" in:fly={{ y: -20, duration: 600, delay: 100 }}>
  <!-- Progress Header -->
  <div class="text-center mb-6">
    <h2 class="text-2xl font-bold gradient-text mb-2">CuciBaju Xperience Survey</h2>
    <p class="text-gray-600 dark:text-gray-400">Langkah {currentStep} dari {totalSteps}</p>
  </div>

  <!-- Progress Bar Container -->
  <div class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50">
    <!-- Step Labels -->
    <div class="flex justify-between mb-4">
      {#each stepLabels as label, index}
        <div class="flex flex-col items-center flex-1">
          <!-- Step Circle -->
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 {
              index + 1 <= currentStep 
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }"
          >
            {#if index + 1 < currentStep}
              <!-- Completed Step - Checkmark -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            {:else}
              <!-- Current or Future Step - Number -->
              <span class="text-sm font-semibold">{index + 1}</span>
            {/if}
          </div>
          
          <!-- Step Label -->
          <span class="text-sm font-medium text-center {
            index + 1 <= currentStep 
              ? 'text-primary-600 dark:text-primary-400' 
              : 'text-gray-500 dark:text-gray-400'
          }">
            {label}
          </span>
        </div>
        
        <!-- Connector Line (except for last step) -->
        {#if index < stepLabels.length - 1}
          <div class="flex-1 flex items-center px-4">
            <div class="h-0.5 w-full transition-all duration-300 {
              index + 1 < currentStep 
                ? 'bg-gradient-to-r from-primary-500 to-primary-600' 
                : 'bg-gray-200 dark:bg-gray-700'
            }"></div>
          </div>
        {/if}
      {/each}
    </div>

    <!-- Progress Bar -->
    <div class="mt-6">
      <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span>Progress</span>
        <span>{Math.round(progressPercentage)}%</span>
      </div>
      
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out"
          style="width: {progressPercentage}%"
        ></div>
      </div>
    </div>
  </div>
</div>

<style>
  .gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  :global(.dark) .gradient-text {
    background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
</style>