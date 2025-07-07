// absensi/backend/controllers/Tugas.js

import Tugas from "../models/tugasModels.js";
import Dosen from "../models/dosenModels.js";
import Matakuliah from "../models/matakuliahModels.js";
import upload from "../middleware/upload.js";

export const getTugas = async (req, res) => {
    try {
        const tugas = await Tugas.findAll({
            attributes: [
                "id_tugas",
                "judul_tugas",
                "deskripsi",
                "id_dosen",
                "id_matakuliah",
                "tanggal_diberikan",
                "deadline",
                "lampiran",
            ],
            include: [
                {
                    model: Dosen,
                    attributes: ["nama_dosen"],
                },
                {
                    model: Matakuliah,
                    attributes: ["nama_matakuliah"],
                },
            ],
        });
        res.json(tugas);
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const createTugas = async (req, res) => {
    const { judul_tugas, deskripsi, id_dosen, id_matakuliah, tanggal_diberikan, deadline, lampiran } = req.body;
    try {
        // ini validasi foreign key dosen dan matakuliah
        const dosen = await Dosen.findOne({ where: { id_dosen } });
        const matakuliah = await Matakuliah.findOne({ where: { id_matakuliah } });
        if (!dosen || !matakuliah) {
            return res.status(400).json({ msg: "Invalid id_dosen or id_matakuliah" });
        }

        await Tugas.create({
            judul_tugas,
            deskripsi,
            id_dosen,
            id_matakuliah,
            tanggal_diberikan,
            deadline,
            lampiran,
        });
        res.json({ msg: "Tugas berhasil ditambahkan" });
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).json({ msg: "Gagal menambahkan tugas" });
    }
};

export const updateTugas = async (req, res) => {
    try {
        const { judul_tugas, deskripsi, id_dosen, id_matakuliah, tanggal_diberikan, deadline, lampiran } = req.body;
        const tugas = await Tugas.findOne({
            where: { id_tugas: req.params.id },
        });
        if (!tugas) return res.status(404).json({ msg: "Tugas tidak ditemukan" });

        const dosen = await Dosen.findOne({ where: { id_dosen } });
        const matakuliah = await Matakuliah.findOne({ where: { id_matakuliah } });
        if (!dosen || !matakuliah) {
            return res.status(400).json({ msg: "Invalid id_dosen or id_matakuliah" });
        }

        await Tugas.update(
            { judul_tugas, deskripsi, id_dosen, id_matakuliah, tanggal_diberikan, deadline, lampiran },
            { where: { id_tugas: req.params.id } }
        );
        res.json({ msg: "Tugas updated successfully" });
    } catch (error) {
        console.log(`Update gagal: ${error}`);
        res.status(500).json({ msg: "Update gagal" });
    }
};

export const deleteTugas = async (req, res) => {
    try {
        const tugas = await Tugas.findOne({
            where: { id_tugas: req.params.id },
        });
        if (!tugas) return res.status(404).json({ msg: "Tugas tidak ditemukan" });
        await Tugas.destroy({
            where: { id_tugas: req.params.id },
        });
        res.json({ msg: "Tugas deleted successfully" });
    } catch (error) {
        console.log(`Delete gagal: ${error}`);
        res.status(500).json({ msg: "Delete gagal" });
    }
};