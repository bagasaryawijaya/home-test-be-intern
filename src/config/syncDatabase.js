import dotenv from "dotenv";
dotenv.config();
import sequelize from "./database.js";
import "../models/User.js";
import "../models/Item.js";
try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  console.log("Sinkronisasi tabel selesai.");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
