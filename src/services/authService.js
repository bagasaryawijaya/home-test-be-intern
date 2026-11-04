import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { HttpError } from "../utils/httpError.js";

export async function register({ name, email, password }) {
  if (typeof name !== "string" || !name.trim()) throw new HttpError(400, "Nama wajib diisi.");
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, "Format email tidak valid.");
  if (typeof password !== "string" || password.length < 8) throw new HttpError(400, "Password minimal 8 karakter.");
  const normalizedEmail = email.trim().toLowerCase();
  if (await User.findOne({ where: { email: normalizedEmail } })) throw new HttpError(409, "Email sudah terdaftar.");
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });
  return { id: user.id, name: user.name, email: user.email };
}

export async function login({ email, password }) {
  if (typeof email !== "string" || typeof password !== "string") throw new HttpError(400, "Email dan password wajib diisi.");
  const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
  if (!user || !(await bcrypt.compare(password, user.password))) throw new HttpError(401, "Email atau password salah.");
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}
