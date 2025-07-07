// absensi/backend/controllers/Absensi.js

import db from "../config/database.js";
import { Op } from "sequelize";
import Absensi from "../models/absensiModels.js";
import UsersMahasiswa from "../models/userMahasiswaModels.js";
import Matakuliah from "../models/matakuliahModels.js";
import Dosen from "../models/dosenModels.js";
import Prodi from "../models/prodiModels.js"; 

export const getAbsensi = async (req, res) => {
  try {
        console.log("User dari token:", req.user);
    const absensi = await Absensi.findAll({
      include: [
        { model: UsersMahasiswa, as: "Usersmahasiswa", attributes: ["nim", "nama"] },
        {
          model: Matakuliah, as: "Matakuliah", attributes: ["id_matakuliah", "nama_matakuliah"],
          include: [
            { model: Dosen, as: "Dosen", attributes: ["nama_dosen"] },
            { model: Prodi, as: "Prodi", attributes: ["nama_prodi"] },
          ],
        },
      ],
    });
    res.json(absensi);
  } catch (error) {
        console.error("Error fetching absensi:", error.message);
    console.log(`Error: ${error}`);
    res.status(500).json({  msg: "Gagal mengambil data absensi", error: error.message  });
  }
};

export const createAbsensi = async (req, res) => {
  const { nim, id_matakuliah, waktu_absen, status, keterangan } = req.body;
  const user = req.user;
  try {

    if (user.role !== "admin" && nim !== user.nim) {
      return res.status(403).json({ msg: "Akses ditolak: Anda hanya dapat menambahkan absensi untuk diri sendiri" });
    }

    if (user.role !== "admin") {
      const matakuliah = await Matakuliah.findOne({ where: { id_matakuliah } });
      if (!matakuliah) return res.status(404).json({ msg: "Mata kuliah tidak ditemukan" });

      const waktuAbsen = new Date(waktu_absen);
      const hariAbsen = waktuAbsen.toLocaleString("id-ID", { weekday: "long" });
      const jamAbsen = waktuAbsen.toTimeString().split(" ")[0];

      const hariMap = {
        Sabtu: "Sabtu",
        Minggu: "Minggu",
      };
      if (hariMap[hariAbsen] !== matakuliah.hari) {
        return res.status(403).json({ msg: `Absensi hanya diperbolehkan pada hari ${matakuliah.hari}` });
      }

      if (jamAbsen < matakuliah.jam_mulai || jamAbsen > matakuliah.jam_selesai) {
        return res.status(403).json({
          msg: `Absensi hanya diperbolehkan antara ${matakuliah.jam_mulai} dan ${matakuliah.jam_selesai}`,
        });
      }
    }

    await Absensi.create({
      nim,
      id_matakuliah,
      waktu_absen,
      status,
      keterangan,
    });
    res.json({ msg: "Absensi berhasil ditambahkan" });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ msg: "Gagal menambahkan absensi" });
  }
};

export const updateAbsensi = async (req, res) => {
  try {
    const { nim, id_matakuliah, waktu_absen, status, keterangan } = req.body;
    const absensi = await Absensi.findOne({
      where: { id_absen: req.params.id },
    });
    if (!absensi) return res.status(404).json({ msg: "Absensi tidak ditemukan" });

    const user = req.user;
    if (user.role !== "admin" && absensi.nim !== user.nim) {
      return res.status(403).json({ msg: "Akses ditolak: Anda hanya dapat mengedit absensi Anda sendiri" });
    }

    if (user.role !== "admin") {
      const waktuAbsen = new Date(absensi.waktu_absen);
      const waktuSekarang = new Date();
      const selisihMenit = (waktuSekarang - waktuAbsen) / (1000 * 60);
      if (selisihMenit > 30) {
        return res.status(403).json({ msg: "Akses ditolak: Batas waktu pengeditan 30 menit telah berlalu" });
      }
    }

    await Absensi.update(
      { nim, id_matakuliah, waktu_absen, status, keterangan },
      { where: { id_absen: req.params.id } }
    );
    res.json({ msg: "Absensi updated successfully" });
  } catch (error) {
    console.log(`Update gagal: ${error}`);
    res.status(500).json({ msg: "Update gagal" });
  }
};

export const deleteAbsensi = async (req, res) => {
  try {
    const absensi = await Absensi.findOne({
      where: { id_absen: req.params.id },
    });
    if (!absensi) return res.status(404).json({ msg: "Absensi tidak ditemukan" });

    const user = req.user;
    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Akses ditolak: Hanya admin yang dapat menghapus absensi" });
    }

    await Absensi.destroy({
      where: { id_absen: req.params.id },
    });
    res.json({ msg: "Absensi deleted successfully" });
  } catch (error) {
    console.log(`Delete gagal: ${error}`);
    res.status(500).json({ msg: "Delete gagal" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const { id_matakuliah } = req.query;
    console.log("=== Mulai getDashboardStats ===");
    console.log("User dari token:", req.user);
    console.log("Query id_matakuliah:", id_matakuliah);

    // 1. Jumlah total mahasiswa
    let totalMahasiswa = 0;
    try {
      console.log("Mengambil totalMahasiswa...");
      totalMahasiswa = await UsersMahasiswa.count();
      console.log("Total mahasiswa:", totalMahasiswa);
    } catch (error) {
      console.error("Gagal mengambil totalMahasiswa:", error.message);
      totalMahasiswa = 0; // Fallback jika tabel bermasalah
    }

    // 2. Jumlah mahasiswa yang sudah absen
    console.log("Mengambil mahasiswaAbsen...");
    const mahasiswaAbsen = await Absensi.count({
      distinct: true,
      col: "nim",
      ...(id_matakuliah && { where: { id_matakuliah } }),
    });
    console.log("Mahasiswa absen:", mahasiswaAbsen);

    // 3. Statistik absensi
    console.log("Mengambil absensiStats...");
    const absensiStats = await Absensi.findAll({
      attributes: [
        "status",
        [db.fn("COUNT", db.col("status")), "count"],
        [db.fn("MIN", db.col("waktu_absen")), "absen"],
      ],
      where: id_matakuliah ? { id_matakuliah } : {},
      group: ["status"],
      order: [[db.literal("absen"), "ASC"]],
      limit: 15,
    });
    console.log("Absensi stats raw:", JSON.stringify(absensiStats, null, 2));

    // Format statistik absen
    const stats = {
      Hadir: 0,
      TidakHadir: 0,
      Izin: 0,
      Sakit: 0,
    };
    absensiStats.forEach((item) => {
      const statusKey = item.status.trim().replace(/\s/g, "");
      console.log(`Memformat status: ${item.status} -> ${statusKey}, count: ${item.get("count")}`);
      stats[statusKey] = item.get("count");
    });
    console.log("Absensi stats terformat:", stats);

    console.log("Mengirimkan respons...");
    res.status(200).json({
      totalMahasiswa,
      mahasiswaAbsen,
      absensiStats: stats,
    });
  } catch (error) {
    console.error("=== Error di getDashboardStats ===");
    console.error("Pesan:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({
      msg: "Gagal mengambil data statistik",
      error: error.message,
    });
  }
};