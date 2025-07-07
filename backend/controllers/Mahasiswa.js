// absensi/backend/controllers/Mahasiswa.js

import Prodi from "../models/prodiModels.js";
import UsersMahasiswa from "../models/userMahasiswaModels.js";
import Absensi from "../models/absensiModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getMahasiswa = async (req, res) => {
  try {
    const users = await UsersMahasiswa.findAll({
      attributes: ["nim", "nama", "id_prodi", "semester"],
      include: [{ model: Prodi, attributes: ["nama_prodi"] }],
    });
    res.json(users);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const RegisterMahasiswa = async (req, res) => {
  const { nama, nim, password, confPassword, id_prodi, semester } = req.body;
  if (password !== confPassword)
    return res.status(400).json({ msg: "Password salah tuh!" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await UsersMahasiswa.create({
      nim,
      nama,
      password: hashPassword,
      id_prodi,
      semester,
    });
    res.json({ msg: "yeayyy pendaftaran berhasil" });
  } catch (error) {
    console.log(`Pendaftaran gagal: ${error}`);
    res.status(500).json({ msg: "NIM gaboleh sama njir!" });
  }
};

export const LoginMahasiswa = async (req, res) => {
  try {
    const user = await UsersMahasiswa.findOne({
      where: { nim: req.body.nim },
    });
    if (!user) return res.status(404).json({ msg: "NIM salah tuh!" });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "Password salah tuh!" });
    const { nim, nama, id_prodi, semester } = user;
    const accessToken = jwt.sign(
      { nim, nama, id_prodi, semester },
      process.env.JWT_SECRET,
      { expiresIn: "20s" }
    );
    const refreshToken = jwt.sign(
      { nim, nama, id_prodi, semester },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );
    await UsersMahasiswa.update(
      { refresh_token: refreshToken },
      { where: { nim } }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    console.log(`Login error: ${error}`);
    res.status(404).json({ msg: "yahhh Login gagal" });
  }
};

export const LogoutMahasiswa = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await UsersMahasiswa.findOne({
    where: { refresh_token: refreshToken },
  });
  if (!user) return res.sendStatus(204);
  await UsersMahasiswa.update(
    { refresh_token: null },
    { where: { nim: user.nim } }
  );
  res.clearCookie("refreshToken");
  res.json({ msg: "berhasil keluar (didalem)" });
};

export const updateMahasiswa = async (req, res) => {
  try {
    const { nama, id_prodi, semester } = req.body;
    const user = await UsersMahasiswa.findOne({
      where: { nim: req.params.nim },
    });
    if (!user) return res.status(404).json({ msg: "ga nemu mahasiwsa yang datanya jelek begitu" });
    await UsersMahasiswa.update(
      { nama, id_prodi, semester },
      { where: { nim: req.params.nim } }
    );
    res.json({ msg: "Data mahasiswa berhasil di update" });
  } catch (error) {
    console.log(`Update gagal: ${error}`);
    res.status(500).json({ msg: "yahhh update gagal" });
  }
};

export const deleteMahasiswa = async (req, res) => {
  try {
    const user = await UsersMahasiswa.findOne({
      where: { nim: req.params.nim },
    });
    if (!user) return res.status(404).json({ msg: "ga nemu mahasiswa yang datanya begitu" });

    // dibawah ini buat hapus data mahasiswa yang terkait absensi
    await Absensi.destroy({
      where: { nim: req.params.nim },
    });

    // ini buat hapus mahasiswa
    await UsersMahasiswa.destroy({
      where: { nim: req.params.nim },
    });
    res.json({ msg: "Data mahasiswa berhasil dihapus" });
  } catch (error) {
    console.log(`Delete gagal: ${error}`);
    res.status(500).json({ msg: "yahhh hapus gagal gagal" });
  }
};