import { asyncHandler } from "../utils/asyncHandler.js";
import * as itemService from "../services/itemService.js";

export const create = asyncHandler(async (req, res) => {
  const item = await itemService.createItem(req.user.id, req.body || {});
  res.status(201).json({ message: "Barang berhasil ditambahkan.", data: item });
});
export const list = asyncHandler(async (req, res) => {
  res.json(await itemService.listItems(req.user.id, req.query));
});
export const update = asyncHandler(async (req, res) => {
  const item = await itemService.updateItem(req.user.id, req.params.id, req.body || {});
  res.json({ message: "Barang berhasil diperbarui.", data: item });
});
export const remove = asyncHandler(async (req, res) => {
  await itemService.deleteItem(req.user.id, req.params.id);
  res.json({ message: "Barang berhasil dihapus." });
});
