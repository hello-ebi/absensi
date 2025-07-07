// frontend/src/components/manajemenMatakuliah.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const MatakuliahManagement = () => {
  const [matakuliah, setMatakuliah] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [editMatakuliah, setEditMatakuliah] = useState(null);
  const [nama_matakuliah, setNamaMatakuliah] = useState("");
  const [id_dosen, setIdDosen] = useState("");
  const [id_prodi, setIdProdi] = useState("");
  const [semester, setSemester] = useState("");
  const [hari, setHari] = useState("");
  const [jam_mulai, setJamMulai] = useState("");
  const [jam_selesai, setJamSelesai] = useState("");
  const [dosenList, setDosenList] = useState([]);
  const [prodiList, setProdiList] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getMatakuliah();
    getDosen();
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

  const getMatakuliah = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:5000/matakuliah", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatakuliah(response.data);
    } catch (error) {
      console.log(error);
      setMsg("Gagal memuat data mata kuliah");
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
      setMsg("Gagal memuat data dosen");
    }
  };

  const getProdi = async () => {
    try {
      const response = await axios.get("http://localhost:5000/prodi");
      setProdiList(response.data);
    } catch (error) {
      console.log(error);
      setMsg("Gagal memuat data prodi");
    }
  };

  const createMatakuliah = async (e) => {
    e.preventDefault();
    try {
      await axiosJWT.post(
        "http://localhost:5000/matakuliah",
        { nama_matakuliah, id_dosen, id_prodi, semester, hari, jam_mulai, jam_selesai },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Mata kuliah berhasil ditambahkan");
      resetForm();
      getMatakuliah();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const startEditMatakuliah = (matakuliah) => {
    setEditMatakuliah(matakuliah);
    setNamaMatakuliah(matakuliah.nama_matakuliah);
    setIdDosen(matakuliah.id_dosen);
    setIdProdi(matakuliah.id_prodi);
    setSemester(matakuliah.semester);
    setHari(matakuliah.hari);
    setJamMulai(matakuliah.jam_mulai);
    setJamSelesai(matakuliah.jam_selesai);
  };

  const updateMatakuliah = async (e) => {
    e.preventDefault();
    try {
      await axiosJWT.put(
        `http://localhost:5000/matakuliah/${editMatakuliah.id_matakuliah}`,
        { nama_matakuliah, id_dosen, id_prodi, semester, hari, jam_mulai, jam_selesai },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Mata kuliah berhasil diperbarui");
      resetForm();
      getMatakuliah();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const deleteMatakuliah = async (id) => {
    try {
      await axiosJWT.delete(`http://localhost:5000/matakuliah/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("Mata kuliah berhasil dihapus");
      getMatakuliah();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const resetForm = () => {
    setEditMatakuliah(null);
    setNamaMatakuliah("");
    setIdDosen("");
    setIdProdi("");
    setSemester("");
    setHari("");
    setJamMulai("");
    setJamSelesai("");
  };

  return (
    <div className="container mt-5">
      <h1 className="title">Manajemen Mata Kuliah</h1>
      {msg && <p className="has-text-centered has-text-success">{msg}</p>}

      <div className="box">
        <h2 className="subtitle">{editMatakuliah ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}</h2>
        <form onSubmit={editMatakuliah ? updateMatakuliah : createMatakuliah}>
          <div className="field">
            <label className="label">Nama Mata Kuliah</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={nama_matakuliah}
                onChange={(e) => setNamaMatakuliah(e.target.value)}
                placeholder="Nama Mata Kuliah"
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Dosen</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={id_dosen}
                  onChange={(e) => setIdDosen(e.target.value)}
                  required
                >
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
            <label className="label">Prodi</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={id_prodi}
                  onChange={(e) => setIdProdi(e.target.value)}
                  required
                >
                  <option value="">Pilih Prodi</option>
                  {prodiList.map((prodi) => (
                    <option key={prodi.id_prodi} value={prodi.id_prodi}>
                      {prodi.nama_prodi}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Semester</label>
            <div className="control">
              <input
                type="number"
                className="input"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="Semester"
                required
                min="1"
                max="8"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Hari</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={hari}
                  onChange={(e) => setHari(e.target.value)}
                  required
                >
                  <option value="">Pilih Hari</option>
                  {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Jam Mulai</label>
            <div className="control">
              <input
                type="time"
                className="input"
                value={jam_mulai}
                onChange={(e) => setJamMulai(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Jam Selesai</label>
            <div className="control">
              <input
                type="time"
                className="input"
                value={jam_selesai}
                onChange={(e) => setJamSelesai(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button type="submit" className="button is-success">
                {editMatakuliah ? "Perbarui" : "Tambah"}
              </button>
            </div>
            {editMatakuliah && (
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
            <th>Nama Mata Kuliah</th>
            <th>Dosen</th>
            <th>Prodi</th>
            <th>Semester</th>
            <th>Hari</th>
            <th>Jam</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {matakuliah.map((item, index) => (
            <tr key={item.id_matakuliah}>
              <td>{index + 1}</td>
              <td>{item.nama_matakuliah}</td>
              <td>{item.Dosen?.nama_dosen || item.id_dosen}</td>
              <td>{item.Prodi?.nama_prodi || item.id_prodi}</td>
              <td>{item.semester}</td>
              <td>{item.hari}</td>
              <td>{item.jam_mulai} - {item.jam_selesai}</td>
              <td>
                <button
                  className="button is-small is-info mr-2"
                  onClick={() => startEditMatakuliah(item)}
                >
                  Edit
                </button>
                <button
                  className="button is-small is-danger"
                  onClick={() => deleteMatakuliah(item.id_matakuliah)}
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

export default MatakuliahManagement;