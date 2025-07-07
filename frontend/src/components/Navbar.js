// absensi/frontend/src/components/Navbar.js

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import logostmikpamitran from "../images/logostmikpamitran.png";
import NotifikasiMahasiswa from "../components/notifikasiMahasiswa.js";
import AbsensiManagement from "../components/manajemenAbsensi.js";


const Navbar = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [isNotificationModalActive, setIsNotificationModalActive] = useState(false);
  const [isAbsensiModalActive, setIsAbsensiModalActive] = useState(false);
  const [isLogoutModalActive, setIsLogoutModalActive] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const checkToken = async () => {
      console.log("Memeriksa token di Navbar... URL:", location.pathname);
      let token = localStorage.getItem("accessToken");
      if (!token) {
        console.warn("Tidak ada accessToken, mencoba refresh...");
        try {
          const response = await axios.get("http://localhost:5000/token", {
            withCredentials: true,
          });
          token = response.data.accessToken;
          localStorage.setItem("accessToken", token);
          console.log("Token baru disimpan:", token);
        } catch (error) {
          console.error("Gagal refresh token:", error.message);
          navigate("/login-mahasiswa");
          return;
        }
      }
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token di Navbar:", JSON.stringify(decoded, null, 2));
        setRole(decoded.id_admin ? "admin" : "mahasiswa");
        setUsername(decoded.username || decoded.nama);
      } catch (error) {
        console.error("Invalid token di Navbar:", error.message);
        navigate("/login-mahasiswa");
      }
    };
    checkToken();
  }, [navigate, location.pathname]);

  const Logout = async () => {
    try {
      await axios.delete(`http://localhost:5000/logout-${role}`, {
        withCredentials: true,
      });
      localStorage.removeItem("accessToken");
      navigate(role === "admin" ? "/login-admin" : "/login-mahasiswa");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const openNotificationModal = () => {
    setIsNotificationModalActive(true);
    console.log("Membuka modal notifikasi, unread count:", unreadCount);
  };
  const closeNotificationModal = () => setIsNotificationModalActive(false);

  const openAbsensiModal = () => setIsAbsensiModalActive(true);
  const closeAbsensiModal = () => setIsAbsensiModalActive(false);

  const openLogoutModal = () => setIsLogoutModalActive(true);
  const closeLogoutModal = () => setIsLogoutModalActive(false);

  const confirmLogout = () => {
    Logout();
    closeLogoutModal();
  };

  return (
    <>
      <nav className={`navbar ${className}`} role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/dashboard">
            <img src={logostmikpamitran} alt="logopamitran" />
            <h1>
              <span className="warnalogosatu is-size-4">PAMITRAN Stud</span>
              <span className="warnalogodua is-size-4 has-text-weight-semibold">Ease</span>
            </h1>
          </Link>

          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <Link className="navbar-item" to="/dashboard">
              Beranda
            </Link>

            {role === "admin" && (
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">Lihat Menu Lain</a>
                <div className="navbar-dropdown">
                  <Link className="navbar-item" to="/jadwal-matakuliah">
                    Atur Jadwal Matakuliah
                  </Link>
                  <Link className="navbar-item" to="/dosen-management">
                    Atur Data Dosen
                  </Link>
                  <Link className="navbar-item" to="/tugas-management">
                    Pantau Tugas
                  </Link>
                  <Link className="navbar-item" to="/prodi-management">
                    Atur Prodi
                  </Link>
                  <hr className="navbar-divider" />
                  <a className="navbar-item is-success">Bingung, apalagi ya bejirr?</a>
                </div>
              </div>
            )}

            {role === "mahasiswa" && location.pathname === "/dashboard" && (
              <>
                <div className="navbar-item" style={{ position: "relative" }}>
                  <a className="navbar-item" onClick={openNotificationModal}>
                    Pemberitahuan
                  </a>
                  {unreadCount > 0 && (
                    <span
                      className="badge is-danger"
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-10px",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#ff3860",
                      }}
                    ></span>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <button
                  onClick={openLogoutModal}
                  className="button is-light is-rounded logout-button"
                >
                  <span>
                    <i className="fa-solid fa-power-off"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className={`modal ${isNotificationModalActive ? "is-active" : ""}`}>
        <div className="modal-background" onClick={closeNotificationModal}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Notifikasi</p>
            <button className="delete" aria-label="close" onClick={closeNotificationModal}></button>
          </header>
          <section className="modal-card-body">
            <NotifikasiMahasiswa onUnreadCountUpdate={setUnreadCount} />
          </section>
          <footer className="modal-card-foot">
            <button className="button" onClick={closeNotificationModal}>
              Tutup
            </button>
          </footer>
        </div>
      </div>

      <div className={`modal ${isAbsensiModalActive ? "is-active" : ""}`}>
        <div className="modal-background" onClick={closeAbsensiModal}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Manajemen Absensi</p>
            <button className="delete" aria-label="close" onClick={closeAbsensiModal}></button>
          </header>
          <section className="modal-card-body">
            <AbsensiManagement />
          </section>
          <footer className="modal-card-foot">
            <button className="button" onClick={closeAbsensiModal}>
              Tutup
            </button>
          </footer>
        </div>
      </div>

      <div className={`modal ${isLogoutModalActive ? "is-active" : ""}`}>
        <div className="modal-background" onClick={closeLogoutModal}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Mau keluar?</p>
            <button className="delete" aria-label="close" onClick={closeLogoutModal}></button>
          </header>
          <section className="modal-card-body">
            <p>Yakin mau keluar?</p>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-danger" onClick={confirmLogout}>
              Iya njing
            </button>
            <button className="button" onClick={closeLogoutModal}>
              Batal
            </button>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Navbar;