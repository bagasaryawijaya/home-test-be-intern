export function notFound(req, res) {
  res.status(404).json({ message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.` });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ message: "Email sudah terdaftar." });
  }
  if (err.name === "SequelizeValidationError" || err.name === "SequelizeDatabaseError" && err.status === 400) {
    return res.status(400).json({ message: "Data tidak valid.", errors: err.errors?.map(e => e.message) || [] });
  }
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ message: status >= 500 ? "Terjadi kesalahan pada server." : err.message });
}
