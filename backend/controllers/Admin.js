// absensi/backend/controllers/Admin.js

import UsersAdmin from "../models/usersAdmin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getAdmins = async (req, res) => {
  try {
    const admins = await UsersAdmin.findAll({
      attributes: ["id_admin", "username", "email"],
    });
    res.json(admins);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const RegisterAdmin = async (req, res) => {
  const { username, email, password, confPassword } = req.body;
  if (password !== confPassword)
    return res.status(400).json({ msg: "Password tidak cocok!" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await UsersAdmin.create({
      username,
      email,
      password: hashPassword,
    });
    res.json({ msg: "Pendaftaran admin berhasil" });
  } catch (error) {
    console.log(`Pendaftaran gagal: ${error}`);
    res.status(500).json({ msg: "Pendaftaran gagal" });
  }
};

export const LoginAdmin = async (req, res) => {
  try {
    const admin = await UsersAdmin.findOne({
      where: { username: req.body.username },
    });
    if (!admin) return res.status(404).json({ msg: "Username tidak ditemukan" });
    const match = await bcrypt.compare(req.body.password, admin.password);
    if (!match) return res.status(400).json({ msg: "Password salah. Pastikan password sesuai atau akun dibuat melalui endpoint pendaftaran" });
    const { id_admin, username, email } = admin;
    const accessToken = jwt.sign(
      { id_admin, username, email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "20s" }
    );
    const refreshToken = jwt.sign(
      { id_admin, username, email, role: "admin" },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );
    await UsersAdmin.update(
      { refresh_token: refreshToken },
      { where: { id_admin } }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    console.log(`Login error: ${error}`);
    res.status(404).json({ msg: "Login gagal" });
  }
};

export const LogoutAdmin = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const admin = await UsersAdmin.findOne({
    where: { refresh_token: refreshToken },
  });
  if (!admin) return res.sendStatus(204);
  await UsersAdmin.update(
    { refresh_token: null },
    { where: { id_admin: admin.id_admin } }
  );
  res.clearCookie("refreshToken");
  res.json({ msg: "Logout berhasil" });
};

export const updateAdmin = async (req, res) => {
  try {
    const { username, email } = req.body;
    const admin = await UsersAdmin.findOne({
      where: { id_admin: req.params.id },
    });
    if (!admin) return res.status(404).json({ msg: "Admin tidak ditemukan" });
    await UsersAdmin.update(
      { username, email },
      { where: { id_admin: req.params.id } }
    );
    res.json({ msg: "Admin updated successfully" });
  } catch (error) {
    console.log(`Update gagal: ${error}`);
    res.status(500).json({ msg: "Update gagal" });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await UsersAdmin.findOne({
      where: { id_admin: req.params.id },
    });
    if (!admin) return res.status(404).json({ msg: "Admin tidak ditemukan" });
    await UsersAdmin.destroy({
      where: { id_admin: req.params.id },
    });
    res.json({ msg: "Admin deleted successfully" });
  } catch (error) {
    console.log(`Delete gagal: ${error}`);
    res.status(500).json({ msg: "Delete gagal" });
  }
};