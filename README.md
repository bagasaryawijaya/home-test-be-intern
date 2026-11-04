Sistem Manajemen Inventaris Barang — RESTful API

RESTful API untuk manajemen inventaris barang dengan autentikasi JWT, CRUD lengkap, search, pagination, validasi data, dan penanganan konkurensi stok.

Jawaban pertanyaan pemahaman (wajib)

### 1. Alur Request: dari client sampai database dan alasan pemisahan

Misalnya frontend mengirim `POST /api/items`:

1. **Client** (browser/Postman) mengirim HTTP request berisi URL, header token, dan JSON barang.
2. **Router** (`src/routes/itemRoutes.js`) mencocokkan alamat dan metode HTTP dengan fungsi yang tepat.
3. **Middleware autentikasi** (`src/middleware/auth.js`) membaca JWT, memeriksa tanda tangan dan masa berlaku token, lalu mengambil identitas user. Jika token tidak valid, request dihentikan dengan HTTP 401.
4. **Controller** (`src/controllers/itemController.js`) menerima request, memanggil service, lalu menentukan response HTTP.
5. **Service** (`src/services/itemService.js`) menjalankan aturan bisnis, misalnya memastikan nama terisi, stok bilangan bulat dan tidak negatif, serta harga valid.
6. **Model/ORM** (`src/models/Item.js` dan Sequelize) menerjemahkan operasi JavaScript menjadi query SQL.
7. **Database MySQL** menyimpan data pada tabel `items`, lalu hasilnya dikembalikan melalui Sequelize → service → controller → client dalam format JSON.

Pemisahan ini disebut *separation of concerns*. Router mengurus alamat, middleware mengurus pemeriksaan umum, controller mengurus komunikasi HTTP, service mengurus aturan bisnis, dan model/database mengurus penyimpanan. Manfaatnya: kode lebih mudah dibaca pemula, diuji, diperbaiki, dan dikembangkan. Perubahan aturan bisnis tidak perlu menumpuk di controller.

### 2. Keamanan & Token: Local Storage atau HttpOnly Cookie?

Untuk aplikasi web yang dikelola sendiri, **HttpOnly + Secure + SameSite Cookie** umumnya lebih aman terhadap pencurian token melalui JavaScript karena JavaScript di browser tidak dapat membaca cookie HttpOnly. Gunakan HTTPS di production. Atur `SameSite` dan perlindungan CSRF sesuai pola domain dan kebutuhan aplikasi.

`localStorage` lebih sederhana untuk SPA dan mudah dipakai pada header `Authorization: Bearer`, tetapi token dapat dibaca JavaScript. Jika ada celah XSS (script berbahaya berjalan di halaman), token dapat dicuri. HttpOnly Cookie mengurangi risiko pencurian token melalui XSS, tetapi browser mengirim cookie secara otomatis sehingga risiko CSRF harus ditangani (misalnya SameSite yang tepat dan CSRF token bila diperlukan).

Implementasi latihan ini mengirim JWT dalam response login dan contoh Postman memakai Bearer Token. Ini memudahkan pengujian; penyimpanan token di frontend adalah keputusan integrasi frontend, bukan dilakukan oleh API. Untuk production, pilih strategi cookie atau bearer token berdasarkan arsitektur, dan terapkan HTTPS, expiry pendek, rotasi/revokasi token bila diperlukan, serta proteksi XSS/CSRF. Jangan menyimpan secret JWT di frontend.

### 3. Penanganan Concurrency: dua user mengurangi stok yang tersisa 1

Jangan melakukan pola tidak aman: baca stok dulu di aplikasi, lalu hitung dan simpan stok baru. Dua request dapat sama-sama membaca angka 1, lalu keduanya menyimpan 0 atau membuat hasil tidak konsisten.

Gunakan **atomic conditional update** di database, yaitu satu query yang mengurangi stok hanya jika stok masih mencukupi. Contoh konsep SQL:

```sql
UPDATE items
SET stock = stock - 1
WHERE id = 10 AND stock >= 1;
```

Setelah query, periksa jumlah baris yang berubah (`affectedRows`):
- Jika `1`, pengurangan berhasil.
- Jika `0`, stok sudah tidak cukup atau barang tidak ditemukan; balas `409 Conflict`.

Database mengeksekusi UPDATE secara atomik. Jika dua request datang bersamaan ketika stok 1, satu request berhasil mengubah stok menjadi 0. Request kedua mengevaluasi kondisi `stock >= 1` setelah menunggu perubahan pertama, sehingga tidak dapat mengurangi stok lagi. Transaksi dapat digunakan untuk mengelompokkan operasi yang lebih kompleks. Contoh fungsi `decreaseStock()` disediakan di `src/services/itemService.js`, tetapi endpoint pengurangan stok tidak ditambahkan karena tidak diminta pada daftar fitur wajib.

## 6. Rancangan database

Relasi: **satu User memiliki banyak Item (1:N)**. Setiap item menyimpan `user_id` sebagai foreign key ke `users.id`.

### Tabel `users`
| Kolom | Tipe | Aturan |
|---|---|---|
| id | INT UNSIGNED | Primary key, auto increment |
| name | VARCHAR(100) | wajib |
| email | VARCHAR(150) | wajib, unik |
| password | VARCHAR(255) | wajib, berisi hash bcrypt |
| createdAt / updatedAt | DATETIME | dikelola Sequelize |

### Tabel `items`
| Kolom | Tipe | Aturan |
|---|---|---|
| id | INT UNSIGNED | Primary key, auto increment |
| user_id | INT UNSIGNED | Foreign key ke users.id |
| name | VARCHAR(150) | wajib |
| description | TEXT | boleh kosong |
| stock | INT UNSIGNED | wajib, tidak negatif |
| price | DECIMAL(15,2) | wajib, tidak negatif |
| createdAt / updatedAt | DATETIME | dikelola Sequelize |

`DECIMAL` dipakai untuk harga agar nilai uang tidak bergantung pada pembulatan floating-point database. Untuk aplikasi produksi yang membutuhkan migrasi terkontrol, gunakan Sequelize migrations; `sequelize.sync()` di project latihan ini membuat tabel otomatis saat server mulai.

Daftar endpoint

| Method | Endpoint | Login? | Fungsi |
|---|---|---|---|
| GET | `/api/health` | Tidak | Cek server |
| POST | `/api/auth/register` | Tidak | Daftar user |
| POST | `/api/auth/login` | Tidak | Login dan menerima JWT |
| POST | `/api/items` | Ya | Tambah barang |
| GET | `/api/items` | Ya | Daftar, search, pagination |
| PUT | `/api/items/:id` | Ya | Ubah barang milik sendiri |
| DELETE | `/api/items/:id` | Ya | Hapus barang milik sendiri |

Kode status penting: `200` berhasil, `201` berhasil dibuat, `400` input salah, `401` belum login/token salah, `404` data tidak ditemukan, `409` konflik (email sudah ada atau stok tidak cukup), `500` kesalahan server.