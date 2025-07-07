// frontend/src/components/Sidebar.js

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../styles/sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login-mahasiswa");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setRole(decoded.id_admin ? "admin" : "mahasiswa");
      setUsername(decoded.username || decoded.nama);
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/login-mahasiswa");
    }
  }, [navigate]);

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

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  const adminMenuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "fas fa-tachometer-alt" },
    { name: "Kelola Mahasiswa", path: "/users-management", icon: "fas fa-users" },
    { name: "Kelola Dosen", path: "/dosen-management", icon: "fas fa-chalkboard-teacher" },
    { name: "Kelola Mata Kuliah", path: "/matakuliah-management", icon: "fas fa-book" },
    { name: "Kelola Prodi", path: "/prodi-management", icon: "fas fa-graduation-cap" },
    { name: "Kelola Tugas", path: "/tugas-management", icon: "fas fa-tasks" },
    { name: "Kelola Absensi", path: "/absensi-management", icon: "fas fa-check-square" },
    { name: "Kelola Notifikasi", path: "/notifikasi-management", icon: "fas fa-bell" },
    { name: "Jadwal Pelajaran", path: "/jadwal-matakuliah", icon: "fas fa-calendar-alt" },
  ];

  const mahasiswaMenuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "fas fa-tachometer-alt" },
    { name: "Lihat Tugas", path: "/tugas-management", icon: "fas fa-tasks" },
    { name: "Cek Absensi", path: "/absensi-management", icon: "fas fa-check-square" },
    { name: "Lihat Notifikasi", path: "/notifikasi-mahasiswa", icon: "fas fa-bell" },
    { name: "Jadwal Pelajaran", path: "/jadwal-matakuliah", icon: "fas fa-calendar-alt" },
  ];

  const menuItems = role === "admin" ? adminMenuItems : mahasiswaMenuItems;

  return (
    <div className={`sidebar ${isActive ? "is-active" : ""}`}>
      <div className="sidebar-brand">
        <div className="navbar-item">
          <img src="https://bulma.io/images/bulma-logo.png" alt="logo" width="112" height="28" />
        </div>
        <div className="sidebar-user">
          <span className="icon"><i className="fas fa-user-circle"></i></span>
          <span>{username}</span>
        </div>
      </div>

      <button className="sidebar-burger button is-light" onClick={toggleMenu}>
        <span className="icon">
          <i className="fas fa-bars"></i>
        </span>
      </button>

      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.path}
            className={`sidebar-item ${location.pathname === item.path ? "is-active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(item.path); // Navigasi ke rute yang diklik
              setIsActive(false); // Tutup sidebar di mobile
            }}
          >
            <span className="icon">
              <i className={item.icon}></i>
            </span>
            <span>{item.name}</span>
          </a>
        ))}
        <a className="sidebar-item" onClick={Logout}>
          <span className="icon">
            <i className="fas fa-sign-out-alt"></i>
          </span>
          <span>Keluar</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;