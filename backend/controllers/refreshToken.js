// absensi/backend/controllers/refreshToken.js

import UsersMahasiswa from "../models/userMahasiswaModels.js";
import UsersAdmin from "../models/usersAdmin.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
            console.log("Refresh token tidak ditemukan di cookie");
      return res.status(401).json({ msg: "Refresh token tidak ditemukan" });
    }

    // Verifikasi refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      console.log("Decoded refresh token:",  JSON.stringify(decoded, null, 2)); // Log decoded token
    } catch (error) {
      console.error("Invalid refresh token:", error.message);
      return res.status(403).json({ msg: "Refresh token tidak valid atau kadaluarsa" });
    }

    // Cari pengguna (admin atau mahasiswa) berdasarkan refresh token
    let user = await UsersAdmin.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!user) {
      user = await UsersMahasiswa.findOne({
        where: { refresh_token: refreshToken },
      });
    }

    // Periksa apakah user ditemukan
    if (!user) {
      console.log("No user found with refresh token:", refreshToken); // Log untuk debugging
      return res.status(403).json({ msg: "Refresh token tidak valid, pengguna tidak ditemukan" });
    }

    // Buat payload berdasarkan tipe pengguna
    const payload = user.id_admin
      ? {
        id_admin: user.id_admin,
        username: user.username,
        email: user.email,
        role: "admin", // Tambahkan role untuk konsistensi
      }
      : {
        nim: user.nim,
        nama: user.nama,
        id_prodi: user.id_prodi,
        semester: user.semester,
        role: "mahasiswa",
      };
    console.log("Payload access token:", JSON.stringify(payload, null, 2));
    // Buat access token baru
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m", // Perpanjang untuk debugging, bisa dikembalikan ke 20s nanti
    });
    res.json({ accessToken });
  } catch (error) {
    console.error("Error in refreshToken:", error.message);
    res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
  }
};