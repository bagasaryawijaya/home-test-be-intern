import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import sequelize from "./config/database.js";

const PORT = Number(process.env.PORT || 3000);
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET wajib diisi dan minimal 32 karakter. Periksa file .env.");
  process.exit(1);
}

try {
  await sequelize.authenticate();
  console.log("Koneksi database berhasil.");
  await sequelize.sync();
  console.log("Tabel database siap.");
  app.listen(PORT, () => console.log(`API berjalan di http://localhost:${PORT}`));
} catch (error) {
  console.error("Gagal menjalankan server/database:", error.message);
  process.exit(1);
}
