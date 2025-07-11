<script>
  import { page } from '@inertiajs/svelte';
  import { router } from '@inertiajs/svelte';
  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import axios from 'axios';
  import Header from '../../Components/Header.svelte';
  import SUSChart from '../../Components/SUSChart.svelte';
  import SUSScoreSection from '../../Components/SUSScoreSection.svelte';
  import SUSResultsTable from '../../Components/SUSResultsTable.svelte';
  import SUSFullTable from '../../Components/SUSFullTable.svelte';
  import { Toast } from '../../Components/helper.js';
  
  // Get data from Inertia props
  let statistics = $page.props.statistics || {
    totalResponden: 0,
    averageScore: '0.0',
    totalKuesioner: 0,
    grade: 'F',
    interpretation: {
      score: 0,
      percentileRank: 0,
      percentileText: '0%',
      adjectiveRating: 'Poor',
      acceptability: 'Not Acceptable',
      grade: 'F'
    }
  };
  
  let chartData = $page.props.chartData || {
    scoreDistribution: {
      labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
      data: [0, 0, 0, 0, 0]
    },
    trendData: {
      labels: [],
      data: []
    }
  };
  
  let user = $page.props.user || {};
  
  // Pagination data from AuthController
  let all_responses = $page.props.all_responses || [];
  let pagination = $page.props.pagination || {
    total: 0,
    currentPage: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    perPage: 10
  };
  let filters = $page.props.filters || {
    search: "",
    gender: "",
    proficiency: ""
  };
  
  // Local state for reactive updates
  let searchTerm = filters.search;
  let genderFilter = filters.gender;
  let proficiencyFilter = filters.proficiency;
  let currentPage = pagination.currentPage;
  let isLoading = false;
  
  // Flag to prevent infinite loops during prop updates
  let updatingFromProps = false;
  
  // Parse average score for components
  let averageScore = parseFloat(statistics.averageScore) || 0;
  
  // Reactive statements for data synchronization with $page.props
  $: {
    if (!updatingFromProps) {
      updatingFromProps = true;
      
      // Sync statistics data
      if (JSON.stringify(statistics) !== JSON.stringify($page.props.statistics)) {
        statistics = $page.props.statistics || {
          totalResponden: 0,
          averageScore: '0.0',
          totalKuesioner: 0,
          grade: 'F',
          interpretation: {
            score: 0,
            percentileRank: 0,
            percentileText: '0%',
            adjectiveRating: 'Poor',
            acceptability: 'Not Acceptable',
            grade: 'F'
          }
        };
        averageScore = parseFloat(statistics.averageScore) || 0;
      }
      
      // Sync all_responses data
      if (JSON.stringify(all_responses) !== JSON.stringify($page.props.all_responses)) {
        all_responses = $page.props.all_responses || [];
      }
      
      // Sync pagination data
      if (JSON.stringify(pagination) !== JSON.stringify($page.props.pagination)) {
        pagination = $page.props.pagination || {
          total: 0,
          currentPage: 1,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          perPage: 10
        };
      }
      
      // Sync chartData
      if (JSON.stringify(chartData) !== JSON.stringify($page.props.chartData)) {
        chartData = $page.props.chartData || {
          scoreDistribution: {
            labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
            data: [0, 0, 0, 0, 0]
          },
          trendData: {
            labels: [],
            data: []
          }
        };
      }
      
      // Sync filters data
      if (JSON.stringify(filters) !== JSON.stringify($page.props.filters)) {
        const newFilters = $page.props.filters || {
          search: "",
          gender: "",
          proficiency: ""
        };
        filters = newFilters;
        
        // Update local state only if different to prevent unnecessary updates
        if (searchTerm !== newFilters.search) {
          searchTerm = newFilters.search;
        }
        if (genderFilter !== newFilters.gender) {
          genderFilter = newFilters.gender;
        }
        if (proficiencyFilter !== newFilters.proficiency) {
          proficiencyFilter = newFilters.proficiency;
        }
      }
      
      updatingFromProps = false;
    }
  }
  
  // Performance optimization: Memoize expensive calculations
  let scoreDistributionData = null;
  let trendData = null;
  
  // Initialize component
  onMount(() => {
    // Component initialization if needed
  });
  
  // Function to update data with new parameters
  function updateData() {
    if (isLoading) return;
    
    isLoading = true;
    
    const params = {
      page: currentPage,
      limit: pagination.perPage,
      search: searchTerm.trim(),
      gender: genderFilter,
      proficiency: proficiencyFilter
    };
    
    // Remove empty parameters
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === 'all') {
        delete params[key];
      }
    });
    
    router.get('/home', params, {
      preserveState: true,
      preserveScroll: true,
      only: ['all_responses', 'pagination', 'statistics', 'chartData'],
      onSuccess: () => {
        isLoading = false;
        console.log('Data berhasil diperbarui');
      },
      onError: (errors) => {
            isLoading = false;
            console.error('Error saat memperbarui data:', errors);
            addToast('Gagal memperbarui data', 'error');
        }
    });
  }
  
  // Event handlers
  function handleSearch(event) {
    searchTerm = event.detail.search;
    currentPage = 1; // Reset to first page
    updateData();
  }
  
  function handleFilter(event) {
    if (event.detail.gender !== undefined) {
      genderFilter = event.detail.gender;
    }
    if (event.detail.proficiency !== undefined) {
      proficiencyFilter = event.detail.proficiency;
    }
    currentPage = 1; // Reset to first page
    updateData();
  }
  
  function handlePageChange(event) {
    currentPage = event.detail.page;
    updateData();
  }
  
  // Handle delete response with axios and validation
  async function handleDeleteResponse(event) {
    const responseId = event.detail.id;
    
    // Validasi input
    if (!responseId) {
      Toast('ID respons tidak valid', 'error');
      return;
    }
    
    if (isLoading) {
      Toast('Sedang memproses permintaan lain, harap tunggu', 'warning');
      return;
    }
    
    // Konfirmasi penghapusan
    if (!confirm('Apakah Anda yakin ingin menghapus data responden ini?')) {
      return;
    }
    
    isLoading = true;
    
    try {
      // Validasi format UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(responseId)) {
        throw new Error('Format ID tidak valid');
      }
      
      // Hapus item dari tampilan secara optimistic (langsung hilang)
      const originalResponses = [...all_responses];
      all_responses = all_responses.filter(response => response.id !== responseId);
      
      // Kirim request DELETE dengan axios
      const response = await axios.delete(`/questionnaire/response/${responseId}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 10000 // 10 detik timeout
      });
      
      // Validasi response
       if (response.status === 200) {
         const result = response.data;
         if (result.success) {
           Toast(result.message || 'Data responden berhasil dihapus', 'success');
           
           // Refresh data untuk sinkronisasi dengan server
           updateData();
         } else {
           // Kembalikan data jika penghapusan gagal
           all_responses = originalResponses;
           throw new Error(result.message || 'Penghapusan gagal');
         }
       } else {
         // Kembalikan data jika status tidak sesuai
         all_responses = originalResponses;
         throw new Error(`Unexpected response status: ${response.status}`);
       }
      
    } catch (error) {
      console.error('Error deleting response:', error);
      
      // Kembalikan data jika terjadi error
      if (typeof originalResponses !== 'undefined') {
        all_responses = originalResponses;
      }
      
      // Handle berbagai jenis error
      if (error.response) {
        // Server merespons dengan status error
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || 'Terjadi kesalahan';
        
        switch (status) {
          case 400:
            Toast(`Data tidak valid: ${message}`, 'error');
            break;
          case 401:
            Toast('Anda tidak memiliki akses untuk melakukan aksi ini', 'error');
            break;
          case 404:
            Toast('Data responden tidak ditemukan', 'error');
            break;
          case 422:
            Toast(`Validasi gagal: ${message}`, 'error');
            break;
          case 500:
            Toast('Terjadi kesalahan server, silakan coba lagi', 'error');
            break;
          default:
            Toast(`Gagal menghapus data: ${message}`, 'error');
        }
      } else if (error.request) {
        // Request dibuat tapi tidak ada response
        Toast('Tidak dapat terhubung ke server, periksa koneksi internet Anda', 'error');
      } else if (error.code === 'ECONNABORTED') {
        // Timeout
        Toast('Request timeout, silakan coba lagi', 'error');
      } else {
        // Error lainnya
        Toast(error.message || 'Terjadi kesalahan yang tidak diketahui', 'error');
      }
    } finally {
      isLoading = false;
    }
  }
  
  // Prepare chart data for Chart.js format with error handling
  $: {
    try {
      scoreDistributionData = {
        labels: chartData.scoreDistribution?.labels || ['0-20', '21-40', '41-60', '61-80', '81-100'],
        datasets: [{
          label: 'Jumlah Responden',
          data: chartData.scoreDistribution?.data || [0, 0, 0, 0, 0],
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',   // Red for 0-20
            'rgba(245, 158, 11, 0.8)',  // Orange for 21-40
            'rgba(234, 179, 8, 0.8)',   // Yellow for 41-60
            'rgba(34, 197, 94, 0.8)',   // Green for 61-80
            'rgba(16, 185, 129, 0.8)'   // Emerald for 81-100
          ],
          borderColor: [
            'rgb(239, 68, 68)',
            'rgb(245, 158, 11)',
            'rgb(234, 179, 8)',
            'rgb(34, 197, 94)',
            'rgb(16, 185, 129)'
          ],
          borderWidth: 2
        }]
      };
    } catch (error) {
      console.error('Error preparing score distribution data:', error);
      scoreDistributionData = {
        labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
        datasets: [{
          label: 'Jumlah Responden',
          data: [0, 0, 0, 0, 0],
          backgroundColor: ['rgba(156, 163, 175, 0.8)'],
          borderColor: ['rgb(156, 163, 175)'],
          borderWidth: 2
        }]
      };
    }
  }
  
  $: {
    try {
      trendData = {
        labels: chartData.trendData?.labels || [],
        datasets: [{
          label: 'Rata-rata SUS Score',
          data: chartData.trendData?.data || [],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6
        }]
      };
    } catch (error) {
      console.error('Error preparing trend data:', error);
      trendData = {
        labels: [],
        datasets: [{
          label: 'Rata-rata SUS Score',
          data: [],
          borderColor: 'rgb(156, 163, 175)',
          backgroundColor: 'rgba(156, 163, 175, 0.1)',
          borderWidth: 2
        }]
      };
    }
  }
  
  // Get color class based on score with safety checks
  function getScoreColor(score) {
    const numScore = parseFloat(score) || 0;
    if (numScore >= 85) return 'text-green-600';
    if (numScore >= 68) return 'text-blue-600';
    if (numScore >= 50) return 'text-yellow-600';
    return 'text-red-600';
  }
  
  function getScoreBgColor(score) {
    const numScore = parseFloat(score) || 0;
    if (numScore >= 85) return 'bg-green-100';
    if (numScore >= 68) return 'bg-blue-100';
    if (numScore >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  }
  
  // Computed properties for better performance
  $: hasData = statistics.totalResponden > 0;
  $: userDisplayName = user?.name || 'User';
  $: safeStatistics = {
    totalResponden: statistics.totalResponden || 0,
    averageScore: statistics.averageScore || '0.0',
    totalKuesioner: statistics.totalKuesioner || 0,
    grade: statistics.grade || 'F',
    interpretation: statistics.interpretation || {
      percentileText: '0%',
      adjectiveRating: 'Poor',
      acceptability: 'Not Acceptable'
    }
  };
</script>

<Header group="home" />

<!-- Main Dashboard Container -->
<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative pt-20 transition-all duration-500">
  <!-- Subtle Background Pattern -->
  <div class="absolute inset-0 opacity-30 dark:opacity-10 transition-opacity duration-500">
    <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(99,102,241,0.1) 1px, transparent 0); background-size: 20px 20px;"></div>
  </div>
  
  <!-- Content Container -->
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    
    <!-- Dashboard Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12 space-y-4 sm:space-y-0" in:fly={{ y: -20, duration: 800 }}>
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg ring-4 ring-blue-500/20">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">SUS Dashboard</h1>
          <p class="text-gray-600 dark:text-blue-200/80 text-sm font-medium">System Usability Scale Analytics</p>
        </div>
      </div>
      <div class="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-3 border border-gray-200/50 dark:border-white/20 self-start sm:self-auto">
        <p class="text-gray-600 dark:text-white/80 text-sm">Selamat datang,</p>
        <p class="text-gray-900 dark:text-white font-semibold text-base sm:text-lg">{userDisplayName}</p>
      </div>
    </div>

     <!-- Statistics Cards -->
     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
       <!-- Total Responden Card -->
       <div class="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 hover:border-white/30 dark:hover:border-gray-600/30 hover:-translate-y-1" in:fly={{ y: 20, duration: 800, delay: 100 }}>
         <div class="flex items-center justify-between">
           <div>
             <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Responden</p>
             <p class="text-3xl font-bold text-gray-900 dark:text-white">{safeStatistics.totalResponden}</p>
           </div>
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <svg class="w-6 h-6 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Rata-rata SUS Score Card -->
      <div class="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 hover:border-white/30 dark:hover:border-gray-600/30 hover:-translate-y-1" in:fly={{ y: 20, duration: 800, delay: 200 }}>
        <div class="flex items-center justify-between">
                     <div>
             <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Rata-rata SUS Score</p>
             <p class="text-3xl font-bold {getScoreColor(averageScore)} dark:text-white">{safeStatistics.averageScore}</p>
           </div>
           <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
             <svg class="w-6 h-6 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
               <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
             </svg>
           </div>
         </div>
       </div>

       <!-- Total Kuesioner Card -->
       <div class="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 hover:border-white/30 dark:hover:border-gray-600/30 hover:-translate-y-1" in:fly={{ y: 20, duration: 800, delay: 300 }}>
         <div class="flex items-center justify-between">
           <div>
             <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Kuesioner</p>
             <p class="text-3xl font-bold text-gray-900 dark:text-white">{safeStatistics.totalKuesioner}</p>
           </div>
           <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
             <svg class="w-6 h-6 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
               <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
               <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 014 11.5V5zM7.5 8a.5.5 0 01.5-.5h4a.5.5 0 010 1H8a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 000 1h2a.5.5 0 000-1H8z" clip-rule="evenodd"/>
             </svg>
           </div>
         </div>
       </div>

       <!-- Grade Card -->
       <div class="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 hover:border-white/30 dark:hover:border-gray-600/30 hover:-translate-y-1" in:fly={{ y: 20, duration: 800, delay: 400 }}>
         <div class="flex items-center justify-between">
           <div>
             <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Grade</p>
             <p class="text-3xl font-bold text-gray-900 dark:text-white">{safeStatistics.grade}</p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <svg class="w-6 h-6 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Visualization Area -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
      <!-- Score Distribution Chart -->
      <div in:fly={{ y: 20, duration: 800, delay: 500 }}>
        <SUSChart 
          chartData={scoreDistributionData}
          type="bar"
          title="Distribusi SUS Score"
          height="h-80"
          delay={0}
        />
      </div>

      <!-- Trend Analysis Chart -->
      <div in:fly={{ y: 20, duration: 800, delay: 600 }}>
        <SUSChart 
          chartData={trendData}
          type="line"
          title="Trend Analysis"
          height="h-80"
          delay={0}
        />
      </div>
    </div>

    <!-- SUS Score Interpretation Section -->
    <div class="mb-8 sm:mb-12" in:fly={{ y: 20, duration: 800, delay: 700 }}>
      <SUSScoreSection avgScore={averageScore} delay={0} />
    </div>

    <!-- Kriteria Perhitungan SUS Score Section -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 hover:border-white/30 dark:hover:border-gray-600/30 mb-8 sm:mb-12" in:fly={{ y: 20, duration: 800, delay: 750 }}>
      <!-- Header -->
      <div class="text-center mb-8 sm:mb-12">
        <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
          <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">📊 Kriteria Perhitungan SUS Score</h3>
      </div>

      <!-- Score Categories -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <!-- Pertanyaan Ganjil -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 sm:p-6 border border-blue-200/50 dark:border-blue-800/50">
          <div class="text-center">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span class="text-white font-bold text-lg">📝</span>
            </div>
            <h4 class="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">Pertanyaan Ganjil (1,3,5,7,9)</h4>
            <p class="text-sm text-blue-700 dark:text-blue-300 font-medium">Skor = Jawaban Pengguna - 1</p>
          </div>
        </div>

        <!-- Pertanyaan Genap -->
        <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 sm:p-6 border border-green-200/50 dark:border-green-800/50">
          <div class="text-center">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span class="text-white font-bold text-lg">📋</span>
            </div>
            <h4 class="text-lg font-bold text-green-900 dark:text-green-100 mb-2">Pertanyaan Genap (2,4,6,8,10)</h4>
            <p class="text-sm text-green-700 dark:text-green-300 font-medium">Skor = 5 - Jawaban Pengguna</p>
          </div>
        </div>

        <!-- SUS Score Final -->
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 sm:p-6 border border-purple-200/50 dark:border-purple-800/50">
          <div class="text-center">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span class="text-white font-bold text-lg">🎯</span>
            </div>
            <h4 class="text-lg font-bold text-purple-900 dark:text-purple-100 mb-2">SUS Score Final</h4>
            <p class="text-sm text-purple-700 dark:text-purple-300 font-medium">Total Skor × 2.5</p>
          </div>
        </div>
      </div>

      <!-- Formula Explanation -->
      <div class="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50">
        <h4 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
          💡 Penjelasan Rumus Perhitungan
        </h4>
        
        <div class="space-y-4 sm:space-y-6">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">1</span>
            </div>
            <div class="flex-1">
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                <span class="font-semibold text-blue-600 dark:text-blue-400">Pertanyaan Ganjil:</span> Mengurangi 1 dari jawaban karena pertanyaan bersifat positif (semakin tinggi jawaban, semakin baik)
              </p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">2</span>
            </div>
            <div class="flex-1">
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                <span class="font-semibold text-green-600 dark:text-green-400">Pertanyaan Genap:</span> Mengurangi jawaban dari 5 karena pertanyaan bersifat negatif (perlu dibalik skornya)
              </p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">3</span>
            </div>
            <div class="flex-1">
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                <span class="font-semibold text-purple-600 dark:text-purple-400">Skor Final:</span> Total semua skor dikalikan 2.5 untuk mendapatkan skala 0-100
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SUS Score Guide Section -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 hover:border-white/30 dark:hover:border-gray-600/30 mb-8 sm:mb-12" in:fly={{ y: 20, duration: 800, delay: 800 }}>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <svg class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
        Panduan SUS Score
      </h3>
      
      <!-- SUS Explanation -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-6">
        <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-3">🎯 Tentang System Usability Scale (SUS)</h4>
        <p class="text-sm text-blue-800 dark:text-blue-200 mb-3">
          SUS adalah metode standar internasional yang dikembangkan oleh John Brooke (1986) untuk mengukur kemudahan penggunaan sistem. 
          Digunakan oleh ribuan perusahaan teknologi di seluruh dunia.
        </p>
        <div class="bg-blue-100 dark:bg-blue-800/50 rounded-lg p-4">
          <h5 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">📊 Fakta Penting:</h5>
          <ul class="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• <strong>Rata-rata industri: 68</strong> (bukan 75 atau 80)</li>
            <li>• <strong>Skor 50 untuk "setuju semua"</strong> adalah normal dan sesuai standar</li>
            <li>• <strong>Menggunakan skala terbalik</strong> untuk pertanyaan genap</li>
            <li>• <strong>Skor 80+ dianggap excellent</strong> dalam usability</li>
          </ul>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Score Ranges -->
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-4">📊 Interpretasi Skor SUS:</h4>
          <div class="space-y-2">
            <div class="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-3 text-center">
              <div class="font-semibold text-green-800 dark:text-green-200">85-100</div>
              <div class="text-xs text-green-700 dark:text-green-300">Excellent (A+/A)</div>
              <div class="text-xs text-green-600 dark:text-green-400">Usability sangat baik</div>
            </div>
            <div class="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-3 text-center">
              <div class="font-semibold text-blue-800 dark:text-blue-200">68-84</div>
              <div class="text-xs text-blue-700 dark:text-blue-300">Good (B+/B)</div>
              <div class="text-xs text-blue-600 dark:text-blue-400">Di atas rata-rata</div>
            </div>
            <div class="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 text-center">
              <div class="font-semibold text-yellow-800 dark:text-yellow-200">50-67</div>
              <div class="text-xs text-yellow-700 dark:text-yellow-300">OK (C+/C)</div>
              <div class="text-xs text-yellow-600 dark:text-yellow-400">Di bawah rata-rata</div>
            </div>
            <div class="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-3 text-center">
              <div class="font-semibold text-red-800 dark:text-red-200">0-49</div>
              <div class="text-xs text-red-700 dark:text-red-300">Poor (D/F)</div>
              <div class="text-xs text-red-600 dark:text-red-400">Perlu perbaikan</div>
            </div>
          </div>
        </div>

        <!-- Current Score Summary -->
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-4">📈 Ringkasan Skor Saat Ini:</h4>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div class="text-center mb-4">
              <div class="text-4xl font-bold {getScoreColor(averageScore)} dark:text-white mb-2">
                {safeStatistics.averageScore}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                Grade: <span class="font-semibold {getScoreColor(averageScore)}">{safeStatistics.grade}</span>
              </div>
            </div>
            
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Percentile Rank:</span>
                <span class="font-medium text-gray-900 dark:text-white">{safeStatistics.interpretation.percentileText}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Rating:</span>
                <span class="font-medium text-gray-900 dark:text-white">{safeStatistics.interpretation.adjectiveRating}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Acceptability:</span>
                <span class="font-medium text-gray-900 dark:text-white">{safeStatistics.interpretation.acceptability}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SUS Results Table -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 hover:border-white/30 dark:hover:border-gray-600/30 mb-8 sm:mb-12" in:fly={{ y: 20, duration: 800, delay: 900 }}>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <svg class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
          <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 014 11.5V5zM7.5 8a.5.5 0 01.5-.5h4a.5.5 0 010 1H8a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 000 1h2a.5.5 0 000-1H8z" clip-rule="evenodd"/>
        </svg>
        Data Responden SUS
      </h3>
      <SUSFullTable 
        all_responses={all_responses} 
        pagination={pagination} 
        filters={filters} 
        onSearch={handleSearch} 
        onFilter={handleFilter} 
        onPageChange={handlePageChange} 
        isLoading={isLoading}
        on:deleteResponse={handleDeleteResponse}
      />
    </div>

    <!-- Empty State for No Data -->
    {#if !hasData}
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 sm:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 hover:border-white/30 dark:hover:border-gray-600/30 text-center" in:fly={{ y: 20, duration: 800, delay: 900 }}>
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 014 11.5V5zM7.5 8a.5.5 0 01.5-.5h4a.5.5 0 010 1H8a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 000 1h2a.5.5 0 000-1H8z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Belum Ada Data SUS</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Dashboard akan menampilkan data setelah ada responden yang mengisi kuesioner SUS.
        </p>
        <a href="/questionnaire" class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
          </svg>
          Isi Kuesioner SUS
        </a>
      </div>
    {/if}
  </div>
</div>

<style>
  .gradient-text {
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Smooth transitions for theme changes */
  .bg-white,
  .dark\\:bg-gray-800 {
    transition: background-color 0.3s ease;
  }
  
  /* Enhanced hover effects */
  .hover\\:shadow-2xl {
    transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
  }
  
  /* Smooth backdrop blur transitions */
  .backdrop-blur-sm {
    transition: backdrop-filter 0.3s ease;
  }
  
  /* Ensure smooth animation performance */
  .transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Custom scrollbar for better UX */
  :global(html) {
    scroll-behavior: smooth;
  }
</style>