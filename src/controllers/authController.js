import { asyncHandler } from "../utils/asyncHandler.js";
import * as authService from "../services/authService.js";

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body || {});
  res.status(201).json({ message: "Registrasi berhasil.", data: user });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body || {});
  res.json({ message: "Login berhasil.", ...result });
});
