import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Token tidak ditemukan. Gunakan Authorization: Bearer <token>." });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.userId, { attributes: ["id", "name", "email"] });
    if (!user) return res.status(401).json({ message: "Akun tidak ditemukan atau token tidak berlaku." });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Token tidak valid atau sudah kedaluwarsa." });
  }
}
