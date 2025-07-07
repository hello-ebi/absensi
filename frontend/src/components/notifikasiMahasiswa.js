// absensi/src/components/notifikasiMahasiswa.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const NotifikasiMahasiswa = ({ onUnreadCountUpdate }) => {
  const [notifikasi, setNotifikasi] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [msg, setMsg] = useState("");
  const [selectedNotifikasi, setSelectedNotifikasi] = useState(null);

  useEffect(() => {
    refreshToken();
    getNotifikasi();
  }, []);

  const refreshToken = async () => {
    try {
      console.log("Memulai refresh token di NotifikasiMahasiswa...");
      const response = await axios.get("http://localhost:5000/token", {
        withCredentials: true,
      });
      const accessToken = response.data.accessToken;
      setToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
      const decoded = jwtDecode(accessToken);
      console.log("Isi Token di Notifikasi:", JSON.stringify(decoded, null, 2));
      setExpire(decoded.exp);
    } catch (error) {
      console.error("Error refreshing token:", error.message);
      setMsg("Sesi tidak valid. Silakan login ulang.");
    }
  };

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        console.log("Token kadaluarsa, merefresh token...");
        const response = await axios.get("http://localhost:5000/token", {
          withCredentials: true,
        });
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        localStorage.setItem("accessToken", response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const getNotifikasi = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:5000/notifikasi", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Data Notifikasi:", response.data);
      setNotifikasi(response.data);
      const unreadCount = response.data.filter((item) => item.status === "belum_dibaca").length;
      onUnreadCountUpdate(unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
      setMsg("Gagal memuat notifikasi");
    }
  };

  const markAsRead = async (id) => {
    try {
      await axiosJWT.put(
        `http://localhost:5000/notifikasi/mark/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`Notifikasi ${id} ditandai sebagai dibaca`);
      getNotifikasi();
    } catch (error) {
      console.error("Error marking notification as read:", error.message);
      setMsg("Gagal menandai notifikasi sebagai dibaca");
    }
  };

  const handleNotifikasiClick = (notif) => {
    setSelectedNotifikasi(notif);
    if (notif.status === "belum_dibaca") {
      markAsRead(notif.id_notifikasi);
    }
  };

  return (
    <div className="container">
      {msg && <p className="notification is-danger">{msg}</p>}
      <div className="box">
        <h2 className="subtitle">Pemberitahuan</h2>
        <div className="content">
          <ul>
            {notifikasi.map((item) => (
              <li key={item.id_notifikasi} style={{ marginBottom: "10px" }}>
                <a
                  onClick={() => handleNotifikasiClick(item)}
                  style={{
                    fontWeight: item.status === "belum_dibaca" ? "bold" : "normal",
                    color: item.status === "belum_dibaca" ? "#ff3860" : "inherit",
                    cursor: "pointer",
                  }}
                >
                  {item.judul}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {selectedNotifikasi && (
          <div className="box mt-4">
            <h3 className="title is-5">{selectedNotifikasi.judul}</h3>
            <p>{selectedNotifikasi.pesan}</p>
            <p className="is-size-7 has-text-grey">
              Dibuat pada: {new Date(selectedNotifikasi.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotifikasiMahasiswa;