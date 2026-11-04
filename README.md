Inventory Management API

RESTful API untuk mengelola data inventaris barang yang dibangun menggunakan Node.js dan Express.js. Project ini dikembangkan sebagai backend application dengan database MySQL dan Sequelize ORM untuk mengelola interaksi data secara terstruktur.

API ini menyediakan fondasi backend untuk sistem manajemen inventaris, dengan dukungan autentikasi, konfigurasi database, serta pengelolaan aplikasi berbasis REST API.

Tech Stack
Komponen	Teknologi
Runtime	Node.js (v20+)
Framework	Express.js
Database	MySQL 8.4
ORM	Sequelize
Database Driver	mysql2
Authentication	JWT (jsonwebtoken)
Password Hashing	bcryptjs
Security	Helmet
Rate Limiting	express-rate-limit
Environment Configuration	dotenv
Containerization	Docker & Docker Compose
Development Tool	Nodemon
Project Structure
text
home-test-be-intern/
│
├── postman/                 # Postman collection untuk testing API
│
├── src/                     # Source code aplikasi
│
├── .env.example             # Template environment variables
├── .gitignore               # Git ignore configuration
├── Dockerfile               # Docker image configuration
├── docker-compose.yml       # MySQL database configuration
├── package.json             # Project dependencies & scripts
├── package-lock.json        # Dependency lock file
└── README.md                # Project documentation

Features
RESTful API architecture.
MySQL database integration menggunakan Sequelize ORM.
JWT-based authentication.
Password hashing menggunakan bcryptjs.
HTTP security headers menggunakan Helmet.
Request rate limiting untuk membantu melindungi API.
Environment-based configuration.
Docker support untuk menjalankan database.
Postman collection untuk pengujian endpoint API.
Requirements

Pastikan beberapa tools berikut sudah terinstall:

Node.js v20 atau lebih baru.
npm.
MySQL 8.4 atau Docker.
Git.
Postman (opsional, untuk testing API).
Installation & Setup
1. Clone Repository
bash
git clone https://github.com/bagasaryawijaya/home-test-be-intern.git

cd home-test-be-intern

2. Install Dependencies
bash
npm install

3. Environment Configuration

Buat file .env berdasarkan template yang tersedia:

bash
cp .env.example .env


Kemudian sesuaikan konfigurasi environment:

env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3307
DB_NAME=Admin
DB_USER=inventory_user
DB_PASSWORD=your_database_password

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d

CORS_ORIGIN=http://localhost:5173


Keterangan Environment Variables:

Variable	Description
PORT	Port aplikasi backend
NODE_ENV	Application environment
DB_HOST	Database host
DB_PORT	Database port
DB_NAME	Database name
DB_USER	Database username
DB_PASSWORD	Database password
JWT_SECRET	Secret key untuk JWT
JWT_EXPIRES_IN	Masa berlaku JWT
CORS_ORIGIN	Allowed frontend origin

Sesuaikan nilai environment dengan konfigurasi database yang digunakan. Contoh di atas menggunakan konfigurasi port MySQL Docker yang diekspos ke host.

4. Run Database with Docker

Project ini menyediakan Docker Compose untuk menjalankan MySQL 8.4.

Jalankan perintah:

bash
docker compose up -d


Periksa container:

bash
docker ps


Pastikan container MySQL berjalan dengan baik sebelum menjalankan aplikasi.

5. Database Synchronization

Untuk melakukan sinkronisasi model Sequelize dengan database, jalankan:

bash
npm run db:sync

6. Run Application

Development Mode

bash
npm run dev


Production Mode

bash
npm start


Jika aplikasi berhasil dijalankan, server akan menggunakan port yang telah dikonfigurasi melalui environment variable PORT.

API Testing

Project menyediakan folder postman/ yang berisi resource untuk pengujian API.

Untuk melakukan testing:

Buka aplikasi Postman.
Import collection dari folder postman/.
Pastikan backend server sudah berjalan.
Sesuaikan konfigurasi base URL dengan server lokal.
Jalankan request yang tersedia pada collection.
Available Scripts

Berikut adalah command yang tersedia pada project:

Command	Description
npm start	Menjalankan aplikasi dalam production mode
npm run dev	Menjalankan aplikasi dalam development mode menggunakan Nodemon
npm run db:sync	Melakukan sinkronisasi database menggunakan Sequelize
Docker Configuration

Project menggunakan Docker Compose untuk menjalankan database MySQL secara terisolasi.

Konfigurasi database:

Configuration	Value
Database Image	MySQL 8.4
Container Name	inventory-mysql
Container Port	3306
Host Port	3307
Restart Policy	unless-stopped
Persistent Storage	mysql_data

Data database disimpan menggunakan Docker volume sehingga data tetap tersedia ketika container dihentikan atau dijalankan kembali.

Security

Beberapa mekanisme keamanan yang digunakan dalam project ini:

JWT Authentication: Menggunakan JSON Web Token untuk autentikasi.
Password Hashing: Menggunakan bcryptjs untuk hashing password.
Helmet: Membantu mengamankan HTTP response headers.
Rate Limiting: Membatasi jumlah request untuk mengurangi risiko penyalahgunaan API.
Environment Variables: Menyimpan konfigurasi sensitif di luar source code.

Pastikan tidak mengunggah file .env atau credential database ke repository publik.