<script>
  import { inertia } from '@inertiajs/svelte'
  import { fly, fade } from 'svelte/transition'
  import { Link, router } from '@inertiajs/svelte'
  import DarkModeToggle from '../Components/DarkModeToggle.svelte'
  
  export let title
  export let description
</script>

<svelte:head>
  <title>{title}</title>
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 font-['Inter'] transition-all duration-500">
  <!-- Header Navigation -->
  <nav class="bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-8">
          <div class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            CuciBaju Xperience Survey
          </div>
          <div class="hidden md:flex space-x-6">
            <a href="#about" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Tentang</a>
            <a href="#profile" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Profil</a>
            <a href="#contact" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Kontak</a>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <DarkModeToggle />
          <Link href="/login" class="hidden sm:inline-flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Login Admin
          </Link>
          <!-- Mobile Login Button -->
          <Link href="/login" class="sm:hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 text-sm rounded-lg transition-all duration-300 shadow-lg">
            Login
          </Link>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section id="home" class="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-purple-900/30"></div>
    <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 dark:opacity-10"></div>
    
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <!-- Left Content -->
        <div class="space-y-6 sm:space-y-8" in:fly={{ x: -50, duration: 800, delay: 200 }}>
          <div class="space-y-4 sm:space-y-6">
            <h1 class="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight">
              <span class="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                Bantu Kami Meningkatkan
              </span>
              <br>
              <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                layanan CuciBaju.id
              </span>
            </h1>
            <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg sm:max-w-xl">
              {description}
            </p>
          </div>
          
          <Link href="/questionnaire" class="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold text-base sm:text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl group">
            <svg class="w-5 h-5 mr-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            Mulai Kuesioner
          </Link>
        </div>

        <!-- Right Content - Modern Illustration -->
        <div class="relative" in:fly={{ x: 50, duration: 800, delay: 400 }}>
          <div class="grid grid-cols-2 gap-4 sm:gap-6">
            <div class="space-y-4 sm:space-y-6">
              <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 h-28 sm:h-36 border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div class="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg"></div>
              </div>
              <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 h-32 sm:h-44 border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div class="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg"></div>
              </div>
            </div>
            <div class="space-y-4 sm:space-y-6 mt-4 sm:mt-8">
              <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 h-32 sm:h-44 border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div class="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg"></div>
              </div>
              <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 h-28 sm:h-36 border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div class="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Why Your Opinion Matters Section -->
  <section id="about" class="py-20 bg-white dark:bg-gray-900/95">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16" in:fly={{ y: 30, duration: 800, delay: 200 }}>
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Mengapa Pendapat Anda Penting
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Kami menggunakan metode System Usability Scale (SUS) untuk mengukur kepuasan pengguna secara akurat
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {#each [
          {
            title: "Mudah & Cepat",
            description: "Kuesioner hanya membutuhkan 2-3 menit untuk diselesaikan dengan 10 pertanyaan sederhana",
            icon: "check-mark-1.png",
            gradient: "from-blue-500 to-indigo-600"
          },
          {
            title: "Suara Pengguna",
            description: "Setiap feedback akan kami gunakan untuk meningkatkan pengalaman pengguna yang lebih baik",
            icon: "check-mark-2.png",
            gradient: "from-green-500 to-emerald-600"
          },
          {
            title: "Analisis Mendalam",
            description: "Menggunakan metode SUS yang telah terbukti untuk mengukur usability secara objektif",
            icon: "check-mark-3.png",
            gradient: "from-purple-500 to-pink-600"
          },
          {
            title: "Data Aman",
            description: "Privasi Anda terjamin. Data hanya digunakan untuk analisis dan perbaikan layanan",
            icon: "check-mark-4.png",
            gradient: "from-orange-500 to-red-600"
          }
        ] as feature, i}
          <div 
            class="group text-center p-6 sm:p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            in:fly={{ y: 30, duration: 800, delay: 400 + (i * 100) }}
          >
            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br {feature.gradient} dark:{feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{feature.title}</h3>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>



  <!-- Profile Section -->
  <section id="profile" class="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-blue-900/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12 sm:mb-16 lg:mb-20" in:fly={{ y: 20, duration: 800 }}>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4 sm:mb-6">Profil CuciBaju.id</h2>
        <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Platform laundry terdepan yang mengutamakan kualitas, kecepatan, dan kepuasan pelanggan
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
        <!-- Left Content -->
        <div class="space-y-6 sm:space-y-8" in:fly={{ x: -50, duration: 800, delay: 200 }}>
          <div class="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 sm:p-8 rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center mb-4 sm:mb-6">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Sejarah Kami</h3>
            </div>
            <p class="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              cucibaju.id berdiri tahun 2004 dengan nama FRESH LAUNDRY dengan konsep laundry rumahan tradisonal, menjadi sedikit modern tahun 2014 dengan membuat aplikasi offline pendataan pelanggan dan barang laundry detail dengan foto menggunakan teknologi informasi (sangat membantu pencegahan barang laundry dari hilang/tertukar), setelah mengalami masa pandemi COVID-19, tercetuslah ide perubahan untuk membuat suatu konsep laundry yang lebih modern, maka mulai pertengahan tahun 2022 kami berubah menjadi cucibaju.id dengan menggunakan metode online sehingga memudahkan komunikasi kami dengan pelanggan.
            </p>
          </div>
        </div>

        <!-- Right Content - Profile Image -->
        <div class="relative" in:fly={{ x: 50, duration: 800, delay: 400 }}>
          <div class="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 rounded-3xl p-6 sm:p-8 lg:p-10 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-300">
            <div class="text-center">
              <div class="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
                <svg class="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <h3 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4 sm:mb-6">CuciBaju.id</h3>
              <p class="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                Solusi laundry modern untuk kehidupan yang lebih praktis
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div class="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                  <div class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">20+</div>
                  <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Tahun</div>
                </div>
                <div class="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                  <div class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">24/7</div>
                  <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Layanan</div>
                </div>
                <div class="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                  <div class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">99%</div>
                  <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Kepuasan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section id="contact" class="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900/95 dark:via-blue-900/20 dark:to-indigo-900/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12 sm:mb-16 lg:mb-20" in:fly={{ y: 30, duration: 800, delay: 200 }}>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4 sm:mb-6">
          Hubungi Kami
        </h2>
        <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Punya pertanyaan tentang kuesioner atau layanan kami? Tim customer service cucibaju.id siap membantu Anda 24/7. Jangan ragu untuk menghubungi kami melalui berbagai channel komunikasi yang tersedia.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-5xl mx-auto">
        <!-- Email Contact -->
        <div class="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 lg:p-10 text-center space-y-4 sm:space-y-6 border border-white/20 dark:border-gray-700/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2" in:fly={{ y: 30, duration: 800, delay: 400 }}>
          <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Email</h3>
          <p class="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Kirim pertanyaan atau feedback Anda melalui email<br>
            <span class="font-bold text-blue-600 dark:text-blue-400 text-base sm:text-lg lg:text-xl">roykhanmaulana25@gmail.com</span>
          </p>
          <div class="pt-2 sm:pt-4">
            <div class="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              Kirim Email
            </div>
          </div>
        </div>

        <!-- WhatsApp Contact -->
        <div class="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 lg:p-10 text-center space-y-4 sm:space-y-6 border border-white/20 dark:border-gray-700/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2" in:fly={{ y: 30, duration: 800, delay: 500 }}>
          <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">WhatsApp</h3>
          <p class="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Chat langsung dengan tim support via WhatsApp<br>
            <span class="font-bold text-green-600 dark:text-green-400 text-base sm:text-lg lg:text-xl">+62 822 3237 1971</span>
          </p>
          <div class="pt-2 sm:pt-4">
            <div class="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Chat Sekarang
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer id="contact" class="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 dark:from-black dark:via-gray-900/95 dark:to-blue-900/90 text-white py-16 sm:py-20 relative overflow-hidden transition-all duration-500">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10 dark:opacity-20 transition-opacity duration-500">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 dark:from-blue-400/10 dark:to-indigo-400/10"></div>
      <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)] animate-pulse"></div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
        <!-- Company Info -->
        <div class="col-span-1 sm:col-span-2" in:fly={{ y: 20, duration: 800, delay: 200 }}>
          <div class="mb-4 sm:mb-6">
            <h3 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-3 sm:mb-4">CuciBaju Xperience Survey</h3>
            <div class="w-16 sm:w-20 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mb-4 sm:mb-6"></div>
          </div>
          <p class="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base lg:text-lg">
            Layanan laundry online terpercaya dengan teknologi terdepan untuk kemudahan hidup Anda. Bergabunglah dengan ribuan pelanggan yang telah merasakan kemudahan layanan kami.
          </p>
          <div class="flex space-x-3 sm:space-x-4">
            <div class="group w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 cursor-pointer transform hover:scale-110 shadow-lg hover:shadow-xl">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </div>
            <div class="group w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center hover:from-green-600 hover:to-emerald-700 transition-all duration-300 cursor-pointer transform hover:scale-110 shadow-lg hover:shadow-xl">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </div>
            <div class="group w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center hover:from-purple-600 hover:to-pink-700 transition-all duration-300 cursor-pointer transform hover:scale-110 shadow-lg hover:shadow-xl">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Services -->
        <div in:fly={{ y: 20, duration: 800, delay: 300 }}>
          <h4 class="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 relative">
            Layanan
            <div class="absolute bottom-0 left-0 w-10 sm:w-12 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
          </h4>
          <ul class="space-y-2 sm:space-y-3">
            <li><a href="#" class="text-gray-300 hover:text-white transition-all duration-300 flex items-center group text-sm sm:text-base">
              <div class="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
              <span class="group-hover:translate-x-1 transition-transform duration-300">Cuci Kering</span>
            </a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-all duration-300 flex items-center group text-sm sm:text-base">
              <div class="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
              <span class="group-hover:translate-x-1 transition-transform duration-300">Cuci Setrika</span>
            </a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-all duration-300 flex items-center group text-sm sm:text-base">
              <div class="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
              <span class="group-hover:translate-x-1 transition-transform duration-300">Dry Cleaning</span>
            </a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-all duration-300 flex items-center group text-sm sm:text-base">
              <div class="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
              <span class="group-hover:translate-x-1 transition-transform duration-300">Sepatu & Tas</span>
            </a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div in:fly={{ y: 20, duration: 800, delay: 400 }}>
          <h4 class="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 relative">
            Kontak
            <div class="absolute bottom-0 left-0 w-10 sm:w-12 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
          </h4>
          <ul class="space-y-3 sm:space-y-4">
            <li class="flex items-center group">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg flex items-center justify-center mr-2 sm:mr-3 group-hover:from-blue-500/30 group-hover:to-indigo-600/30 transition-all duration-300">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <span class="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm sm:text-base">roykhanmaulana25@gmail.com</span>
            </li>
            <li class="flex items-center group">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-lg flex items-center justify-center mr-2 sm:mr-3 group-hover:from-green-500/30 group-hover:to-emerald-600/30 transition-all duration-300">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <span class="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm sm:text-base">+62 822 3237 1971</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gradient-to-r from-transparent via-gray-700 to-transparent mt-12 sm:mt-16 pt-6 sm:pt-8">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <p class="text-gray-400 text-sm sm:text-base mb-0">
            © 2025 cuciBaju Xperience Survey. Semua hak dilindungi.
          </p>
          <div class="flex items-center space-x-3 sm:space-x-4">
            <span class="text-gray-400 text-xs sm:text-sm">Dibuat dengan</span>
            <div class="flex items-center space-x-2">
              <span class="text-gray-300 font-medium text-sm sm:text-base">LAJU</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</div>