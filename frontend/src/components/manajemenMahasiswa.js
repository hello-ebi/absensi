// absensi/frontend/src/components/manajemenUser.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [id_prodi, setIdProdi] = useState("");
  const [semester, setSemester] = useState("");
  const [prodiList, setProdiList] = useState([]);
  const [msg, setMsg] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerData, setRegisterData] = useState({
    nama: "",
    nim: "",
    id_prodi: "",
    semester: "",
    password: "",
    confPassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getUsers();
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
      if (!decoded.id_admin) navigate("/");
    } catch (error) {
      if (error.response) navigate("/");
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

  const getUsers = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:5000/mahasiswa", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.log(error);
      setMsg("Gagal memuat data mahasiswa");
    }
  };

  const getProdi = async () => {
    try {
      const response = await axios.get("http://localhost:5000/prodi");
      setProdiList(response.data);
    } catch (error) {
      console.error("Gagal ambil prodi:", error);
      setMsg("Gagal memuat data prodi");
    }
  };

  const deleteUser = async (nim) => {
    try {
      await axiosJWT.delete(`http://localhost:5000/mahasiswa/${nim}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("Data mahasiswa berhasil dihapus.");
      getUsers();
    } catch (error) {
      console.log(error);
      setMsg(`Gagal menghapus mahasiswa: ${error.response?.data?.msg || error.message}`);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    deleteUser(userToDelete.nim);
    setShowConfirmModal(false);
    setUserToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setUserToDelete(null);
  };

  const startEditUser = (user) => {
    setEditUser(user);
    setNama(user.nama);
    setNim(user.nim);
    setIdProdi(user.id_prodi);
    setSemester(user.semester);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      await axiosJWT.put(
        `http://localhost:5000/mahasiswa/${editUser.nim}`,
        { nama, id_prodi, semester },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditUser(null);
      setNama("");
      setNim("");
      setIdProdi("");
      setSemester("");
      setMsg("Data mahasiswa berhasil diubah.");
      getUsers();
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setRegisterData({
      nama: "",
      nim: "",
      id_prodi: "",
      semester: "",
      password: "",
      confPassword: "",
    });
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    setRegisterData({
      nama: "",
      nim: "",
      id_prodi: "",
      semester: "",
      password: "",
      confPassword: "",
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confPassword) {
      setMsg("Password sama konfirmasi passwordnya ga cocok tuh!");
      return;
    }
    try {
      await axiosJWT.post(
        "http://localhost:5000/mahasiswa",
        {
          nama: registerData.nama,
          nim: registerData.nim,
          id_prodi: registerData.id_prodi,
          semester: registerData.semester,
          password: registerData.password,
          confPassword: registerData.confPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Mahasiswa berhasil didaftarkan.");
      closeRegisterModal();
      getUsers();
    } catch (error) {
      console.log(error);
      setMsg(`Gagal mendaftarkan mahasiswa: ${error.response?.data?.msg || error.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="title">Kelola Mahasiswa</h1>
      {msg && (
        <div className="notification is-success has-text-centered">
          <button className="delete" onClick={() => setMsg("")}></button>
          {msg}
        </div>
      )}

      <button
        className="button is-rounded is-dark is-pulled-right"
        onClick={openRegisterModal}
      >
        Daftarkan Mahasiswa
      </button>

      {editUser && (
        <div className="box">
          <h2 className="subtitle">Edit Mahasiswa</h2>
          <form onSubmit={updateUser}>
            <div className="field">
              <label className="label">Nama</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">NIM</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  value={nim}
                  disabled
                  placeholder="Nomor Induk Mahasiswa"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Prodi</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    value={id_prodi}
                    onChange={(e) => setIdProdi(e.target.value)}
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
                />
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button type="submit" className="button is-success">
                  Update
                </button>
              </div>
              <div className="control">
                <button
                  type="button"
                  className="button is-light"
                  onClick={() => setEditUser(null)}
                >
                  Cancel
                </button>
              </div>
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
            <th>Prodi</th>
            <th>Semester</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.nim}>
              <td>{index + 1}</td>
              <td>{user.nim}</td>
              <td>{user.nama}</td>
              <td>{user.prodi?.nama_prodi}</td>
              <td>{user.semester}</td>
              <td>
                <button
                  className="button is-small is-success mr-2"
                  onClick={() => startEditUser(user)}
                ><FaEdit />
                </button>
                <button
                  className="button is-small is-danger"
                  onClick={() => handleDeleteClick(user)}
                >
                 <MdDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirmModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={cancelDelete}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Konfirmasi Hapus</p>
              <button className="delete" aria-label="close" onClick={cancelDelete}></button>
            </header>
            <section className="modal-card-body">
              <p>
                Yakin mau hapus data <strong>{userToDelete?.nama}</strong> (NIM: {userToDelete?.nim})?
              </p>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-danger" onClick={confirmDelete}>
                Iya njing
              </button>
              <button className="button" onClick={cancelDelete}>
                Batal
              </button>
            </footer>
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeRegisterModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Daftarkan Mahasiswa</p>
              <button className="delete" aria-label="close" onClick={closeRegisterModal}></button>
            </header>
            <section className="modal-card-body">
              <form onSubmit={registerUser}>
                <div className="field">
                  <label className="label">Nama</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      name="nama"
                      value={registerData.nama}
                      onChange={handleRegisterChange}
                      placeholder="Nama"
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">NIM</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      name="nim"
                      value={registerData.nim}
                      onChange={handleRegisterChange}
                      placeholder="Nomor Induk Mahasiswa"
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Prodi</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        name="id_prodi"
                        value={registerData.id_prodi}
                        onChange={handleRegisterChange}
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
                      name="semester"
                      value={registerData.semester}
                      onChange={handleRegisterChange}
                      placeholder="Semester"
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <div className="control">
                    <input
                      type="password"
                      className="input"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      placeholder="Password"
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Konfirmasi Password</label>
                  <div className="control">
                    <input
                      type="password"
                      className="input"
                      name="confPassword"
                      value={registerData.confPassword}
                      onChange={handleRegisterChange}
                      placeholder="Konfirmasi Password"
                      required
                    />
                  </div>
                </div>
                <div className="field is-grouped">
                  <div className="control">
                    <button type="submit" className="button is-dark">
                      Daftar
                    </button>
                  </div>
                  <div className="control">
                    <button
                      type="button"
                      className="button is-light"
                      onClick={closeRegisterModal}
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;