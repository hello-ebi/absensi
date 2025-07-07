// absensi/frontend/src/components/manajemenProdi.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProdiManagement = () => {
  const [prodi, setProdi] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [editProdi, setEditProdi] = useState(null);
  const [nama_prodi, setNamaProdi] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getProdi();
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

  const getProdi = async () => {
    try {
      const response = await axios.get("http://localhost:5000/prodi");
      setProdi(response.data);
    } catch (error) {
      console.log(error);
      setMsg("Gagal memuat data prodi");
    }
  };

  const createProdi = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/prodi", { nama_prodi });
      setMsg("Prodi berhasil ditambahkan");
      resetForm();
      getProdi();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const startEditProdi = (prodi) => {
    setEditProdi(prodi);
    setNamaProdi(prodi.nama_prodi);
  };

  const updateProdi = async (e) => {
    e.preventDefault();
    try {
      await axiosJWT.put(
        `http://localhost:5000/prodi/${editProdi.id_prodi}`,
        { nama_prodi },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Prodi berhasil diperbarui");
      resetForm();
      getProdi();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const deleteProdi = async (id) => {
    try {
      await axiosJWT.delete(`http://localhost:5000/prodi/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("Prodi berhasil dihapus");
      getProdi();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const resetForm = () => {
    setEditProdi(null);
    setNamaProdi("");
  };

  return (
    <div className="container mt-5">
      <h1 className="title">Manajemen Prodi</h1>
      {msg && <p className="has-text-centered has-text-success">{msg}</p>}

      <div className="box">
        <h2 className="subtitle">{editProdi ? "Edit Prodi" : "Tambah Prodi"}</h2>
        <form onSubmit={editProdi ? updateProdi : createProdi}>
          <div className="field">
            <label className="label">Nama Prodi</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={nama_prodi}
                onChange={(e) => setNamaProdi(e.target.value)}
                placeholder="Nama Prodi"
                required
              />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button type="submit" className="button is-success">
                {editProdi ? "Perbarui" : "Tambah"}
              </button>
            </div>
            {editProdi && (
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
            <th>Nama Prodi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {prodi.map((item, index) => (
            <tr key={item.id_prodi}>
              <td>{index + 1}</td>
              <td>{item.nama_prodi}</td>
              <td>
                <button
                  className="button is-small is-info mr-2"
                  onClick={() => startEditProdi(item)}
                >
                  Edit
                </button>
                <button
                  className="button is-small is-danger"
                  onClick={() => deleteProdi(item.id_prodi)}
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

export default ProdiManagement;