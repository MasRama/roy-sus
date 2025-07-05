<script>
  import { fly } from 'svelte/transition';
  
  // Props
  export let title = 'Chart Placeholder';
  export let height = 'h-64'; // Tailwind height class
  export let delay = 0;
  export let showIcon = true;
</script>

<div 
  class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300" 
  in:fly={{ y: 20, duration: 800, delay }}
>
  {#if title}
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
  {/if}
  
  <div class="{height} bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
    {#if showIcon}
      <div class="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-3">
        <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
        </svg>
      </div>
    {/if}
    
    <p class="text-gray-500 dark:text-gray-400 text-center text-sm">
      Chart akan ditampilkan di sini
    </p>
    <p class="text-gray-400 dark:text-gray-500 text-center text-xs mt-1">
      Data visualization placeholder
    </p>
  </div>
</div>

<style>
  /* Custom styles for chart placeholder */
  .chart-placeholder {
    background-image: 
      linear-gradient(45deg, transparent 25%, rgba(0,0,0,0.05) 25%), 
      linear-gradient(-45deg, transparent 25%, rgba(0,0,0,0.05) 25%), 
      linear-gradient(45deg, rgba(0,0,0,0.05) 75%, transparent 75%), 
      linear-gradient(-45deg, rgba(0,0,0,0.05) 75%, transparent 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  }
</style>