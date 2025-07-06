<script>
  import { page } from '@inertiajs/svelte';
  import { fly, fade } from 'svelte/transition';
  import Header from '../../Components/Header.svelte';
  import SUSResultsTable from '../../Components/SUSResultsTable.svelte';
import SUSScoreSection from '../../Components/SUSScoreSection.svelte';
  
  // Get data from Inertia props
  let statistics = $page.props.statistics || {
    total_responden: 0,
    rata_rata_sus_score: '0.0',
    total_kuesioner: 0
  };
  
  let recent_responses = $page.props.recent_responses || [];
  let sus_interpretation = $page.props.sus_interpretation || {
    percentile_rank: '0%',
    adjective_rating: 'Poor',
    acceptability: 'Not Acceptable'
  };
  
  // Calculate grade based on average score
  let averageScore = parseFloat(statistics.rata_rata_sus_score);
  let grade = 'F';
  if (averageScore >= 90) grade = 'A+';
  else if (averageScore >= 85) grade = 'A';
  else if (averageScore >= 80) grade = 'B+';
  else if (averageScore >= 75) grade = 'B';
  else if (averageScore >= 70) grade = 'C+';
  else if (averageScore >= 65) grade = 'C';
  else if (averageScore >= 60) grade = 'D';
  
  // Pagination state
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalItems = statistics.total_responden || 0;
  let tableResponses = recent_responses || [];
  
  // Handle page change from table component
  async function handlePageChange(event) {
    const { page } = event.detail;
    currentPage = page;
    
    try {
      const response = await fetch(`/admin/questionnaire-responses?page=${page}&limit=${itemsPerPage}`);
      const data = await response.json();
      
      if (data.data) {
        tableResponses = data.data;
        totalItems = data.pagination.total;
      }
    } catch (error) {
      console.error('Error fetching paginated data:', error);
    }
  }
</script>

<Header group="admin" />

