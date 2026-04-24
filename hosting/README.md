# Agenda Kelas - SOP Pemasangan

## 1) Struktur Final Yang Harus Ada

- `src/App.tsx` (frontend utama)
- `Code.gs` (backend Apps Script)
- `.env` (koneksi frontend ke Apps Script)
- Spreadsheet Google (database)

## 2) Template File .env (Copy-Paste)

Buat file `.env` di root project frontend:

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxx/exec
VITE_APPS_SCRIPT_TOKEN=TUC-Token-2026-Sangat-Rahasia
```

Catatan:

- Jangan pakai spasi sebelum/sesudah `=`
- Jangan upload `.env` ke publik
- Jika ganti token di backend, `.env` frontend juga harus diganti

## 3) SOP Deploy Backend Apps Script (Aman)

1. Buka project Apps Script.
2. Paste `Code.gs` terbaru.
3. Pastikan Script Properties:
   - `SPREADSHEET_ID` benar (atau kosongkan agar dibuat otomatis)
   - `APP_TOKEN` benar
4. Klik `Deploy -> Manage deployments`.
5. Edit deployment web app yang sudah ada.
6. Klik Deploy lagi.
7. Simpan URL web app (biasanya tetap, tetap cek ulang).

Checklist lulus:

- Akses URL web app dengan `?action=health`
- Harus return JSON status `ok: true`

## 4) SOP Deploy Frontend (Produksi)

1. Update `.env` dengan URL + token terbaru.
2. Jalankan:

```bash
npm install
npm run build
```

3. Upload hasil build (`dist/`) ke hosting.
4. Hard refresh browser (`Ctrl+F5`).

## 5) Sinkronisasi Real Antar User

- Frontend selalu ambil data dari Apps Script, tidak pakai localStorage.
- Frontend polling otomatis untuk update lintas user.
- Jika ada konflik edit bersamaan, frontend memuat data cloud terbaru.

## 6) Build Otomatis Tanpa Laptop (GitHub Actions)

Jika laptop Anda diblok Windows Application Control, gunakan CI build.

1. Push project ke GitHub.
2. Pastikan workflow ini ada: `.github/workflows/build.yml`.
3. Set GitHub Secrets di repository:
   - `VITE_APPS_SCRIPT_URL`
   - `VITE_APPS_SCRIPT_TOKEN`
4. Buka tab `Actions` -> jalankan workflow `Build Agenda Kelas`.
5. Download artifact `dist-build` dari hasil workflow.
6. Upload isi artifact ke hosting produksi.