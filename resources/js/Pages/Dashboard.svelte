<script>
  import { inertia } from '@inertiajs/svelte'
  import { fly, fade } from 'svelte/transition'
  
  export let title
  export let description
</script>

<svelte:head>
  <title>{title}</title>
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
</svelte:head>

<div class="min-h-screen bg-white font-['Inter']">
  <!-- Header Navigation -->
  <nav class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-8">
          <div class="text-xl font-semibold text-gray-900">
            CuciBaju Xperience Survey
          </div>
          <div class="hidden md:flex space-x-6">
            <a href="#" class="text-gray-600 hover:text-gray-900">Profil</a>
            <a href="#" class="text-gray-600 hover:text-gray-900">Fitur</a>
            <a href="#" class="text-gray-600 hover:text-gray-900">Kontak</a>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Login Admin
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div class="space-y-8" in:fly={{ x: -50, duration: 800, delay: 200 }}>
          <div class="space-y-4">
            <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Bantu Kami Meningkatkan
              <span class="text-blue-600">layanan CuciBaju.id</span>
            </h1>
            <p class="text-lg text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
          
          <button class="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            Mulai Kuesioner
          </button>
        </div>

        <!-- Right Content - Images -->
        <div class="relative" in:fly={{ x: 50, duration: 800, delay: 400 }}>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-4">
              <div class="bg-white rounded-lg shadow-md p-4 h-32"></div>
              <div class="bg-white rounded-lg shadow-md p-4 h-40"></div>
            </div>
            <div class="space-y-4 mt-8">
              <div class="bg-white rounded-lg shadow-md p-4 h-40"></div>
              <div class="bg-white rounded-lg shadow-md p-4 h-32"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Why Your Opinion Matters Section -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16" in:fly={{ y: 30, duration: 800, delay: 200 }}>
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          mengapa pendapat anda penting
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Kami menggunakan metode System Usability Scale (SUS) untuk mengukur kepuasan pengguna secara akurat
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {#each [
          {
            title: "Mudah & Cepat",
            description: "Kuesioner hanya membutuhkan 2-3 menit untuk diselesaikan dengan 10 pertanyaan sederhana",
            icon: "check-mark-1.png"
          },
          {
            title: "Suara Pengguna",
            description: "Setiap feedback akan kami gunakan untuk meningkatkan pengalaman pengguna yang lebih baik",
            icon: "check-mark-2.png"
          },
          {
            title: "Analisis Mendalam",
            description: "Menggunakan metode SUS yang telah terbukti untuk mengukur usability secara objektif",
            icon: "check-mark-3.png"
          },
          {
            title: "Data Aman",
            description: "Privasi Anda terjamin. Data hanya digunakan untuk analisis dan perbaikan layanan",
            icon: "check-mark-4.png"
          }
        ] as feature, i}
          <div 
            class="text-center space-y-4 p-6 rounded-lg hover:bg-gray-50 transition-colors"
            in:fly={{ y: 30, duration: 800, delay: 400 + (i * 100) }}
          >
            <div class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
              <div class="w-8 h-8 bg-green-500 rounded"></div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">{feature.title}</h3>
            <p class="text-gray-600">{feature.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Profile Section -->
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div class="space-y-6" in:fly={{ x: -50, duration: 800, delay: 200 }}>
          <h2 class="text-3xl lg:text-4xl font-bold text-blue-600">
            Profil CuciBaju.id
          </h2>
          <p class="text-gray-600 leading-relaxed">
            cucibaju.id berdiri tahun 2004 dengan nama FRESH LAUNDRY dengan konsep laundry rumahan tradisonal, menjadi sedikit modern tahun 2014 dengan membuat aplikasi offline pendataan pelanggan dan barang laundry detail dengan foto menggunakan teknologi informasi (sangat membantu pencegahan barang laundry dari hilang/tertukar), setelah mengalami masa pandemi COVID-19, tercetuslah ide perubahan untuk membuat suatu konsep laundry yang lebih modern, maka mulai pertengahan tahun 2022 kami berubah menjadi cucibaju.id dengan menggunakan metode online sehingga memudahkan komunikasi kami dengan pelanggan.
          </p>
        </div>

        <!-- Right Content - Profile Image -->
        <div class="relative" in:fly={{ x: 50, duration: 800, delay: 400 }}>
          <div class="bg-white rounded-lg shadow-lg p-8 h-80"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16" in:fly={{ y: 30, duration: 800, delay: 200 }}>
        <h2 class="text-3xl lg:text-4xl font-bold text-blue-600 mb-4">
          Hubungi Kami
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Punya pertanyaan tentang kuesioner atau layanan kami? Tim customer service cucibaju.id siap membantu Anda 24/7. Jangan ragu untuk menghubungi kami melalui berbagai channel komunikasi yang tersedia.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <!-- Email Contact -->
        <div class="bg-gray-50 rounded-lg p-8 text-center space-y-4" in:fly={{ y: 30, duration: 800, delay: 400 }}>
          <div class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
            <div class="w-8 h-8 bg-green-500 rounded"></div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900">Email</h3>
          <p class="text-gray-600">
            Kirim pertanyaan atau feedback Anda melalui email<br>
            <span class="font-semibold">roykhanmaulana25@gmail.com</span>
          </p>
        </div>

        <!-- WhatsApp Contact -->
        <div class="bg-gray-50 rounded-lg p-8 text-center space-y-4" in:fly={{ y: 30, duration: 800, delay: 500 }}>
          <div class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
            <div class="w-8 h-8 bg-green-500 rounded"></div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900">Whatsapp</h3>
          <p class="text-gray-600">
            Chat langsung dengan tim support via WhatsApp<br>
            <span class="font-semibold">+62 822 3237 1971</span>
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Company Info -->
        <div class="space-y-4">
          <h3 class="text-xl font-bold">CuciBaju xperience survey</h3>
          <p class="text-gray-400">
            Layanan laundry online terpercaya dengan teknologi terdepan untuk kemudahan hidup Anda.
          </p>
        </div>

        <!-- Services -->
        <div class="space-y-4">
          <h3 class="text-xl font-bold">Layanan</h3>
          <ul class="space-y-2 text-gray-400">
            <li>Cuci Kering</li>
            <li>Cuci Setrika</li>
            <li>Dry Cleaning</li>
            <li>Sepatu & Tas</li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="space-y-4">
          <h3 class="text-xl font-bold">Kontak</h3>
          <div class="space-y-2 text-gray-400">
            <p>roykhanmaulana25@gmail.com</p>
            <p>WhatsApp: +62 822 3237 1971</p>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
        <p>© 2025 cuciBaju Xperience Survey. Semua hak dilindungi.</p>
      </div>
    </div>
  </footer>
</div>