<script>
  import { onMount, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import { Chart, registerables } from 'chart.js';
  
  // Register Chart.js components
  Chart.register(...registerables);
  
  // Props
  export let chartData = null;
  export let type = 'bar'; // bar, line, doughnut, pie
  export let title = 'Chart';
  export let height = 'h-64'; // Tailwind height class
  export let delay = 0;
  export let showLegend = true;
  export let responsive = true;
  
  // Chart instance and canvas reference
  let chartInstance = null;
  let canvasElement = null;
  let isLoading = true;
  let hasError = false;
  let errorMessage = '';
  let isDarkMode = false;
  let mutationObserver = null;
  
  // Performance optimization: Cache dark mode state
  function updateDarkModeState() {
    isDarkMode = document.documentElement.classList.contains('dark');
  }
  
  // Chart configuration with memoized dark mode colors
  $: chartConfig = {
    type: type,
    data: chartData || {
      labels: [],
      datasets: []
    },
    options: {
      responsive: responsive,
      maintainAspectRatio: false,
      animation: {
        duration: 750, // Reduced animation duration for better performance
      },
      plugins: {
        legend: {
          display: showLegend,
          position: 'top',
          labels: {
            color: isDarkMode ? '#e5e7eb' : '#374151',
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
          titleColor: isDarkMode ? '#e5e7eb' : '#374151',
          bodyColor: isDarkMode ? '#e5e7eb' : '#374151',
          borderColor: isDarkMode ? '#374151' : '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context) {
              if (type === 'doughnut' || type === 'pie') {
                return context.label + ': ' + context.parsed + ' responses';
              } else {
                return context.dataset.label + ': ' + context.parsed.y;
              }
            }
          }
        }
      },
      scales: type === 'doughnut' || type === 'pie' ? {} : {
        x: {
          grid: {
            color: isDarkMode ? '#374151' : '#e5e7eb'
          },
          ticks: {
            color: isDarkMode ? '#9ca3af' : '#6b7280'
          }
        },
        y: {
          grid: {
            color: isDarkMode ? '#374151' : '#e5e7eb'
          },
          ticks: {
            color: isDarkMode ? '#9ca3af' : '#6b7280'
          },
          beginAtZero: true
        }
      }
    }
  };
  
  // Create chart instance
  function createChart() {
    if (!canvasElement || !chartData) return;
    
    try {
      isLoading = true;
      hasError = false;
      
      // Destroy existing chart if exists
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
      
      // Create new chart
      chartInstance = new Chart(canvasElement, chartConfig);
      isLoading = false;
    } catch (error) {
      console.error('Error creating chart:', error);
      hasError = true;
      errorMessage = 'Gagal membuat chart: ' + error.message;
      isLoading = false;
    }
  }
  
  // Update chart when data changes - optimized with animation control
  function updateChart() {
    if (!chartInstance || !chartData) return;
    
    try {
      chartInstance.data = chartData;
      chartInstance.update('none'); // Skip animation for better performance during updates
    } catch (error) {
      console.error('Error updating chart:', error);
      hasError = true;
      errorMessage = 'Gagal mengupdate chart: ' + error.message;
    }
  }
  
  // Handle dark mode changes - optimized to reduce DOM access
  function updateChartTheme() {
    if (!chartInstance) return;
    
    try {
      // Update legend colors
      chartInstance.options.plugins.legend.labels.color = isDarkMode ? '#e5e7eb' : '#374151';
      
      // Update tooltip colors
      chartInstance.options.plugins.tooltip.backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';
      chartInstance.options.plugins.tooltip.titleColor = isDarkMode ? '#e5e7eb' : '#374151';
      chartInstance.options.plugins.tooltip.bodyColor = isDarkMode ? '#e5e7eb' : '#374151';
      chartInstance.options.plugins.tooltip.borderColor = isDarkMode ? '#374151' : '#e5e7eb';
      
      // Update scales colors if not pie/doughnut
      if (type !== 'doughnut' && type !== 'pie') {
        chartInstance.options.scales.x.grid.color = isDarkMode ? '#374151' : '#e5e7eb';
        chartInstance.options.scales.x.ticks.color = isDarkMode ? '#9ca3af' : '#6b7280';
        chartInstance.options.scales.y.grid.color = isDarkMode ? '#374151' : '#e5e7eb';
        chartInstance.options.scales.y.ticks.color = isDarkMode ? '#9ca3af' : '#6b7280';
      }
      
      chartInstance.update('none'); // Skip animation for theme updates
    } catch (error) {
      console.error('Error updating chart theme:', error);
    }
  }
  
  // Lifecycle hooks
  onMount(() => {
    // Initialize dark mode state
    updateDarkModeState();
    
    // Create chart with slight delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      createChart();
    }, 100);
    
    // Listen for dark mode changes with optimized observer
    mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const oldDarkMode = isDarkMode;
          updateDarkModeState();
          
          // Only update if dark mode actually changed
          if (oldDarkMode !== isDarkMode) {
            updateChartTheme();
          }
        }
      });
    });
    
    mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => {
      clearTimeout(timeout);
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
    };
  });
  
  onDestroy(() => {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }
  });
  
  // Reactive statements - optimized to prevent unnecessary updates
  $: if (chartInstance && chartData && chartData.labels && chartData.labels.length > 0) {
    updateChart();
  }
  
  // Watch for chart config changes (mainly for dark mode)
  $: if (chartInstance && chartConfig) {
    updateChartTheme();
  }
</script>

<div 
  class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300" 
  in:fly={{ y: 20, duration: 800, delay }}
>
  {#if title}
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
      <svg class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
      </svg>
      {title}
    </h3>
  {/if}
  
  <div class="relative {height}">
    {#if isLoading}
      <!-- Loading State -->
      <div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mb-2"></div>
        <p class="text-sm text-gray-600 dark:text-gray-400">Memuat chart...</p>
      </div>
    {:else if hasError}
      <!-- Error State -->
      <div class="absolute inset-0 flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-dashed border-red-300 dark:border-red-600">
        <div class="w-12 h-12 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
        <p class="text-sm text-red-600 dark:text-red-400 text-center font-medium">Error</p>
        <p class="text-xs text-red-500 dark:text-red-300 text-center mt-1">{errorMessage}</p>
      </div>
    {:else if !chartData || !chartData.labels || chartData.labels.length === 0}
      <!-- Empty State -->
      <div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div class="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10a8 8 0 018-8v8h8a8 0 11-16 0z"/>
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
          </svg>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 text-center">Tidak ada data</p>
        <p class="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">Chart akan muncul saat data tersedia</p>
      </div>
    {/if}
    
    <!-- Chart Canvas -->
    <canvas 
      bind:this={canvasElement}
      class="absolute inset-0 w-full h-full {isLoading || hasError || !chartData ? 'opacity-0' : 'opacity-100'}"
      style="transition: opacity 0.3s ease;"
    ></canvas>
  </div>
</div>

<style>
  /* Ensure proper chart rendering */
  canvas {
    max-width: 100%;
    height: auto;
  }
  
  /* Custom loading animation */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  /* Smooth transitions for theme changes */
  .bg-white,
  .dark\\:bg-gray-800 {
    transition: background-color 0.3s ease;
  }
</style> 