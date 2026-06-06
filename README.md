# Data Keuangan

Aplikasi web mobile-first untuk mencatat pemasukan, pengeluaran, budget, laporan bulanan, kategori, dan dompet. App berjalan langsung dengan data demo di `localStorage`, lalu bisa dihubungkan ke Google Sheets melalui Google Apps Script.

## Jalankan Lokal

```powershell
npm.cmd install
npm.cmd run dev
```

Build production:

```powershell
npm.cmd run build
```

PowerShell di beberapa Windows memblokir `npm.ps1`, jadi gunakan `npm.cmd` bila muncul error execution policy.

## Mode Data

- Tanpa `.env`: app memakai data demo lokal di browser.
- Dengan Google Apps Script: salin `.env.example` menjadi `.env`, lalu isi:

```env
VITE_GAS_API_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

## Google Sheets

Buat spreadsheet dengan sheet berikut:

- `Transactions`: `id,date,type,category,amount,wallet,note,created_at,updated_at`
- `Categories`: `id,name,type,icon,color`
- `Wallets`: `id,name,initial_balance,note`
- `Budgets`: `id,month,category,limit_amount,created_at`
- `Goals`: `id,name,target_amount,current_amount,deadline,created_at`
- `Settings`: `key,value`

File backend tersedia di [apps-script/Code.gs](apps-script/Code.gs).

Cara cepat:

1. Buka Google Sheets, pilih `Extensions > Apps Script`.
2. Paste isi `apps-script/Code.gs`.
3. Ganti `SPREADSHEET_ID`.
4. Jalankan fungsi `setupDatabase` sekali untuk membuat header dan data awal.
5. Deploy sebagai `Web app`, `Execute as: Me`, `Who has access: Anyone`.
6. Masukkan URL deployment ke `VITE_GAS_API_URL`.

`Code.gs` juga otomatis membuat sheet yang belum ada saat endpoint dipanggil. Fungsi `setupDatabase` tetap berguna untuk inisialisasi awal dan seed kategori/dompet/settings.

## Netlify

Konfigurasi sudah tersedia di [netlify.toml](netlify.toml):

- Build command: `npm run build`
- Publish directory: `dist`

Tambahkan environment variable `VITE_GAS_API_URL` di Netlify bila memakai Google Apps Script.
