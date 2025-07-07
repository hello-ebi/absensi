// frontend/src/components/manajemenAbsensi.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AbsensiManagement = () => {
  const [absensi, setAbsensi] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [editAbsensi, setEditAbsensi] = useState(null);
  const [nim, setNim] = useState("");
  const [id_matakuliah, setIdMatakuliah] = useState("");
  const [waktu_absen, setWaktuAbsen] = useState("");
  const [status, setStatus] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [matakuliahList, setMatakuliahList] = useState([]);
  const [msg, setMsg] = useState("");
  const [userNim, setUserNim] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

useEffect(() => {
  if (token && (userRole === "admin" || userNim)) {
    getAbsensi();
    getMahasiswa();
    getMatakuliah();
  }
}, [token, userNim, userRole]);


  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token", {
        withCredentials: true,
      });
      const accessToken = response.data.accessToken;
      setToken(accessToken);
      const decoded = jwtDecode(accessToken);
      console.log("Isi Token di Absensi:", JSON.stringify(decoded, null, 2));
      setExpire(decoded.exp);
      setUserRole(decoded.role || "mahasiswa");
      setUserNim(decoded.nim || "");
      if (decoded.role !== "admin") {
        setNim(decoded.nim || "");
      }
      if (!decoded.nim && decoded.role !== "admin") {
        console.warn("NIM tidak ditemukan di token! Redirecting to login.");
        setMsg("Sesi tidak valid. Silakan login ulang.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error refreshing token di Absensi:", error.message);
      setMsg(error.response?.data?.msg || error.message);
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
        console.log("Isi Token di Interceptor Absensi:", JSON.stringify(decoded, null, 2));
        setExpire(decoded.exp);
        setUserNim(decoded.nim || "");
        setUserRole(decoded.role || "mahasiswa");
        if (decoded.role !== "admin") {
          setNim(decoded.nim || "");
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const getAbsensi = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:5000/absensi", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Data Absensi:", JSON.stringify(response.data, null, 2));
      setAbsensi(response.data);
      console.log("User NIM:", userNim);
      console.log("User Role:", userRole);
      console.log("Filtered Absensi:", response.data.filter((item) => userRole === "admin" || item.nim === userNim));
      if (response.data.length === 0 && userRole !== "admin") {
        setMsg("Belum ada data absensi untuk Anda.");
      }
    } catch (error) {
      console.error("Error fetching absensi:", error.message);
      setMsg(`Gagal mengambil data absensi: ${error.response?.data?.msg || error.message}`);
    }
  };

  const getMahasiswa = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:5000/mahasiswa", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMahasiswaList(response.data);
    } catch (error) {
      console.error("Error fetching mahasiswa:", error.message);
    }
  };

  const getMatakuliah = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:5000/matakuliah", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatakuliahList(response.data);
    } catch (error) {
      console.error("Error fetching matakuliah:", error.message);
    }
  };

  const createAbsensi = async (e) => {
    e.preventDefault();
    try {
      await axiosJWT.post(
        "http://localhost:5000/absensi",
        { nim, id_matakuliah, waktu_absen, status, keterangan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Absensi berhasil ditambahkan");
      getAbsensi();
      if (userRole !== "admin") {
        setIdMatakuliah("");
        setWaktuAbsen("");
        setStatus("");
        setKeterangan("");
      } else {
        setNim("");
        setIdMatakuliah("");
        setWaktuAbsen("");
        setStatus("");
        setKeterangan("");
      }
    } catch (error) {
      console.error("Error creating absensi:", error.message);
      if (error.response) setMsg(error.response.data.msg);
    }
  };

  const startEditAbsensi = (absensi) => {
    setEditAbsensi(absensi);
    setNim(absensi.nim);
    setIdMatakuliah(absensi.id_matakuliah);
    setWaktuAbsen(new Date(absensi.waktu_absen).toISOString().slice(0, 16));
    setStatus(absensi.status);
    setKeterangan(absensi.keterangan || "");
  };

  const updateAbsensi = async (e) => {
    e.preventDefault();
    try {
      await axiosJWT.put(
        `http://localhost:5000/absensi/${editAbsensi.id_absen}`,
        { nim, id_matakuliah, waktu_absen, status, keterangan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditAbsensi(null);
      setNim(userRole !== "admin" ? userNim : "");
      setIdMatakuliah("");
      setWaktuAbsen("");
      setStatus("");
      setKeterangan("");
      setMsg("Absensi berhasil diperbarui");
      getAbsensi();
    } catch (error) {
      console.error("Error updating absensi:", error.message);
      if (error.response) setMsg(error.response.data.msg);
    }
  };

  const deleteAbsensi = async (id) => {
    try {
      await axiosJWT.delete(`http://localhost:5000/absensi/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("Absensi berhasil dihapus");
      getAbsensi();
    } catch (error) {
      console.error("Error deleting absensi:", error.message);
      if (error.response) setMsg(error.response.data.msg);
    }
  };

  const isEditable = (waktuAbsen) => {
    const waktuAbsenDate = new Date(waktuAbsen);
    const waktuSekarang = new Date();
    const selisihMenit = (waktuSekarang - waktuAbsenDate) / (1000 * 60);
    return selisihMenit <= 30;
  };

  const isWithinSchedule = () => {
    if (!id_matakuliah || userRole === "admin") return true;
    const matakuliah = matakuliahList.find((mk) => mk.id_matakuliah === parseInt(id_matakuliah));
    if (!matakuliah) return false;

    const sekarang = new Date();
    const hariSekarang = sekarang.toLocaleString("id-ID", { weekday: "long" });
    const jamSekarang = sekarang.toTimeString().split(" ")[0];

    const hariMap = {
      Senin: "Senin",
      Selasa: "Selasa",
      Rabu: "Rabu",
      Kamis: "Kamis",
      Jumat: "Jumat",
      Sabtu: "Sabtu",
      Minggu: "Minggu",
    };
    console.log("Jadwal Check:", {
      hariSekarang,
      jamSekarang,
      matakuliahHari: matakuliah?.hari,
      jamMulai: matakuliah?.jam_mulai,
      jamSelesai: matakuliah?.jam_selesai,
    });
    return (
      hariMap[hariSekarang] === matakuliah.hari &&
      jamSekarang >= matakuliah.jam_mulai &&
      jamSekarang <= matakuliah.jam_selesai
    );
  };

  return (
    <div className="container mt-5">
      <h1 className="title">Absensi Management</h1>
      {msg && (
        <div className="notification is-danger has-text-centered">
          <button className="delete" onClick={() => setMsg("")}></button>
          {msg}
        </div>
      )}

      {userRole !== "admin" && !isWithinSchedule() && id_matakuliah ? (
        <p className="has-text-centered has-text-danger">
          Absensi hanya dapat dilakukan selama jam mata kuliah berlangsung.
        </p>
      ) : (
        <div className="box">
          <h2 className="subtitle">{editAbsensi ? "Edit Absensi" : "Tambah Absensi"}</h2>
          <form onSubmit={editAbsensi ? updateAbsensi : createAbsensi}>
            <div className="field">
              <label className="label">Mahasiswa</label>
              <div className="control">
                {userRole === "admin" ? (
                  <div className="select is-fullwidth">
                    <select value={nim} onChange={(e) => setNim(e.target.value)}>
                      <option value="">Pilih Mahasiswa</option>
                      {mahasiswaList.map((mahasiswa) => (
                        <option key={mahasiswa.nim} value={mahasiswa.nim}>
                          {mahasiswa.nama} ({mahasiswa.nim})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <input
                    type="text"
                    className="input"
                    value={userNim}
                    disabled
                  />
                )}
              </div>
            </div>
            <div className="field">
              <label className="label">Mata Kuliah</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    value={id_matakuliah}
                    onChange={(e) => setIdMatakuliah(e.target.value)}
                  >
                    <option value="">Pilih Mata Kuliah</option>
                    {matakuliahList.map((matakuliah) => (
                      <option
                        key={matakuliah.id_matakuliah}
                        value={matakuliah.id_matakuliah}
                      >
                        {matakuliah.nama_matakuliah} ({matakuliah.hari}, {matakuliah.jam_mulai} - {matakuliah.jam_selesai})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Waktu Absen</label>
              <div className="control">
                <input
                  type="datetime-local"
                  className="input"
                  value={waktu_absen}
                  onChange={(e) => setWaktuAbsen(e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Status</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Pilih Status</option>
                    <option value="Hadir">Hadir</option>
                    <option value="Tidak Hadir">Tidak Hadir</option>
                    <option value="Izin">Izin</option>
                    <option value="Sakit">Sakit</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Keterangan</label>
              <div className="control">
                <textarea
                  className="textarea"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Keterangan (opsional)"
                ></textarea>
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button
                  type="submit"
                  className="button is-success"
                  disabled={userRole !== "admin" && !isWithinSchedule()}
                >
                  {editAbsensi ? "Update" : "Tambah"}
                </button>
              </div>
              {editAbsensi && (
                <div className="control">
                  <button
                    type="button"
                    className="button is-light"
                    onClick={() => setEditAbsensi(null)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      )}

      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>NIM</th>
            <th>Nama</th>
            <th>Mata Kuliah</th>
            <th>Waktu Absen</th>
            <th>Status</th>
            <th>Keterangan</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {absensi
            .filter((item) => userRole === "admin" || item.nim === userNim)
            .map((item, index) => {
              console.log("Rendering item:", JSON.stringify(item, null, 2));
              return (
                <tr key={item.id_absen}>
                  <td>{index + 1}</td>
                  <td>{item.nim}</td>
                  <td>{item.Usersmahasiswa?.nama || "-"}</td>
                  <td>{item.Matakuliah?.nama_matakuliah || "-"}</td>
                  <td>{new Date(item.waktu_absen).toLocaleString()}</td>
                  <td>{item.status}</td>
                  <td>{item.keterangan || "-"}</td>
                  <td>
                    {(userRole === "admin" || (item.nim === userNim && isEditable(item.waktu_absen))) && (
                      <button
                        className="button is-small is-info mr-2"
                        onClick={() => startEditAbsensi(item)}
                      >
                        Edit
                      </button>
                    )}
                    {userRole === "admin" && (
                      <button
                        className="button is-small is-danger"
                        onClick={() => deleteAbsensi(item.id_absen)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default AbsensiManagement;