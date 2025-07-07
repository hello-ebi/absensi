import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import MahasiswaLogin from "./components/MahasiswaLogin";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import UserManagement from "./components/manajemenMahasiswa";
import AbsensiManagement from "./components/manajemenAbsensi";
import TugasManagement from "./components/manajemenTugas";
import NotifikasiManagement from "./components/manajemenNotifikasi";
import DosenManagement from "./components/manajemenDosen";
import NotifikasiMahasiswa from "./components/notifikasiMahasiswa";
import MatakuliahManagement from "./components/manajemenMatakuliah";
import JadwalMatakuliah from "./components/JadwalMatakuliah.js";
import ProdiManagement from "./components/manajemenProdi";
import LandingPage from "./components/landingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LogoEffect from "./components/logoEffect.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login-admin" element={<AdminLogin />} />
        <Route path="/login-mahasiswa" element={<MahasiswaLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jadwal-matakuliah" element={<JadwalMatakuliah />} />
        <Route
          path="/dashboard"
          element={
            <div>
              <Dashboard />
            </div>
          }
        />
        <Route
          path="/users-management"
          element={
            <div>
              <Navbar />
              <UserManagement />
            </div>
          }
        />
        <Route
          path="/matakuliah-management"
          element={
            <div>
              <Navbar />
              <MatakuliahManagement />
            </div>
          }
        />
        <Route
          path="/prodi-management"
          element={
            <div>
              <Navbar />
              <ProdiManagement />
            </div>
          }
        />
        <Route
          path="/absensi-management"
          element={
            <div>
              <Navbar />
              <AbsensiManagement />
            </div>
          }
        />
        <Route
          path="/tugas-management"
          element={
            <div>
              <Navbar />
              <TugasManagement />
            </div>
          }
        />
        <Route
          path="/dosen-management"
          element={
            <div>
              <Navbar />
              <DosenManagement />
            </div>
          }
        />
        <Route
          path="/notifikasi-management"
          element={
            <div>
              <Navbar />
              <NotifikasiManagement />
            </div>
          }
        />
        <Route
          path="/notifikasi-mahasiswa"
          element={
            <div>
              <Navbar />
              <NotifikasiMahasiswa />
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;