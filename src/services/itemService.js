import { Op } from "sequelize";
import sequelize from "../config/database.js";
import Item from "../models/Item.js";
import { HttpError } from "../utils/httpError.js";

function validateItem(data, partial = false) {
  const errors = [];
  if (!partial || data.name !== undefined) {
    if (typeof data.name !== "string" || !data.name.trim()) errors.push("Nama barang wajib berupa teks dan tidak boleh kosong.");
  }
  if (!partial || data.description !== undefined) {
    if (data.description !== undefined && data.description !== null && typeof data.description !== "string") errors.push("Deskripsi harus berupa teks.");
  }
  if (!partial || data.stock !== undefined) {
    if (!Number.isInteger(data.stock) || data.stock < 0) errors.push("Stok harus berupa bilangan bulat dan tidak boleh negatif.");
  }
  if (!partial || data.price !== undefined) {
    if (typeof data.price !== "number" || !Number.isFinite(data.price) || data.price < 0) errors.push("Harga harus berupa angka dan tidak boleh negatif.");
  }
  if (errors.length) throw new HttpError(400, errors.join(" "));
}

export async function createItem(userId, data) {
  validateItem(data);
  return Item.create({ userId, name: data.name.trim(), description: data.description ?? null, stock: data.stock, price: data.price });
}

export async function listItems(userId, query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 10));
  const search = typeof query.search === "string" ? query.search.trim() : "";
  const where = { userId };
  if (search) where.name = { [Op.like]: `%${search}%` };
  const result = await Item.findAndCountAll({
    where, order: [["createdAt", "DESC"], ["id", "DESC"]],
    limit, offset: (page - 1) * limit
  });
  return {
    data: result.rows,
    pagination: { page, limit, totalItems: result.count, totalPages: Math.ceil(result.count / limit) }
  };
}

export async function updateItem(userId, id, data) {
  if (!Object.keys(data).length) throw new HttpError(400, "Kirim minimal satu field untuk diperbarui.");
  validateItem(data, true);
  const item = await Item.findOne({ where: { id, userId } });
  if (!item) throw new HttpError(404, "Barang tidak ditemukan.");
  const safe = { ...data };
  if (safe.name !== undefined) safe.name = safe.name.trim();
  await item.update(safe);
  return item;
}

export async function deleteItem(userId, id) {
  const item = await Item.findOne({ where: { id, userId } });
  if (!item) throw new HttpError(404, "Barang tidak ditemukan.");
  await item.destroy();
}

// Contoh aman untuk pengurangan stok secara atomik: satu perintah UPDATE bersyarat.
// UPDATE hanya berhasil jika stok masih >= jumlah yang ingin dikurangi.
export async function decreaseStock(userId, id, quantity) {
  if (!Number.isInteger(quantity) || quantity <= 0) throw new HttpError(400, "Jumlah pengurangan harus bilangan bulat positif.");
  return sequelize.transaction(async (transaction) => {
    const [affected] = await Item.update(
      { stock: sequelize.literal(`stock - ${quantity}`) },
      { where: { id, userId, stock: { [Op.gte]: quantity } }, transaction }
    );
    if (!affected) throw new HttpError(409, "Stok tidak cukup atau barang tidak ditemukan.");
    return Item.findOne({ where: { id, userId }, transaction });
  });
}
