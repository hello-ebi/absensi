// components/src/Dashboard.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AdminDashboard from "./AdminDashboard";
import MahasiswaDashboard from "./MahasiswaDashboard";

const Dashboard = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login-mahasiswa");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setRole(decoded.id_admin ? "admin" : "mahasiswa");
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/login-mahasiswa");
    }
  }, [navigate]);

  if (!role) return null; // Hindari render sebelum role ditentukan

  return (
    <div>
      {role === "admin" ? <AdminDashboard /> : <MahasiswaDashboard />}
    </div>
  );
};

export default Dashboard;