<!-- Main Dashboard Container -->
<div class="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 pt-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Dashboard Header -->
    <div class="flex items-center justify-between mb-8" in:fly={{ y: -20, duration: 800 }}>
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white">Admin Dashboard</h1>
      </div>
      <div class="flex items-center space-x-4">
        <button class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          LIHAT WEBSITE
        </button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          LOGOUT
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Responden Card -->
      <div class="bg-white rounded-xl p-6 shadow-lg" in:fly={{ y: 20, duration: 800, delay: 100 }}>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Total Responden</p>
            <p class="text-3xl font-bold text-gray-900">{statistics.total_responden}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Rata-rata SUS Score Card -->
      <div class="bg-white rounded-xl p-6 shadow-lg" in:fly={{ y: 20, duration: 800, delay: 200 }}>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Rata-rata SUS Score</p>
            <p class="text-3xl font-bold text-gray-900">{statistics.rata_rata_sus_score}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Kuesioner Card -->
      <div class="bg-white rounded-xl p-6 shadow-lg" in:fly={{ y: 20, duration: 800, delay: 300 }}>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Total Kuesioner</p>
            <p class="text-3xl font-bold text-gray-900">{statistics.total_kuesioner}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 014 11.5V5zM7.5 8a.5.5 0 01.5-.5h4a.5.5 0 010 1H8a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 000 1h2a.5.5 0 000-1H8z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Grade Card -->
      <div class="bg-white rounded-xl p-6 shadow-lg" in:fly={{ y: 20, duration: 800, delay: 400 }}>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Grade</p>
            <p class="text-3xl font-bold text-gray-900">{grade}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Visualization Area -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Chart Placeholder 1 -->
      <div class="bg-white rounded-xl p-6 shadow-lg" in:fly={{ y: 20, duration: 800, delay: 500 }}>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">📊 Visualisasi Data</h3>
        <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p class="text-gray-500">Chart akan ditampilkan di sini</p>
        </div>
      </div>

      <!-- Chart Placeholder 2 -->
      <div class="bg-white rounded-xl p-6 shadow-lg" in:fly={{ y: 20, duration: 800, delay: 600 }}>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">📈 Trend Analysis</h3>
        <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p class="text-gray-500">Chart akan ditampilkan di sini</p>
        </div>
      </div>
    </div>

    <!-- SUS Score Interpretation Section -->
    <div in:fly={{ y: 20, duration: 800, delay: 700 }}>
      <SUSScoreSection averageScore={statistics.rata_rata_sus_score} />
    </div>

    <!-- SUS Score Criteria Section -->
    <div class="bg-white rounded-xl p-6 shadow-lg mb-8" in:fly={{ y: 20, duration: 800, delay: 800 }}>
      <h3 class="text-lg font-semibold text-gray-900 mb-6">📋 Panduan Lengkap SUS Score</h3>
      
      <!-- SUS Explanation -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h4 class="font-semibold text-blue-900 mb-3">🎯 Tentang System Usability Scale (SUS)</h4>
        <p class="text-sm text-blue-800 mb-3">
          SUS adalah metode standar internasional yang dikembangkan oleh John Brooke (1986) untuk mengukur kemudahan penggunaan sistem. 
          Digunakan oleh ribuan perusahaan teknologi di seluruh dunia.
        </p>
        <div class="bg-blue-100 rounded-lg p-4">
          <h5 class="font-semibold text-blue-900 mb-2">📊 Fakta Penting:</h5>
          <ul class="text-xs text-blue-800 space-y-1">
            <li>• <strong>Rata-rata industri: 68</strong> (bukan 75 atau 80)</li>
            <li>• <strong>Skor 50 untuk "setuju semua"</strong> adalah normal dan sesuai standar</li>
            <li>• <strong>Menggunakan skala terbalik</strong> untuk pertanyaan genap</li>
            <li>• <strong>Skor 80+ dianggap excellent</strong> dalam usability</li>
          </ul>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Formula Calculation -->
        <div class="lg:col-span-2">
          <h4 class="font-medium text-gray-900 mb-4">🧮 Formula Perhitungan SUS (Skala 1-5):</h4>
          <div class="space-y-4">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 class="font-semibold text-green-800 mb-2">Pertanyaan Ganjil (1, 3, 5, 7, 9) - Positif:</h5>
              <code class="text-sm bg-green-100 px-2 py-1 rounded">Kontribusi = (jawaban - 1) × 2.5</code>
              <p class="text-xs text-green-700 mt-1">Contoh: Jawaban 4 = (4-1) × 2.5 = 7.5 poin</p>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h5 class="font-semibold text-orange-800 mb-2">Pertanyaan Genap (2, 4, 6, 8, 10) - Negatif:</h5>
              <code class="text-sm bg-orange-100 px-2 py-1 rounded">Kontribusi = (5 - jawaban) × 2.5</code>
              <p class="text-xs text-orange-700 mt-1">Contoh: Jawaban 2 = (5-2) × 2.5 = 7.5 poin</p>
            </div>
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h5 class="font-semibold text-purple-800 mb-2">Total SUS Score:</h5>
              <code class="text-sm bg-purple-100 px-2 py-1 rounded">SUS Score = Σ(semua kontribusi)</code>
              <p class="text-xs text-purple-700 mt-1">Rentang: 0-100 poin</p>
            </div>
          </div>
        </div>

        <!-- Score Ranges -->
        <div>
          <h4 class="font-medium text-gray-900 mb-4">📊 Interpretasi Skor SUS:</h4>
          <div class="space-y-2">
            <div class="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
              <div class="font-semibold text-green-800">85-100</div>
              <div class="text-xs text-green-700">Excellent (A)</div>
              <div class="text-xs text-green-600">Usability sangat baik</div>
            </div>
            <div class="bg-blue-100 border border-blue-300 rounded-lg p-3 text-center">
              <div class="font-semibold text-blue-800">68-84</div>
              <div class="text-xs text-blue-700">Good (B)</div>
              <div class="text-xs text-blue-600">Di atas rata-rata</div>
            </div>
            <div class="bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-center">
              <div class="font-semibold text-yellow-800">50-67</div>
              <div class="text-xs text-yellow-700">OK (C)</div>
              <div class="text-xs text-yellow-600">Di bawah rata-rata</div>
            </div>
            <div class="bg-red-100 border border-red-300 rounded-lg p-3 text-center">
              <div class="font-semibold text-red-800">0-49</div>
              <div class="text-xs text-red-700">Poor (F)</div>
              <div class="text-xs text-red-600">Perlu perbaikan</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Example Calculation -->
      <div class="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 class="font-medium text-gray-900 mb-4">💡 Contoh Perhitungan:</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h5 class="font-semibold mb-2">Skenario: Semua jawaban "Setuju" (4)</h5>
            <div class="space-y-1 text-xs">
              <div>Q1,3,5,7,9: (4-1) × 2.5 = 7.5 × 5 = 37.5</div>
              <div>Q2,4,6,8,10: (5-4) × 2.5 = 2.5 × 5 = 12.5</div>
              <div class="font-semibold border-t pt-1">Total: 37.5 + 12.5 = 50</div>
            </div>
          </div>
          <div>
            <h5 class="font-semibold mb-2">Skenario: Jawaban Optimal</h5>
            <div class="space-y-1 text-xs">
              <div>Q1,3,5,7,9: "Sangat Setuju" (5) = 10 × 5 = 50</div>
              <div>Q2,4,6,8,10: "Sangat Tidak Setuju" (1) = 10 × 5 = 50</div>
              <div class="font-semibold border-t pt-1">Total: 50 + 50 = 100</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Table -->
    <div in:fly={{ y: 20, duration: 800, delay: 900 }}>
      <SUSResultsTable 
        responses={tableResponses}
        {currentPage}
        {itemsPerPage}
        {totalItems}
        on:pageChange={handlePageChange}
      />
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
</style>