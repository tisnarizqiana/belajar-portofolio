/**
 * Centralized Portfolio Configuration & Content Layer
 * 
 * CATATAN PENGGUNA:
 * Anda dapat menyesuaikan seluruh teks, tautan sosial media, data proyek,
 * dan keahlian di file ini tanpa perlu mengubah kode komponen antarmuka.
 */

export const portfolioData = {
  personal: {
    name: "Tisna Rizqiana",
    role: "Full-Stack Developer",
    location: "Indonesia",
    // GANTI DENGAN EMAIL & PROFIL ASLI ANDA SEBELUM PUBLIKASI:
    email: "tisnarizqiana@example.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    whatsapp: "", // Opsional: Contoh: "https://wa.me/628123456789"
    bio: "Pengembang web yang berfokus membangun aplikasi modern, fungsional, dan terstruktur dari sisi antarmuka hingga logika backend.",
    status: "Terbuka untuk peluang kerja & kolaborasi proyek",
  },
  hero: {
    greeting: "Halo, saya seorang",
    title: "Full-Stack Developer",
    description: "Saya membangun aplikasi web yang responsif, terstruktur, dan berorientasi pada kebutuhan pengguna. Berkomitmen mengembangkan kemampuan frontend dan backend melalui eksplorasi teknologi modern serta proyek nyata.",
    primaryCta: { text: "Lihat Proyek", href: "#projects" },
    secondaryCta: { text: "Hubungi Saya", href: "#contact" },
    codeSnippet: {
      fileName: "DeveloperProfile.js",
      language: "javascript",
      code: `const developer = {
  name: 'Tisna Rizqiana',
  role: 'Full-Stack Developer',
  passion: 'Building scalable & intuitive web apps',
  coreStack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
  availableForWork: true,
  currentFocus: 'Full-stack web architecture & clean code'
};`
    }
  },
  about: {
    title: "Tentang Saya",
    subtitle: "Mengenal lebih dekat dedikasi, prinsip kerja, dan pendekatan saya dalam rekayasa perangkat lunak",
    paragraphs: [
      "Perjalanan saya di dunia pemrograman berakar dari ketertarikan mendalam terhadap bagaimana kode dapat mentransformasi ide menjadi solusi nyata. Saya menikmati proses merancang antarmuka pengguna yang bersih sekaligus menyusun arsitektur data dan API yang tangguh di sisi backend.",
      "Sebagai developer di tahap awal karier, prioritas utama saya adalah membangun fondasi teknis yang kuat: memahami konsep secara mendalam, menulis kode yang rapi (clean code), modular, serta mudah dirawat.",
      "Saya sangat antusias untuk bergabung dalam lingkungan tim kolaboratif, berkontribusi pada pemecahan masalah praktis, dan terus menyerap standar rekayasa perangkat lunak industri."
    ],
    highlights: [
      { label: "Fokus Utama", value: "Web App (Frontend & Backend)" },
      { label: "Filosofi Kode", value: "Clean, Maintainable & Modular" },
      { label: "Status Kesiapan", value: "Terbuka untuk Magang / Junior Role" },
      { label: "Komunikasi", value: "Bahasa Indonesia & English (Technical)" }
    ]
  },
  skills: {
    title: "Keahlian Teknis",
    subtitle: "Teknologi dan perkakas kerja yang saya pelajari serta terapkan secara praktis",
    categories: [
      {
        id: "frontend",
        name: "Frontend Development",
        description: "Membangun antarmuka yang cepat, responsif, dan ramah pengguna.",
        items: [
          { name: "React.js", detail: "Hooks, Komponen Modular, State Management" },
          { name: "JavaScript (ES6+)", detail: "Async/Await, DOM Manipulation, Modular ES" },
          { name: "Tailwind CSS v4", detail: "Utility-first, Theme Customization, Responsive" },
          { name: "HTML5 & Semantic Web", detail: "Aksesibilitas & Struktur SEO" },
          { name: "CSS3", detail: "Flexbox, CSS Grid, Transitions" }
        ]
      },
      {
        id: "backend",
        name: "Backend Development",
        description: "Menyusun logika server, endpoint RESTful, dan integrasi data.",
        items: [
          { name: "Node.js", detail: "Asynchronous Event-driven Architecture" },
          { name: "Express.js", detail: "Middleware, Routing, & Controller Pattern" },
          { name: "REST API", detail: "CRUD Endpoints & Standard HTTP Responses" }
        ]
      },
      {
        id: "databases",
        name: "Databases",
        description: "Perancangan skema data relasional dan query terstruktur.",
        items: [
          { name: "PostgreSQL", detail: "Relational Modeling & Structured Queries" },
          { name: "MySQL", detail: "Table Constraints & Normalization" }
        ]
      },
      {
        id: "tools",
        name: "Tools & Workflow",
        description: "Ekosistem produktivitas untuk pengembangan dan kolaborasi kode.",
        items: [
          { name: "Git & GitHub", detail: "Version Control, Branching, & Commits" },
          { name: "Vite", detail: "Modern Frontend Build Tool" },
          { name: "npm", detail: "Dependency & Package Management" },
          { name: "Browser DevTools", detail: "Debugging, Performance & Network Inspection" },
          { name: "VS Code", detail: "Code Editor & Extensions" }
        ]
      }
    ]
  },
  projects: {
    title: "Proyek Pilihan",
    subtitle: "Kompilasi proyek pembelajaran dan aplikasi nyata yang menunjukkan alur rekayasa perangkat lunak",
    categories: ["Semua", "Full-Stack", "Frontend", "Backend"],
    list: [
      {
        id: "task-management-app",
        title: "Personal Task Management System",
        category: "Full-Stack",
        description: "Aplikasi manajemen tugas terstruktur dengan pelacakan status proyek, filter prioritas berdasarkan tenggat waktu, dan penyimpanan data terorganisir.",
        techStack: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "PostgreSQL"],
        githubUrl: "https://github.com",
        demoUrl: "",
        isSample: true,
        features: [
          "CRUD daftar aktivitas dengan indikator status dinamis",
          "Filter kategori tugas (To-Do, In Progress, Completed)",
          "Antarmuka responsif adaptif untuk desktop dan mobile"
        ],
        themeIcon: "tasks"
      },
      {
        id: "ecommerce-product-catalog",
        title: "Product Catalog & Cart Interface",
        category: "Frontend",
        description: "Antarmuka katalog produk interaktif dengan pencarian instan, filter multi-kategori, kalkulasi keranjang belanja dinamis, dan validasi jumlah item.",
        techStack: ["React.js", "JavaScript (ES6+)", "Tailwind CSS", "Lucide React"],
        githubUrl: "https://github.com",
        demoUrl: "",
        isSample: true,
        features: [
          "Manajemen state keranjang belanja dengan React Hooks",
          "Pencarian kata kunci dan filter harga secara instan",
          "Desain tata letak berbasis card dengan micro-interactions"
        ],
        themeIcon: "shop"
      },
      {
        id: "restful-api-service",
        title: "RESTful Content Management API",
        category: "Backend",
        description: "Layanan backend API untuk pengelolaan konten terstruktur dengan validasi input, penanganan error tersentralisasi, dan relasi data.",
        techStack: ["Node.js", "Express.js", "PostgreSQL", "REST API"],
        githubUrl: "https://github.com",
        demoUrl: "",
        isSample: true,
        features: [
          "Endpoint RESTful lengkap dengan kode status HTTP semantik",
          "Error handling terpusat dan sanitasi parameter input",
          "Arsitektur modular memisahkan controller, router, dan data layer"
        ],
        themeIcon: "api"
      },
      {
        id: "weather-explorer",
        title: "Interactive Weather & City Dashboard",
        category: "Frontend",
        description: "Dashboard prakiraan cuaca yang mengonsumsi REST API cuaca publik untuk menampilkan informasi suhu, kelembaban, dan angin secara visual.",
        techStack: ["React.js", "Tailwind CSS", "REST API", "Lucide React"],
        githubUrl: "https://github.com",
        demoUrl: "",
        isSample: true,
        features: [
          "Pengambilan data asinkron dengan visualisasi status loading dan error",
          "Format representasi data metrik cuaca yang rapi dan mudah dibaca",
          "Navigasi antar kota cepat tanpa perlu reload halaman"
        ],
        themeIcon: "weather"
      }
    ]
  },
  journey: {
    title: "Perjalanan & Milestone",
    subtitle: "Rangkaian eksplorasi dan pencapaian pembelajaran terarah dalam pengembangan software",
    milestones: [
      {
        period: "2024 - Sekarang",
        title: "Eksplorasi Full-Stack & Arsitektur Web Modern",
        organization: "Pembelajaran Terstruktur & Proyek Praktik",
        description: "Fokus mendalami ekosistem React modern, pembuatan REST API dengan Express.js, serta perancangan skema database relasional (PostgreSQL & MySQL).",
        tags: ["React.js", "Node.js", "PostgreSQL", "Tailwind CSS"]
      },
      {
        period: "2023 - 2024",
        title: "Penguatan Fondasi Pemrograman & Web Standards",
        organization: "Eksplorasi Fundamental",
        description: "Mempelajari logika algoritma pemrograman, standar HTML5 semantik, CSS modern (Flexbox, Grid), serta kontrol versi dengan Git & GitHub.",
        tags: ["JavaScript ES6+", "HTML5 Semantic", "CSS Grid/Flexbox", "Git"]
      },
      {
        period: "Awal Mula",
        title: "Inisiasi Minat dalam Rekayasa Perangkat Lunak",
        organization: "Eksplorasi Teknologi Digital",
        description: "Mengenal dunia pemrograman melalui eksplorasi cara kerja web, browser, dan potensi teknologi perangkat lunak dalam memecahkan masalah sehari-hari.",
        tags: ["Problem Solving", "Web Fundamentals", "Self-Taught"]
      }
    ]
  },
  contact: {
    title: "Hubungi Saya",
    subtitle: "Terbuka untuk diskusi kesempatan kerja, magang, kerja sama proyek, atau sekadar bertukar wawasan teknis.",
    email: "tisnarizqiana@example.com", // Ganti dengan email asli
    location: "Indonesia",
    availabilityText: "Tersedia untuk magang, posisi junior developer, atau kolaborasi proyek freelance.",
    note: "Formulir ini menggunakan mekanisme client-side mailto yang aman untuk membuka draf pesan langsung di aplikasi email Anda tanpa menyimpan data sensitif di server pihak ketiga."
  }
};
