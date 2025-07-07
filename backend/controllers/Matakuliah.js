// absensi/backend/controllers/Matakuliah.js

import Matakuliah from "../models/matakuliahModels.js";
import Dosen from "../models/dosenModels.js";
import Prodi from "../models/prodiModels.js";

const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.id_admin) {
    return res.status(403).json({ msg: "Akses ditolak: Hanya admin yang diizinkan" });
  }
  next();
};

export const getMatakuliah = async (req, res) => {
  try {
    const matakuliah = await Matakuliah.findAll({
      attributes: [
        "id_matakuliah",
        "nama_matakuliah",
        "hari",
        "jam_mulai",
        "jam_selesai",
        "id_dosen",
        "id_prodi",
        "semester",
      ],
      include: [
        { model: Dosen, as: "Dosen", attributes: ["nama_dosen"] },
        { model: Prodi, as: "Prodi", attributes: ["nama_prodi"] },
      ],
    });
    res.json(matakuliah);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getDosen = async (req, res) => {
  try {
    const dosen = await Dosen.findAll({
      attributes: ["id_dosen", "nama_dosen"],
    });
    res.json(dosen);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const createMatakuliah = async (req, res) => {
  isAdmin(req, res, async () => {
    const { nama_matakuliah, id_dosen, id_prodi, semester, hari, jam_mulai, jam_selesai } = req.body;
    try {
      const dosen = await Dosen.findOne({ where: { id_dosen } });
      if (!dosen) return res.status(404).json({ msg: "Dosen tidak ditemukan" });
      const prodi = await Prodi.findOne({ where: { id_prodi } });
      if (!prodi) return res.status(404).json({ msg: "Prodi tidak ditemukan" });

      await Matakuliah.create({
        nama_matakuliah,
        id_dosen,
        id_prodi,
        semester,
        hari,
        jam_mulai,
        jam_selesai,
      });
      res.json({ msg: "Matakuliah berhasil ditambahkan" });
    } catch (error) {
      console.log(`Error: ${error}`);
      res.status(500).json({ msg: "Gagal menambahkan matakuliah" });
    }
  });
};

export const updateMatakuliah = async (req, res) => {
  isAdmin(req, res, async () => {
    try {
      const { nama_matakuliah, id_dosen, id_prodi, semester, hari, jam_mulai, jam_selesai } = req.body;
      const matakuliah = await Matakuliah.findOne({
        where: { id_matakuliah: req.params.id },
      });
      if (!matakuliah) return res.status(404).json({ msg: "Matakuliah tidak ditemukan" });

      const dosen = await Dosen.findOne({ where: { id_dosen } });
      if (!dosen) return res.status(404).json({ msg: "Dosen tidak ditemukan" });
      const prodi = await Prodi.findOne({ where: { id_prodi } });
      if (!prodi) return res.status(404).json({ msg: "Prodi tidak ditemukan" });

      await Matakuliah.update(
        { nama_matakuliah, id_dosen, id_prodi, semester, hari, jam_mulai, jam_selesai },
        { where: { id_matakuliah: req.params.id } }
      );
      res.json({ msg: "Matakuliah updated successfully" });
    } catch (error) {
      console.log(`Update gagal: ${error}`);
      res.status(500).json({ msg: "Update gagal" });
    }
  });
};

export const deleteMatakuliah = async (req, res) => {
  isAdmin(req, res, async () => {
    try {
      const matakuliah = await Matakuliah.findOne({
        where: { id_matakuliah: req.params.id },
      });
      if (!matakuliah) return res.status(404).json({ msg: "Matakuliah tidak ditemukan" });
      await Matakuliah.destroy({
        where: { id_matakuliah: req.params.id },
      });
      res.json({ msg: "Matakuliah deleted successfully" });
    } catch (error) {
      console.log(`Delete gagal: ${error}`);
      res.status(500).json({ msg: "Delete gagal" });
    }
  });
};