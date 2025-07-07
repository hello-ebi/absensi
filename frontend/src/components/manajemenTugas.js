// frontend/src/components/manajemenTugas.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const TugasManagement = () => {
  const [tugas, setTugas] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [editTugas, setEditTugas] = useState(null);
  const [id_matakuliah, setIdMatakuliah] = useState("");
  const [id_dosen, setIdDosen] = useState("");
  const [judul_tugas, setJudulTugas] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal_diberikan, setTanggalDiberikan] = useState("");
  const [deadline, setDeadline] = useState("");
  const [lampiran, setLampiran] = useState(null);
  const [matakuliahList, setMatakuliahList] = useState([]);
  const [dosenList, setDosenList] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getTugas();
    getMatakuliah();
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
      if (decoded.role !== "admin") navigate("/dashboard");
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

  const getTugas = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:5000/tugas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTugas(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getMatakuliah = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:5000/matakuliah", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatakuliahList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDosen = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:5000/dosen", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDosenList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createTugas = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id_matakuliah", id_matakuliah);
    formData.append("id_dosen", id_dosen);
    formData.append("judul_tugas", judul_tugas);
    formData.append("deskripsi", deskripsi);
    formData.append("tanggal_diberikan", tanggal_diberikan);
    formData.append("deadline", deadline);
    if (lampiran) formData.append("lampiran", lampiran);

    try {
      await axiosJWT.post("http://localhost:5000/tugas", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMsg("Tugas berhasil ditambahkan");
      resetForm();
      getTugas();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const startEditTugas = (tugas) => {
    setEditTugas(tugas);
    setIdMatakuliah(tugas.id_matakuliah);
    setIdDosen(tugas.id_dosen);
    setJudulTugas(tugas.judul_tugas);
    setDeskripsi(tugas.deskripsi || "");
    setTanggalDiberikan(tugas.tanggal_diberikan.split("T")[0]);
    setDeadline(tugas.deadline.split("T")[0]);
    setLampiran(null);
  };

  const updateTugas = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id_matakuliah", id_matakuliah);
    formData.append("id_dosen", id_dosen);
    formData.append("judul_tugas", judul_tugas);
    formData.append("deskripsi", deskripsi);
    formData.append("tanggal_diberikan", tanggal_diberikan);
    formData.append("deadline", deadline);
    if (lampiran) formData.append("lampiran", lampiran);

    try {
      await axiosJWT.put(`http://localhost:5000/tugas/${editTugas.id_tugas}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMsg("Tugas berhasil diperbarui");
      resetForm();
      getTugas();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const deleteTugas = async (id) => {
    try {
      await axiosJWT.delete(`http://localhost:5000/tugas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("Tugas berhasil dihapus");
      getTugas();
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setEditTugas(null);
    setIdMatakuliah("");
    setIdDosen("");
    setJudulTugas("");
    setDeskripsi("");
    setTanggalDiberikan("");
    setDeadline("");
    setLampiran(null);
  };

  return (
    <div className="container mt-5">
      <h1 className="title">Manajemen Tugas</h1>
      {msg && <p className="has-text-centered has-text-success">{msg}</p>}

      <div className="box">
        <h2 className="subtitle">{editTugas ? "Edit Tugas" : "Tambah Tugas"}</h2>
        <form onSubmit={editTugas ? updateTugas : createTugas}>
          <div className="field">
            <label className="label">Mata Kuliah</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={id_matakuliah}
                  onChange={(e) => setIdMatakuliah(e.target.value)}
                  required
                >
                  <option value="">Pilih Mata Kuliah</option>
                  {matakuliahList.map((matakuliah) => (
                    <option key={matakuliah.id_matakuliah} value={matakuliah.id_matakuliah}>
                      {matakuliah.nama_matakuliah}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Dosen</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={id_dosen} onChange={(e) => setIdDosen(e.target.value)} required>
                  <option value="">Pilih Dosen</option>
                  {dosenList.map((dosen) => (
                    <option key={dosen.id_dosen} value={dosen.id_dosen}>
                      {dosen.nama_dosen}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Judul Tugas</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={judul_tugas}
                onChange={(e) => setJudulTugas(e.target.value)}
                placeholder="Judul Tugas"
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Deskripsi</label>
            <div className="control">
              <textarea
                className="textarea"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Deskripsi Tugas (opsional)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Tanggal Diberikan</label>
            <div className="control">
              <input
                type="date"
                className="input"
                value={tanggal_diberikan}
                onChange={(e) => setTanggalDiberikan(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Deadline</label>
            <div className="control">
              <input
                type="date"
                className="input"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Lampiran</label>
            <div className="control">
              <input
                type="file"
                className="input"
                onChange={(e) => setLampiran(e.target.files[0])}
              />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button type="submit" className="button is-success">
                {editTugas ? "Perbarui" : "Tambah"}
              </button>
            </div>
            {editTugas && (
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
            <th>Mata Kuliah</th>
            <th>Dosen</th>
            <th>Judul</th>
            <th>Deskripsi</th>
            <th>Tanggal Diberikan</th>
            <th>Deadline</th>
            <th>Lampiran</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {tugas.map((item, index) => (
            <tr key={item.id_tugas}>
              <td>{index + 1}</td>
              <td>{item.Matakuliah?.nama_matakuliah || "-"}</td>
              <td>{item.Dosen?.nama_dosen || "-"}</td>
              <td>{item.judul_tugas}</td>
              <td>{item.deskripsi || "-"}</td>
              <td>{new Date(item.tanggal_diberikan).toLocaleDateString()}</td>
              <td>{new Date(item.deadline).toLocaleDateString()}</td>
              <td>
                {item.lampiran ? (
                  <a href={`http://localhost:5000/uploads/${item.lampiran}`} target="_blank" rel="noopener noreferrer">
                    Lihat File
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td>
                <button
                  className="button is-small is-info mr-2"
                  onClick={() => startEditTugas(item)}
                >
                  Edit
                </button>
                <button
                  className="button is-small is-danger"
                  onClick={() => deleteTugas(item.id_tugas)}
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

export default TugasManagement;