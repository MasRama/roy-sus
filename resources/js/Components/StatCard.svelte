<script>
  import { fly } from 'svelte/transition';
  
  // Props
  export let title = '';
  export let value = '';
  export let icon = '';
  export let color = 'blue'; // blue, green, purple, yellow, red
  export let delay = 0;
  
  // Color mappings for different themes
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      text: 'text-blue-600 dark:text-blue-400'
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900',
      text: 'text-green-600 dark:text-green-400'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900',
      text: 'text-purple-600 dark:text-purple-400'
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900',
      text: 'text-yellow-600 dark:text-yellow-400'
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900',
      text: 'text-red-600 dark:text-red-400'
    }
  };
  
  $: currentColor = colorClasses[color] || colorClasses.blue;
</script>

<div 
  class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" 
  in:fly={{ y: 20, duration: 800, delay }}
>
  <div class="flex items-center justify-between">
    <div class="flex-1">
      <p class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
      <p class="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
    
    {#if icon}
      <div class="w-12 h-12 {currentColor.bg} rounded-lg flex items-center justify-center ml-4">
        <div class="w-6 h-6 {currentColor.text}">
          {@html icon}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Additional custom styles if needed */
  .card-hover {
    @apply transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
  }
</style>