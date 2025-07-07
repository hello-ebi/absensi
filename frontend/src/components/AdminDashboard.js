// absensi/frontend/src/components/AdminDashboard.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.js";
import Navbar from "../components/Navbar.js";
import Sidebar from "./sidebar.js";
import "../styles/adminDashboard.css"

const AdminDashboard = () => {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [stats, setStats] = useState({
    totalMahasiswa: 0,
    mahasiswaAbsen: 0,
    absensiStats: { Hadir: 0, TidakHadir: 0, Izin: 0, Sakit: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMatakuliah, setSelectedMatakuliah] = useState(""); // Untuk filter mata kuliah
  const [matakuliahList, setMatakuliahList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    fetchMatakuliah();
    fetchDashboardStats();
  }, [selectedMatakuliah]);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token", {
        withCredentials: true,
      });
      const newToken = response.data.accessToken;
      setToken(newToken);
      const decoded = jwtDecode(newToken);
      setUsername(decoded.username);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/login");
      }
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
        const decoded = jwtDecode(response.data.accessToken);
        setUsername(decoded.username);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const fetchMatakuliah = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:5000/matakuliah", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setMatakuliahList(response.data);
    } catch (error) {
      console.error("Error fetching matakuliah:", error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      console.log("=== Memulai fetchDashboardStats ===");
      console.log("Token:", token);
      console.log("URL:", `http://localhost:5000/dashboard-stats${selectedMatakuliah ? `?id_matakuliah=${selectedMatakuliah}` : ""}`);
      const response = await axiosJWT.get(
        `http://localhost:5000/dashboard-stats${selectedMatakuliah ? `?id_matakuliah=${selectedMatakuliah}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("Respons dashboard-stats:", response.data);
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("=== Error di fetchDashboardStats ===");
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      console.error("Message:", error.message);
      setError(error.response?.data?.msg || "Gagal mengambil data statistik");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.delete("http://localhost:5000/logout-admin", {
        withCredentials: true,
      });
      localStorage.removeItem("token");
      setToken("");
      setUsername("");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours();

      const secondDeg = seconds * 6;
      const minuteDeg = minutes * 6 + seconds * 0.1;
      const hourDeg = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

      if (hourRef.current) hourRef.current.style.transform = `rotate(${hourDeg}deg)`;
      if (minuteRef.current) minuteRef.current.style.transform = `rotate(${minuteDeg}deg)`;
      if (secondRef.current) secondRef.current.style.transform = `rotate(${secondDeg}deg)`;
    }, 1000);

    return () => clearInterval(interval);
  }, []);



  return (
    <div className="is-fullheight" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar className="navbar is-sticky" />
      <section className="hero is-flex-grow-1">
        <div className="container mt-5">
          <h1 className="title">
            Dashboard /
            <i className="fa-solid fa-circle-user mr-1 ml-1"></i>
            {username}
          </h1>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="has-text-danger">{error}</p>
          ) : (
            <div className="columns">

              <div className="column is-two-thirds">
                <div className="columns is-multiline">
                  <div className="column is-6">
                    <div className="card">
                      <div className="card-content has-text-centered">
                        <p className="title is-5">Total Mahasiswa</p>
                        <p className="subtitle is-3">{stats.totalMahasiswa}</p>
                      </div>
                    </div>
                  </div>
                  <div className="column is-6">
                    <div className="card">
                      <div className="card-content has-text-centered">
                        <p className="title is-5">Mahasiswa Hadir</p>
                        <p className="subtitle is-3">{stats.mahasiswaAbsen}</p>
                      </div>
                    </div>
                  </div>

                  <div className="column is-6">
                    <div className="card">
                      <div className="card-content">
                        <p className="title is-5">Mahasiswa</p>
                        <p>Atur data mahasiswa.</p>
                        <a className="button is-dark mt-4" href="/users-management">
                          Buka
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="column is-6">
                    <div className="card">
                      <div className="card-content">
                        <p className="title is-5">Absensi</p>
                        <p>Pantau kehadiran mahasiswa.</p>
                        <a className="button is-dark mt-4" href="/absensi-management">
                          Buka
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="column is-12">
                    <div className="card">
                      <div className="card-content">
                        <p className="title is-5">Buat Notifikasi</p>
                        <p>Buat dan kelola notifikasi untuk mahasiswa.</p>
                        <a className="button is-dark mt-4" href="/notifikasi-management">
                          Buka
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="column is-one-third">
                <div className="card">
                  <div className="card-content">
                    <div className="field">
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            value={selectedMatakuliah}
                            onChange={(e) => setSelectedMatakuliah(e.target.value)}
                          >
                            <option value="">Semua Mata Kuliah</option>
                            {matakuliahList.map((matakuliah) => (
                              <option key={matakuliah.id_matakuliah} value={matakuliah.id_matakuliah}>
                                {matakuliah.nama_matakuliah}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <p className="title is-5">Statistik Absensi</p>
                    <p>Hadir: {stats.absensiStats.Hadir}</p>
                    <p>Tidak Hadir: {stats.absensiStats.TidakHadir}</p>
                    <p>Izin: {stats.absensiStats.Izin}</p>
                    <p>Sakit: {stats.absensiStats.Sakit}</p>
                  </div>
                </div>

                <div className="card mt-4">
                  <div className="card-content has-text-centered">
                    <div className="clock" style={{ margin: "0 auto" }}>
                      <div className="hand hour" ref={hourRef}></div>
                      <div className="hand minute" ref={minuteRef}></div>
                      <div className="hand second" ref={secondRef}></div>
                      <div className="center-point"></div>
                    </div>
                    <p className="subtitle is-3">{formattedDate}</p>
                  </div>
                </div>
              </div>
            </div>

          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AdminDashboard;