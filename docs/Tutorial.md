# Repo FE Koperasi PABW

# Teknologi yang dipakai :

- Next.js (React,React-Router,React-DOM)
- Tailwind CSS

## Requirement

Node.js 18.18 or latest version

### **Git fetch**

jangan lupa `git fetch --all --prune` sebelum memulai ngoding, takutnya ada
perubahan yang belum diambil dari remote repo

### Commit github

- Untuk pengerjaan fitur/halaman baru, kerjainnya di branch baru ya. Jangan
  langsung nyentuh branch main, biar nanti gak conflict pas mau ngefetch dan
  pull kalau ada update baru
- Commit message kasih yang bagus dan mudah dimengerti, biar langsung tau apa
  saja yang dibuat/diubah

### **Setup Project**

- Bikin halaman baru src/app/(pages)/[Nama_halaman (yang mau dibuat)]/page.jsx
  nah ngoding halamannya di file page.jsx itu.
- Logic API server/namafile.js Note : satu file isinya satu logic API, biar
  gampang untuk maintenance kedepannya
- Bikin component baru src/app/components/[Nama_komponennya.jsx] (Sudah tau lah
  yah cara bikin komponen kayak mana)
- Menambah teknologi baru Kalau misalnya mau tambah teknologi baru, seperti
  pakai shadcn buat bikin UI jadi gampang, jangan lupa diskusiin dulu yah.

### **test Web**

run app-nya pake perintah `npm run dev`, lalu buka browser dan akses ke url
http://localhost:3000/, untuk nampilin halaman yang mau ditest, cukup tambahin
Nama_halamannya di urlnya.

- Misalnya mau nampilin halaman src/app/(pages)/Login/page.jsx,
- Di urlnya cukup tulis http://localhost:3000/Login, nanti muncul tuh halaman
  loginnya. Kalau masih bingung, bisa lihat dokumentasi ini
  https://nextjs.org/docs/app/getting-started/project-structure#colocation Note
  = ini cuma sementara, soalnya home page-nya belum ada samsek.

### Test API

kalau mau test API, clone dulu dari github ini
https://github.com/azureeeeeeeeeeee/koperasi-be.git, soalnya masih belum bisa
API-nya kalau di luar localnya

### Cek Design Figma

Cek link figma https://www.figma.com/files/project/353917766 buat melihat harus
bikin halaman web seperti apa.
