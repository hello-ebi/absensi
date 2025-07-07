// backend/routes/index.js

import express from "express";
import {
  getMahasiswa,
  RegisterMahasiswa,
  LoginMahasiswa,
  LogoutMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "../controllers/Mahasiswa.js";
import {
  getAdmins,
  RegisterAdmin,
  LoginAdmin,
  LogoutAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controllers/admin.js";
import {
  getDosen,
  createDosen,
  updateDosen,
  deleteDosen,
} from "../controllers/Dosen.js";
import {
  getAbsensi,
  createAbsensi,
  updateAbsensi,
  deleteAbsensi,
  getDashboardStats,
} from "../controllers/Absensi.js";
import {
  createProdi,
  getProdi,
  updateProdi,
  deleteProdi,
} from "../controllers/Prodi.js";
import {
  createNotifikasi,
  getNotifikasiByUser,
  updateNotifikasi,
  deleteNotifikasi,
  markAsRead,
} from "../controllers/notifikasi.js";
import {
  createMatakuliah,
  getMatakuliah,
  updateMatakuliah,
  deleteMatakuliah,
} from "../controllers/Matakuliah.js";
import {
  getTugas,
  createTugas,
  updateTugas,
  deleteTugas,
} from "../controllers/Tugas.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/refreshToken.js";

const router = express.Router();

// ini rute mahasiswa
router.get("/mahasiswa", verifyToken, getMahasiswa);
router.post("/mahasiswa", RegisterMahasiswa);
router.put("/mahasiswa/:nim", verifyToken, updateMahasiswa);
router.delete("/mahasiswa/:nim", verifyToken, deleteMahasiswa);
router.post("/login-mahasiswa", LoginMahasiswa);
router.delete("/logout-mahasiswa", LogoutMahasiswa);

// ini rute admin
router.get("/admins", verifyToken, getAdmins);
router.post("/admins", RegisterAdmin);
router.put("/admins/:id", verifyToken, updateAdmin);
router.delete("/admins/:id", verifyToken, deleteAdmin);
router.post("/login-admin", LoginAdmin);
router.delete("/logout-admin", LogoutAdmin);

// ini rute absensi
router.get("/absensi", verifyToken, getAbsensi);
router.post("/absensi", verifyToken, createAbsensi);
router.put("/absensi/:id", verifyToken, updateAbsensi);
router.delete("/absensi/:id", verifyToken, deleteAbsensi);

// ini rute dosen
router.get("/dosen", verifyToken, getDosen);
router.post("/dosen", verifyToken, createDosen);
router.put("/dosen/:id", verifyToken, updateDosen);
router.delete("/dosen/:id", verifyToken, deleteDosen);

// ini rute prodi
router.post("/prodi", createProdi);
router.get("/prodi", getProdi);
router.put("/prodi/:id", verifyToken, updateProdi);
router.delete("/prodi/:id", verifyToken, deleteProdi);

// ini rute notifikasi
router.post("/notifikasi", verifyToken, createNotifikasi);
router.get("/notifikasi", verifyToken, getNotifikasiByUser);
router.put("/notifikasi/:id", verifyToken, updateNotifikasi);
router.put("/notifikasi/mark/:id_notifikasi", verifyToken, markAsRead);
router.delete("/notifikasi/:id", verifyToken, deleteNotifikasi);

// ini rute matakuliah
router.get("/matakuliah", verifyToken, getMatakuliah);
router.post("/matakuliah", verifyToken, createMatakuliah);
router.put("/matakuliah/:id", verifyToken, updateMatakuliah);
router.delete("/matakuliah/:id", verifyToken, deleteMatakuliah);

router.get("/tugas", verifyToken, getTugas);
router.post("/tugas", verifyToken, createTugas);
router.put("/tugas/:id", verifyToken, updateTugas);
router.delete("/tugas/:id", verifyToken, deleteTugas);

// ini rute buat ngambil statistik
router.get("/dashboard-stats", verifyToken, getDashboardStats);

// ini rute buat ngambil jwt token
router.get("/token", refreshToken);

export default router;