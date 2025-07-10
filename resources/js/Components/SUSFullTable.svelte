<script>
  import { fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { debounce } from './helper.js';
  
  // Props from SUSDashboard
  export let all_responses = [];
  export let pagination = {
    total: 0,
    currentPage: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    perPage: 10
  };
  export let filters = {
    search: "",
    gender: "",
    proficiency: ""
  };
  export let onSearch = () => {};
  export let onFilter = () => {};
  export let onPageChange = () => {};
  export let isLoading = false;
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Function to handle delete action
  function handleDelete(responseId, responseName) {
    // Langsung dispatch tanpa konfirmasi karena konfirmasi sudah ada di parent component
    dispatch('deleteResponse', { id: responseId });
  }
  
  // Local state for search input
  let localSearchTerm = filters.search;
  let localGenderFilter = filters.gender;
  let localProficiencyFilter = filters.proficiency;
  
  // Pagination calculations
  $: totalPages = pagination.totalPages;
  $: currentPage = pagination.currentPage;
  $: totalItems = pagination.total;
  $: itemsPerPage = pagination.perPage;
  $: startIndex = (currentPage - 1) * itemsPerPage;
  $: endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  // Debounced search function
  const debouncedSearch = debounce((search) => {
    onSearch({ detail: { search } });
  }, 300);
  
  // Watch for search input changes
  $: if (localSearchTerm !== filters.search) {
    debouncedSearch(localSearchTerm);
  }
  
  // Watch for filter changes
  $: if (localGenderFilter !== filters.gender) {
    onFilter({ detail: { gender: localGenderFilter } });
  }
  
  $: if (localProficiencyFilter !== filters.proficiency) {
    onFilter({ detail: { proficiency: localProficiencyFilter } });
  }
  
  // Helper function to get color classes for SUS score
  function getSUSScoreColorClass(score) {
    if (score >= 80) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    } else if (score >= 60) {
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
      month: '2-digit', 
      year: 'numeric'
    });
  }
  
  // Event handlers for pagination with loading states
  function handlePrevious() {
    if (pagination.hasPreviousPage && !isLoading) {
      onPageChange({ detail: { page: currentPage - 1 } });
    }
  }
  
  function handleNext() {
    if (pagination.hasNextPage && !isLoading) {
      onPageChange({ detail: { page: currentPage + 1 } });
    }
  }
  
  function handlePageClick(page) {
    if (page !== currentPage && !isLoading) {
      onPageChange({ detail: { page } });
    }
  }
  
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

<div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg overflow-hidden" in:fly={{ y: 30, duration: 800, delay: 200 }}>
  <!-- Table Header with Search and Filters -->
  <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Semua Data Kuesioner</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Menampilkan {startIndex + 1}-{endIndex} dari {totalItems} responden
        </p>
      </div>
    </div>
    
    <!-- Search and Filter Controls -->
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Search Input -->
      <div class="flex-1">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input 
            bind:value={localSearchTerm}
            type="text" 
            placeholder="Cari nama responden..." 
            aria-label="Cari nama responden"
            disabled={isLoading}
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {#if isLoading}
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Gender Filter -->
      <div class="w-full sm:w-48">
        <select 
          bind:value={localGenderFilter}
          aria-label="Filter berdasarkan gender"
          disabled={isLoading}
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Semua Gender</option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>
      </div>
      
      <!-- Digital Proficiency Filter -->
      <div class="w-full sm:w-48">
        <select 
          bind:value={localProficiencyFilter}
          aria-label="Filter berdasarkan tingkat keahlian digital"
          disabled={isLoading}
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Semua Proficiency</option>
          <option value="Pemula">Pemula</option>
          <option value="Menengah">Menengah</option>
          <option value="Mahir">Mahir</option>
        </select>
      </div>
    </div>
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
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tanggal</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {#each all_responses as response, index}
          <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
              {startIndex + index + 1}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{response.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {response.age}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {response.gender}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {response.digital_proficiency}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium {getSUSScoreColorClass(response.sus_score)}">
                {response.sus_score || 'N/A'}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {formatDate(response.created_at)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                on:click={() => handleDelete(response.id, response.name)}
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                title="Hapus responden"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </td>
          </tr>
        {/each}
        
        {#if all_responses.length === 0}
          <tr>
            <td colspan="8" class="px-6 py-12 text-center">
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
            disabled={currentPage === 1 || isLoading}
            aria-label="Halaman sebelumnya"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Previous
          </button>
          
          <div class="flex space-x-1">
            {#each pageNumbers as page}
              <button 
                on:click={() => handlePageClick(page)}
                disabled={isLoading}
                aria-label="Halaman {page}"
                aria-current={page === currentPage ? 'page' : undefined}
                class="px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
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
            disabled={currentPage === totalPages || isLoading}
            aria-label="Halaman selanjutnya"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
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
  
  /* Enhanced focus styles */
  input:focus, select:focus {
    outline: none;
  }
  
  /* Smooth transitions */
  .transition-colors {
    transition-property: color, background-color, border-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>