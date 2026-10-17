# Professional Full-Stack Developer Portfolio

Portofolio web modern, responsif, dan berorientasi performa tinggi untuk Full-Stack Developer. Dibangun dengan fondasi teknologi mutakhir: **React.js**, **Vite**, **Tailwind CSS v4**, dan **Lucide React**. Siap dideploy ke **Vercel** dengan konfigurasi security headers terstandarisasi.

---

## 🚀 Fitur Utama

- **Desain Modern Blue-Tech**: Menggunakan palet bertema deep navy (`#071426`), subtle technical grid, kontras tinggi sesuai standar aksesibilitas WCAG 2.2 AA, dan micro-interactions halus.
- **Lapisan Data Terpusat (`src/data/portfolio.js`)**: Seluruh profil diri, resume singkat, keahlian teknis, repositori proyek, tautan sosial, dan kontak dapat diubah dari satu file konfigurasi tanpa menyentuh komponen UI.
- **Navigasi Cerdas & Responsif**: Pelacakan bagian aktif di viewport secara otomatis dengan `IntersectionObserver`, smooth scrolling, serta drawer menu mobile yang ramah aksesibilitas keyboard (Escape key & focus management).
- **Katalog Proyek Interaktif**: Dilengkapi filter kategori real-time (*Full-Stack*, *Frontend*, *Backend*) dan preview grafis CSS/SVG tanpa ketergantungan pada gambar eksternal yang lambat.
- **Formulir Kontak Aksesibel & Transparan**: Validasi format email RFC 5322 di sisi client dengan penanganan error interaktif, dan integrasi mekanisme `mailto:` yang aman tanpa klaim palsu penyimpanan data ke server.
- **Fondasi SEO & Keamanan Siap Produksi**: Dilengkapi meta tags, Open Graph, Twitter Cards, `robots.txt`, `sitemap.xml`, custom SVG favicon, serta header keamanan di `vercel.json` (`nosniff`, `X-Frame-Options: DENY`, `strict-origin-when-cross-origin`, `Permissions-Policy`).

---

## 🛠️ Stack Teknologi

