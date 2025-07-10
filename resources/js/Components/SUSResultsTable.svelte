<script>
  import { fly } from 'svelte/transition';
  import { calculateSUSScore, getSUSScoreColors } from '../utils/susCalculator.js';
  
  // Props
  export let responses = [];
  export let currentPage = 1;
  export let itemsPerPage = 10;
  export let totalItems = 0;
  
  // Pagination calculations
  $: totalPages = Math.ceil(totalItems / itemsPerPage);
  $: startIndex = (currentPage - 1) * itemsPerPage;
  $: endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  // Helper function to get color classes for SUS score
  function getSUSScoreColorClass(score) {
    const colors = getSUSScoreColors(score);
    return colors.badge;
  }
  
  // Format gender display
  function formatGender(gender) {
    const genderMap = {
      'male': 'Laki-laki',
      'female': 'Perempuan',
      'other': 'Lainnya'
    };
    return genderMap[gender] || gender;
  }
  
  // Format proficiency display
  function formatProficiency(proficiency) {
    const proficiencyMap = {
      'beginner': 'Pemula',
      'intermediate': 'Menengah',
      'advanced': 'Mahir',
      'expert': 'Ahli'
    };
    return proficiencyMap[proficiency] || proficiency;
  }
  
  // Event handler for delete
  function handleDelete(responseId) {
    if (confirm('Apakah Anda yakin ingin menghapus data responden ini?')) {
      dispatch('deleteResponse', { id: responseId });
    }
  }

  // Event handlers for pagination
  function handlePrevious() {
    if (currentPage > 1) {
      currentPage--;
      // Emit event to parent component
      dispatch('pageChange', { page: currentPage });
    }
  }
  
  function handleNext() {
    if (currentPage < totalPages) {
      currentPage++;
      // Emit event to parent component
      dispatch('pageChange', { page: currentPage });
    }
  }
  
  function handlePageClick(page) {
    currentPage = page;
    // Emit event to parent component
    dispatch('pageChange', { page: currentPage });
  }
  
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  // Generate page numbers for pagination
  $: pageNumbers = (() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  })();
</script>

<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden" in:fly={{ y: 20, duration: 800, delay: 200 }}>
  <!-- Table Header -->
  <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Hasil Kuesioner SUS</h3>
    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
      Menampilkan {startIndex + 1}-{endIndex} dari {totalItems} responden
    </p>
  </div>
  
  <!-- Table Container with horizontal scroll -->
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">No</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usia</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gender</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Digital Proficiency</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SUS Score</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {#each responses as response, index}
          <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {startIndex + index + 1}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{response.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {response.age}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {formatGender(response.gender)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {formatProficiency(response.digital_proficiency)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {#if calculateSUSScore(response.responses) !== undefined}
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getSUSScoreColorClass(calculateSUSScore(response.responses))}">
                  {calculateSUSScore(response.responses).toFixed(1)}
                </span>
              {:else}
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                  N/A
                </span>
              {/if}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              <button 
                on:click={() => handleDelete(response.id)}
                class="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                title="Hapus responden"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Hapus
              </button>
            </td>
          </tr>
        {/each}
        
        {#if responses.length === 0}
          <tr>
            <td colspan="7" class="px-6 py-12 text-center">
              <div class="text-gray-500 dark:text-gray-400">
                <svg class="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-sm">Belum ada data kuesioner</p>
              </div>
            </td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
  
  <!-- Pagination -->
  {#if totalPages > 1}
    <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <button 
            on:click={handlePrevious}
            disabled={currentPage === 1}
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Previous
          </button>
          
          <div class="flex space-x-1">
            {#each pageNumbers as page}
              <button 
                on:click={() => handlePageClick(page)}
                class="px-3 py-2 text-sm font-medium rounded-md transition-colors
                  {page === currentPage 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                  }"
              >
                {page}
              </button>
            {/each}
          </div>
          
          <button 
            on:click={handleNext}
            disabled={currentPage === totalPages}
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Next
          </button>
        </div>
        
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Custom scrollbar for table */
  .overflow-x-auto::-webkit-scrollbar {
    height: 6px;
  }
  
  .overflow-x-auto::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  
  .overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  
  /* Dark mode scrollbar */
  .dark .overflow-x-auto::-webkit-scrollbar-track {
    background: #374151;
  }
  
  .dark .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #6b7280;
  }
  
  .dark .overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
</style>