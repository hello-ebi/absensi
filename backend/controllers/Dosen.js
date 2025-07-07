// absensi/backend/controllers/Dosen.js

import Dosen from "../models/dosenModels.js";

export const getDosen = async (req, res) => {
  try {
    const dosen = await Dosen.findAll({
      attributes: ["id_dosen", "nama_dosen", "email_dosen", "nomor_dosen"],
    });
    res.json(dosen);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const createDosen = async (req, res) => {
  const { nama_dosen, email_dosen, nomor_dosen } = req.body;
  try {
    await Dosen.create({
      nama_dosen,
      email_dosen,
      nomor_dosen,
    });
    res.json({ msg: "Dosen berhasil ditambahkan" });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ msg: "Gagal menambahkan dosen" });
  }
};

export const updateDosen = async (req, res) => {
  try {
    const { nama_dosen, email_dosen, nomor_dosen } = req.body;
    const dosen = await Dosen.findOne({
      where: { id_dosen: req.params.id },
    });
    if (!dosen) return res.status(404).json({ msg: "Dosen tidak ditemukan" });
    await Dosen.update(
      { nama_dosen, email_dosen, nomor_dosen },
      { where: { id_dosen: req.params.id } }
    );
    res.json({ msg: "Dosen updated successfully" });
  } catch (error) {
    console.log(`Update gagal: ${error}`);
    res.status(500).json({ msg: "Update gagal" });
  }
};

export const deleteDosen = async (req, res) => {
  try {
    const dosen = await Dosen.findOne({
      where: { id_dosen: req.params.id },
    });
    if (!dosen) return res.status(404).json({ msg: "Dosen tidak ditemukan" });
    await Dosen.destroy({
      where: { id_dosen: req.params.id },
    });
    res.json({ msg: "Dosen deleted successfully" });
  } catch (error) {
    console.log(`Delete gagal: ${error}`);
    res.status(500).json({ msg: "Delete gagal" });
  }
};