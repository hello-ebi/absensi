// absensi/backend/controllers/Notifikasi.js

import Notifikasi from "../models/notifikasiModels.js";
import { jwtDecode } from "jwt-decode";

// Membuat notifikasi baru
export const createNotifikasi = async (req, res) => {
  const { judul, pesan } = req.body;
  const decoded = jwtDecode(req.headers.authorization.split(" ")[1]);

  if (!decoded.id_admin) {
    return res.status(403).json({ msg: "Akses ditolak, hanya admin yang dapat membuat notifikasi" });
  }

  try {
    await Notifikasi.create({
      judul,
      pesan,
      status: "belum_dibaca",
    });
    res.status(201).json({ msg: "Notifikasi berhasil dibuat" });
  } catch (error) {
    console.error("Error in createNotifikasi:", error.message);
    res.status(500).json({ msg: "Gagal membuat notifikasi", error: error.message });
  }
};

// Mendapatkan semua notifikasi
export const getNotifikasiByUser = async (req, res) => {
  try {
    const notifikasi = await Notifikasi.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(notifikasi);
  } catch (error) {
    console.error("Error in getNotifikasiByUser:", error.message);
    res.status(500).json({ msg: "Gagal mengambil notifikasi", error: error.message });
  }
};

// Menandai notifikasi sebagai dibaca
export const markAsRead = async (req, res) => {
  const { id_notifikasi } = req.params;
  try {
    const notifikasi = await Notifikasi.findOne({ where: { id_notifikasi } });
    if (!notifikasi) {
      return res.status(404).json({ msg: "Notifikasi tidak ditemukan" });
    }
    await notifikasi.update({ status: "dibaca" });
    res.json({ msg: "Notifikasi ditandai sebagai dibaca" });
  } catch (error) {
    console.error("Error in markAsRead:", error.message);
    res.status(500).json({ msg: "Gagal memperbarui notifikasi", error: error.message });
  }
};

// Menghapus notifikasi
export const deleteNotifikasi = async (req, res) => {
  const { id } = req.params;
  const decoded = jwtDecode(req.headers.authorization.split(" ")[1]);

  if (!decoded.id_admin) {
    return res.status(403).json({ msg: "Akses ditolak, hanya admin yang dapat menghapus notifikasi" });
  }

  try {
    const notifikasi = await Notifikasi.findByPk(id);
    if (!notifikasi) {
      return res.status(404).json({ msg: "Notifikasi tidak ditemukan" });
    }
    await notifikasi.destroy();
    res.json({ msg: "Notifikasi berhasil dihapus" });
  } catch (error) {
    console.error("Error in deleteNotifikasi:", error.message);
    res.status(500).json({ msg: "Gagal menghapus notifikasi", error: error.message });
  }
};

// Memperbarui notifikasi
export const updateNotifikasi = async (req, res) => {
  const { id } = req.params;
  const { judul, pesan, status } = req.body;
  const decoded = jwtDecode(req.headers.authorization.split(" ")[1]);

  if (!decoded.id_admin) {
    return res.status(403).json({ msg: "Akses ditolak, hanya admin yang dapat memperbarui notifikasi" });
  }

  try {
    const notifikasi = await Notifikasi.findByPk(id);
    if (!notifikasi) {
      return res.status(404).json({ msg: "Notifikasi tidak ditemukan" });
    }

    await notifikasi.update({
      judul: judul || notifikasi.judul,
      pesan: pesan || notifikasi.pesan,
      status: status || notifikasi.status,
      updatedAt: new Date(),
    });

    res.json({ msg: "Notifikasi berhasil diperbarui" });
  } catch (error) {
    console.error("Error in updateNotifikasi:", error.message);
    res.status(500).json({ msg: "Gagal memperbarui notifikasi", error: error.message });
  }
};