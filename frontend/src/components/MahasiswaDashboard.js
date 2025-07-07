// frontend/src/components/MahasiswaDasboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

const MahasiswaDashboard = () => {
  const [nama, setNama] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getUsers();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token", {
        withCredentials: true,
      });
      const accessToken = response.data.accessToken;
      setToken(accessToken);
      localStorage.setItem("accessToken", accessToken); // Simpan ke localStorage
      const decoded = jwtDecode(accessToken);
      console.log("Isi Token di Dashboard:", JSON.stringify(decoded, null, 2));
      setNama(decoded.nama);
      setExpire(decoded.exp);
      if (!decoded.nim && decoded.role !== "admin") {
        console.warn("NIM tidak ditemukan di token dashboard! Redirecting to login.");
        navigate("/login-mahasiswa");
      }
    } catch (error) {
      console.error("Error refreshing token di Dashboard:", error.message);
      navigate("/login-mahasiswa");
    }
  };

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:5000/token", {
          withCredentials: true,
        });
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        localStorage.setItem("accessToken", response.data.accessToken); // Update localStorage
        const decoded = jwtDecode(response.data.accessToken);
        setNama(decoded.nama);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const getUsers = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:5000/mahasiswa", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  return (
    <div className="is-fullheight" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "hidden" }}>
      <Navbar />
      <div className="container mt-5">
        <h1 className="title">Selamat datang yang mulia {nama}!</h1>
        <div className="columns is-multiline mt-5">
          <div className="column is-4">
            <div className="card">
              <div className="card-content">
                <p className="title is-5">Cek Absensi</p>
                <p>Lihat riwayat kehadiran Anda.</p>
                <Link to="/absensi-management" className="button is-dark mt-4">
                  Buka
                </Link>
              </div>
            </div>
          </div>
          <div className="column is-4">
            <div className="card">
              <div className="card-content">
                <p className="title is-5">Jadwal Matakuliah</p>
                <p>Lihat Jadwal Matakuliah Anda.</p>
                <Link className="button is-dark mt-4" to="/jadwal-matakuliah">
                  Buka
                </Link>
              </div>
            </div>
          </div>
          <div className="column is-4">
            <div className="card">
              <div className="card-content">
                <p className="title is-5">Lihat Tugas</p>
                <p>Cek tugas yang diberikan oleh dosen.</p>
                <Link to="/tugas-management" className="button is-danger mt-4">
                  Segera
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default MahasiswaDashboard;