| Komponen | Teknologi |
| :--- | :--- |
| **Framework** | [React.js](https://react.dev/) (v19) |
| **Build Tool & Bundler** | [Vite](https://vite.dev/) (v8) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite` |
| **Ikon Antarmuka** | [Lucide React](https://lucide.dev/) & SVG Brand Icons |
| **Pengujian (Testing)** | [Vitest](https://vitest.dev/) |
| **Linter** | [Oxlint](https://oxc.rs/) |
| **Hosting & Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Struktur Direktori Proyek

```text
├── public/
│   ├── favicon.svg          # Favicon khusus developer
│   ├── robots.txt           # Konfigurasi perayapan mesin pencari (SEO)
│   └── sitemap.xml          # Peta situs untuk pengindeksan publik
├── src/
│   ├── assets/              # Aset statis lokal
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx   # Header navigasi desktop & drawer mobile
│   │   │   └── Footer.jsx   # Footer dengan copyright dinamis & tautan
│   │   ├── sections/
│   │   │   ├── Hero.jsx     # Header pengantar & cuplikan kode interaktif
│   │   │   ├── About.jsx    # Profil singkat & prinsip kerja
│   │   │   ├── Skills.jsx   # Pengelompokan keahlian teknis tanpa persentase arbitrer
│   │   │   ├── Projects.jsx # Galeri proyek dengan filter kategori
│   │   │   ├── Journey.jsx  # Garis waktu rekam jejak & pembelajaran
│   │   │   └── Contact.jsx  # Formulir kontak & opsi komunikasi langsung
│   │   └── ui/
│   │       ├── Badge.jsx    # Komponen label/tag teknologi
│   │       ├── Button.jsx   # Tombol aksesibel & tautan dengan styling seragam
│   │       ├── Card.jsx     # Kontainer kartu bertema navy
│   │       ├── Icons.jsx    # Ikon vektor mandiri (GitHub, LinkedIn)
│   │       ├── ProjectIllustration.jsx # Visual preview proyek berbasis SVG/CSS
│   │       └── SectionHeading.jsx      # Tipografi judul bagian seragam
│   ├── data/
│   │   └── portfolio.js     # DATA TERPUSAT: Semua teks & konfigurasi proyek
│   ├── hooks/
│   │   └── useActiveSection.js # Hook pelacak bagian aktif di viewport
│   ├── utils/
│   │   ├── validation.js    # Logika validasi email dan formulir
│   │   └── validation.test.js # Unit test otomatis dengan Vitest
│   ├── App.jsx              # Komponen utama dengan skip-to-content link
│   ├── index.css            # Entry point Tailwind CSS v4 & konfigurasi tema
│   └── main.jsx             # Entry point React DOM
├── index.html               # Halaman utama berstruktur HTML5 semantik & SEO
├── package.json             # Dependensi dan scripts
├── vercel.json              # Pengaturan deployment & security response headers
└── vite.config.js           # Konfigurasi plugin Vite & Tailwind CSS v4
```

---

## ⚡ Panduan Instalasi & Menjalankan Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) v18.0.0 atau yang lebih baru (Disarankan Node.js v20+ / v24).
- npm, pnpm, atau yarn.

### 1. Kloning Repositori
```bash
git clone https://github.com/USERNAME_ANDA/potofolio.git
cd potofolio
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Pengembangan (Dev Server)
```bash
npm run dev
```
Buka browser di alamat `http://localhost:5173`.

---

## 📜 Skrip yang Tersedia

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan Vite lokal dengan Hot Module Replacement (HMR). |
| `npm run build` | Melakukan kompilasi bundle produksi yang dioptimalkan ke direktori `dist/`. |
| `npm run preview` | Menjalankan preview lokal dari bundle produksi `dist/`. |
| `npm run lint` | Menjalankan linter cepat Oxlint untuk memeriksa kebersihan dan kualitas kode. |
| `npm test` | Menjalankan pengujian unit otomatis menggunakan Vitest. |

---

## ✏️ Cara Mengkustomisasi Portofolio

Semua data portofolio dikumpulkan dalam file **[`src/data/portfolio.js`](src/data/portfolio.js)**. Anda tidak perlu menyunting kode React untuk mengganti informasi pribadi Anda.

### 1. Mengubah Profil Pribadi & Media Sosial
Buka `src/data/portfolio.js` dan sesuaikan objek `personal`:
```javascript
personal: {
  name: "Nama Lengkap Anda",
  role: "Full-Stack Developer",
  email: "email.asli.anda@domain.com",
  github: "https://github.com/username-anda",
  linkedin: "https://linkedin.com/in/username-anda",
  whatsapp: "https://wa.me/628123456789", // Opsional
  bio: "Deskripsi singkat tentang fokus rekayasa perangkat lunak Anda.",
  status: "Terbuka untuk peluang kerja & magang",
}
```

### 2. Menambah atau Mengubah Proyek
Pada bagian `projects.list` di `src/data/portfolio.js`, Anda dapat menambahkan proyek baru dengan struktur:
```javascript
{
  id: "nama-proyek-unik",
  title: "Nama Aplikasi Anda",
  category: "Full-Stack", // Pilih: "Full-Stack", "Frontend", atau "Backend"
  description: "Penjelasan ringkas tentang masalah yang diselesaikan aplikasi ini.",
  techStack: ["React.js", "Node.js", "PostgreSQL"],
  githubUrl: "https://github.com/username-anda/repo-proyek",
  demoUrl: "https://demo-aplikasi-anda.vercel.app", // Biarkan "" jika belum live
  isSample: false, // Ubah ke false jika ini proyek pribadi asli Anda
  features: [
    "Fitur kunci pertama",
    "Fitur kunci kedua"
  ],
  themeIcon: "tasks" // Pilihan tema ilustrasi: "tasks", "shop", "api", "weather"
}
```

### 3. Memperbarui Keahlian Teknis
Sesuaikan array `skills.categories` di `src/data/portfolio.js` sesuai dengan bahasa pemrograman, framework, basis data, dan alat kerja yang Anda gunakan.

---

## 🚢 Panduan Deployment ke Vercel

Aplikasi ini telah dipersiapkan sepenuhnya untuk dideploy langsung ke **Vercel** tanpa konfigurasi rumit tambahan.

### Opsi A: Deployment via GitHub & Dashboard Vercel (Disarankan)

1. **Inisialisasi & Push ke GitHub**:
   ```bash
   git add .
   git commit -m "feat: inisialisasi portofolio full-stack developer"
   git branch -M main
   git remote add origin https://github.com/USERNAME_ANDA/NAMA_REPO.git
   git push -u origin main
   ```
2. **Buka Dashboard Vercel**: Masuk ke [vercel.com](https://vercel.com) menggunakan akun GitHub Anda.
3. **Import Project**: Klik tombol **"Add New..."** &rarr; **"Project"**, lalu pilih repositori yang baru saja Anda push.
4. **Verifikasi Pengaturan Build**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. **Deploy**: Klik tombol **"Deploy"**. Vercel akan memproses build dalam waktu sekitar 30 detik.
6. **Perbarui Domain Sitemap & Robots**:
   Setelah mendapatkan URL Vercel (misal: `https://tisna-portfolio.vercel.app`), ganti placeholder URL pada:
   - `public/robots.txt`
   - `public/sitemap.xml`

### Opsi B: Deployment via Vercel CLI
```bash
# Instal Vercel CLI (jika belum terinstal)
npm install -g vercel

# Jalankan proses deployment langsung dari terminal
vercel
```

---

## 🛡️ Kebijakan Keamanan & Praktik Terbaik

- **Tanpa Secret Klien**: Tidak ada kunci API pribadi atau token rahasia yang disimpan pada kode frontend.
- **Link Eksternal Aman**: Setiap link pembuka tab baru (`target="_blank"`) dilengkapi secara ketat dengan atribut `rel="noopener noreferrer"`.
- **Sanitasi Formulir**: Validasi input formulir menggunakan aturan regex RFC 5322 tanpa memicu injeksi skrip.
- **Security Headers Terpasang**: `vercel.json` secara otomatis menginjeksi header perlindungan browser:
  - `X-Content-Type-Options: nosniff` (mencegah MIME sniffing)
  - `X-Frame-Options: DENY` (mencegah Clickjacking)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()` (memblokir akses izin perangkat yang tidak diperlukan)

---

## 📄 Lisensi
Hak Cipta © 2026. Proyek ini dilisensikan di bawah [MIT License](LICENSE).
