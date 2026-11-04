import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || true }));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200, standardHeaders: "draft-7", legacyHeaders: false }));

app.get("/api/health", (req, res) => res.json({ status: "ok", message: "Inventory API berjalan." }));
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
