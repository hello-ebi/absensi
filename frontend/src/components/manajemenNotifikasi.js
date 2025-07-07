// absensi/frontend/components/manajemenNotifikasi.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const NotifikasiManagement = () => {
  const [notifikasi, setNotifikasi] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [editNotifikasi, setEditNotifikasi] = useState(null);
  const [judul, setJudul] = useState("");
  const [pesan, setPesan] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getNotifikasi();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token", {
        withCredentials: true,
      });
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setExpire(decoded.exp);
      if (!decoded.id_admin) navigate("/dashboard");
    } catch (error) {
      navigate("/");
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
      setNotifikasi(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error.response?.data || error.message);
      setMsg("Gagal memuat notifikasi");
    }
  };

  const createNotifikasi = async (e) => {
    e.preventDefault();
      console.log("Token being sent:", token);
    try {
      await axiosJWT.post(
        "http://localhost:5000/notifikasi",
        { judul, pesan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Notifikasi berhasil ditambahkan");
      resetForm();
      getNotifikasi();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const startEditNotifikasi = (notif) => {
    setEditNotifikasi(notif);
    setJudul(notif.judul);
    setPesan(notif.pesan);
  };

  const updateNotifikasi = async (e) => {
    e.preventDefault();
    try {
      await axiosJWT.put(
        `http://localhost:5000/notifikasi/${editNotifikasi.id_notifikasi}`,
        { judul, pesan, status: editNotifikasi.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Notifikasi berhasil diperbarui");
      resetForm();
      getNotifikasi();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const deleteNotifikasi = async (id) => {
    try {
      await axiosJWT.delete(`http://localhost:5000/notifikasi/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("Notifikasi berhasil dihapus");
      getNotifikasi();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const resetForm = () => {
    setEditNotifikasi(null);
    setJudul("");
    setPesan("");
  };

  return (
    <div className="container mt-5">
      <h1 className="title">Manajemen Notifikasi</h1>
      {msg && <p className="has-text-centered has-text-success">{msg}</p>}

      <div className="box">
        <h2 className="subtitle">{editNotifikasi ? "Edit Notifikasi" : "Tambah Notifikasi"}</h2>
        <form onSubmit={editNotifikasi ? updateNotifikasi : createNotifikasi}>
          <div className="field">
            <label className="label">Judul</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Judul Notifikasi"
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Pesan</label>
            <div className="control">
              <textarea
                className="textarea"
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                placeholder="Pesan Notifikasi"
                required
              />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button type="submit" className="button is-success">
                {editNotifikasi ? "Perbarui" : "Tambah"}
              </button>
            </div>
            {editNotifikasi && (
              <div className="control">
                <button
                  type="button"
                  className="button is-light"
                  onClick={resetForm}
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Judul</th>
            <th>Pesan</th>
            <th>Status</th>
            <th>Tanggal Dibuat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {notifikasi.map((item, index) => (
            <tr key={item.id_notifikasi}>
              <td>{index + 1}</td>
              <td>{item.judul}</td>
              <td>{item.pesan}</td>
              <td>{item.status}</td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="button is-small is-info mr-2"
                  onClick={() => startEditNotifikasi(item)}
                >
                  Edit
                </button>
                <button
                  className="button is-small is-danger"
                  onClick={() => deleteNotifikasi(item.id_notifikasi)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotifikasiManagement;