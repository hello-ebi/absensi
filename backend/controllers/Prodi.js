// absensi/backend/controllers/Prodi.js

import Prodi from "../models/prodiModels.js";

export const getProdi = async (req, res) => {
  try {
    const prodi = await Prodi.findAll({
      attributes: ["id_prodi", "nama_prodi"],
    });
    res.json(prodi);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const createProdi = async (req, res) => {
  const { nama_prodi } = req.body;
  try {
    await Prodi.create({
      nama_prodi,
    });
    res.json({ msg: "Prodi berhasil ditambahkan" });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ msg: "Gagal menambahkan prodi" });
  }
};

export const updateProdi = async (req, res) => {
  try {
    const { nama_prodi } = req.body;
    const prodi = await Prodi.findOne({
      where: { id_prodi: req.params.id },
    });
    if (!prodi) return res.status(404).json({ msg: "Prodi tidak ditemukan" });
    await Prodi.update(
      { nama_prodi },
      { where: { id_prodi: req.params.id } }
    );
    res.json({ msg: "Prodi updated successfully" });
  } catch (error) {
    console.log(`Update gagal: ${error}`);
    res.status(500).json({ msg: "Update gagal" });
  }
};

export const deleteProdi = async (req, res) => {
  try {
    const prodi = await Prodi.findOne({
      where: { id_prodi: req.params.id },
    });
    if (!prodi) return res.status(404).json({ msg: "Prodi tidak ditemukan" });
    await Prodi.destroy({
      where: { id_prodi: req.params.id },
    });
    res.json({ msg: "Prodi deleted successfully" });
  } catch (error) {
    console.log(`Delete gagal: ${error}`);
    res.status(500).json({ msg: "Delete gagal" });
  }
};