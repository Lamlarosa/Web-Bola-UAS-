1. Deskripi proyek
    My Foootball adalah web eksplorasi liga sepak bola dunia berbasis React + TypeScript yang dirancang untuk memberikan informasi lengkap dan menarik seputar berbagai kompetisi sepak bola dari seluruh dunia. Aplikasi ini menampilkan data liga populer, klasemen tim, kategori negara, hingga pencarian liga favorit pengguna secara real-time dan interaktif. Tampilan dirancang dengan UI modern yang responsif.

2. API yang digunakan
    Proyek ini menggunakan API-Football v3 sebagai sumber data utama yang bisa diakses dengan menggunakan link "https://www.api-football.com/" dan untuk menggunakan API ini kita perlu 
    -Mendaftar akun di https://www.api-football.com/
    -Mendapatkan API Key Pribadi
    -Menyimpannya kedalam .env.local
    Perlu diketahui bahwasanya API ini bisa digunakan secara gratis, namun data yang bisa digunakan hanyalah data 2023 kebawah serta limit request perharinya adalah 100 dan akan reset setiap UTC 00:00 (07:00 WIB) dan untuk mengakses data 2024 ke atas kita perlu membayarnya alias perlu akses premiumnya.

3. Fitur-Fitur Utama
    1. Authentikasi Pengguna : Memverifikasi identitas pengguna sebelum memberikan akses ke website.
    2. Pencarian Liga dan Negara : Fitur pencarian memungkinkan pengguna menemukan liga berdasarkan nama atau negara secara real-time Input pencarian responsif dan terintegrasi langsung dengan filter negara.
    3. Filter Berdasarkan Negara : Dropdown interaktif memungkinkan pengguna memfilter liga yang ditampilkan berdasarkan asal negara, mempermudah pencarian spesifik dan relevan.
    4. Kategori Liga Populer : Navigasi khusus untuk mengeksplorasi liga-liga populer di seluruh dunia berdasarkan kategori tertentu.
    5. Halaman Favorit (Hanya untuk Pengguna Login) : Pengguna dapat menyimpan liga favorit mereka dan mengaksesnya dengan mudah melalui halaman Favorit, halaman ini bersifat pribadi dan hanya tersedia jika pengguna telah login.
    6. Navigasi Responsif (Mobile & Desktop) :Navigasi dirancang untuk semua ukuran layar, dengan layout responsif dan intuitif untuk pengguna desktop maupun mobile.
    7. CRUD di halaman favorit : Pengguna dapat menambah, melihat, mengedit dan menghapus tim yang sebelumnya pengguna tambahkan ke halaman favorit.
    8. Mode Gelap/Terang (Theme Toggle) : Pengguna dapat mengubah tema tampilan UI antara mode terang dan gelap dengan satu klik, dengan penyimpanan preferensi secara otomatis.
    9. Animasi & UI Modern (Tailwind + Lucide Icons) : Tampilan dirancang menggunakan Tailwind CSS dan ikon lucide-react untuk memberikan kesan visual yang modern dan bersih. Dilengkapi animasi saat hover dan transisi tema.
    10. Navigasi Halaman : Beranda, Kategori Liga (berdasarkan negara), Favorit, Login.

4.  #Struktur Halaman

        bolaku/
    ├── public/                         # File publik (favicon, index.html, dll)
    │
    ├── src/                            # Source code utama
    │   ├── assets/                     # Gambar dan ikon
    │   │   └── logos/                  # Logo aplikasi
    │   │
    │   ├── components/                 # Komponen global & UI
    │   │   └── ui/                     # Komponen antarmuka pengguna
    │   │       ├── CategoryTab.tsx     # Tab navigasi kategori liga
    │   │       ├── LeagueCard.tsx      # Kartu informasi liga
    │   │       ├── StandingsTable.tsx  # Tabel klasemen liga
    │   │       └── Header.tsx          # Header navigasi
    │   │
    │   ├── pages/                      # Halaman utama aplikasi
    │   │   ├── CategoryPage.tsx        # Halaman kategori liga (per negara)
    │   │   ├── HomePage.tsx            # Halaman utama - list liga
    │   │   └── StandingsPage.tsx       # Halaman detail klasemen liga
    │   │
    │   ├── services/                   # Konfigurasi dan utilitas API
    │   │   ├── api.ts                  # Fungsi-fungsi pemanggil API
    │   │   └── axiosInstance.ts        # Konfigurasi axios dengan API key
    │   │
    │   ├── App.tsx                     # Definisi route & struktur utama aplikasi
    │   ├── main.tsx                    # Entry point React (createRoot)
    │   ├── index.css                   # Global CSS (Tailwind)
    │
    ├── .env.example                    # Contoh file environment untuk API key
    ├── tailwind.config.js              # Konfigurasi Tailwind CSS
    ├── tsconfig.json                   # Konfigurasi TypeScript
    ├── vite.config.ts                  # Konfigurasi Vite.js
    ├── package.json                    # Daftar dependensi dan script
    └── README.md                       # Dokumentasi proyek

    #Struktur Routing

    |     Halaman     |         Path           |                  Deskripsi                        |
    |-----------------|-----------------------=|---------------------------------------------------|
    | Home            | `/`                    |        "Menampilkan daftar liga populer"          |
    | Kategori        | `/categories`          |"Menampilkan daftar liga berdasarkan negara/region"|
    | Detail Klasemen | `/standings/:leagueId` | "Menampilkan klasemen lengkap untuk liga tertentu"|

                    Routing ditangani oleh `react-router-dom` pada file `App.tsx`.

5. Cara Menjalankan Aplikasi

    1. Clone repository dari github dengan menggunakan cmd
        -Buka cmd
        -Arahkan ke folder yang ingin digunakan sebagai direktori penyimpanan aplikasi
        -ketik "git clone https://github.com/Lamlarosa/Web-Bola-UAS-.git" (salin ini)
        -ketik "cd bolaku" (buka folder aplikasi)
        -ketik "npm install" (install dependencies)
        -Buat file .env dan tambahkan API Key : VITE_API_KEY=api_key_anda
        -Jalankan aplikasi, ketik "npm run dev"

6. Link live demo ""
