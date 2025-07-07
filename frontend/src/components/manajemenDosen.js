// absensi/frontend/src/components/manajemenDosen.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const DosenManagement = () => {
  const [dosen, setDosen] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [editDosen, setEditDosen] = useState(null);
  const [nama_dosen, setNamaDosen] = useState("");
  const [email_dosen, setEmailDosen] = useState("");
  const [nomor_dosen, setNomorDosen] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getDosen();
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

  const getDosen = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:5000/dosen", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDosen(response.data);
    } catch (error) {
      console.log(error);
      setMsg("Gagal memuat data dosen");
    }
  };

  const createDosen = async (e) => {
    e.preventDefault();
    try {
      await axiosJWT.post(
        "http://localhost:5000/dosen",
        { nama_dosen, email_dosen, nomor_dosen },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Dosen berhasil ditambahkan");
      resetForm();
      getDosen();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const startEditDosen = (dosen) => {
    setEditDosen(dosen);
    setNamaDosen(dosen.nama_dosen);
    setEmailDosen(dosen.email_dosen);
    setNomorDosen(dosen.nomor_dosen);
  };

  const updateDosen = async (e) => {
    e.preventDefault();
    try {
      await axiosJWT.put(
        `http://localhost:5000/dosen/${editDosen.id_dosen}`,
        { nama_dosen, email_dosen, nomor_dosen },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Dosen berhasil diperbarui");
      resetForm();
      getDosen();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const deleteDosen = async (id) => {
    try {
      await axiosJWT.delete(`http://localhost:5000/dosen/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("Dosen berhasil dihapus");
      getDosen();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const resetForm = () => {
    setEditDosen(null);
    setNamaDosen("");
    setEmailDosen("");
    setNomorDosen("");
  };

  return (
    <div className="container mt-5">
      <h1 className="title">Manajemen Dosen</h1>
      {msg && <p className="has-text-centered has-text-success">{msg}</p>}

      <div className="box">
        <h2 className="subtitle">{editDosen ? "Edit Dosen" : "Tambah Dosen"}</h2>
        <form onSubmit={editDosen ? updateDosen : createDosen}>
          <div className="field">
            <label className="label">Nama Dosen</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={nama_dosen}
                onChange={(e) => setNamaDosen(e.target.value)}
                placeholder="Nama Dosen"
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Email Dosen</label>
            <div className="control">
              <input
                type="email"
                className="input"
                value={email_dosen}
                onChange={(e) => setEmailDosen(e.target.value)}
                placeholder="Email Dosen"
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Nomor Telepon</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={nomor_dosen}
                onChange={(e) => setNomorDosen(e.target.value)}
                placeholder="Nomor Telepon"
                required
              />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button type="submit" className="button is-success">
                {editDosen ? "Perbarui" : "Tambah"}
              </button>
            </div>
            {editDosen && (
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
            <th>Nama Dosen</th>
            <th>Email</th>
            <th>Nomor Telepon</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dosen.map((item, index) => (
            <tr key={item.id_dosen}>
              <td>{index + 1}</td>
              <td>{item.nama_dosen}</td>
              <td>{item.email_dosen}</td>
              <td>{item.nomor_dosen}</td>
              <td>
                <button
                  className="button is-small is-info mr-2"
                  onClick={() => startEditDosen(item)}
                >
                  Edit
                </button>
                <button
                  className="button is-small is-danger"
                  onClick={() => deleteDosen(item.id_dosen)}
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

export default DosenManagement;