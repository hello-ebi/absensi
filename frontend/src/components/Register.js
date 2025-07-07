// frontend/src/components/register.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [id_prodi, setIdProdi] = useState("");
  const [semester, setSemester] = useState("");
  const [prodiList, setProdiList] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProdi = async () => {
      try {
        const response = await axios.get("http://localhost:5000/prodi");
        setProdiList(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProdi();
  }, []);

  const Register = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/mahasiswa", {
        nama,
        nim,
        password,
        confPassword,
        id_prodi,
        semester,
      });
      navigate("/users-management");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <section className="hero has-background-dark is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4-desktop">
              <form onSubmit={Register} className="box">
                <p className="has-text-centered has-text-warning">{msg}</p>
                <div className="field mt-5">
                  <label className="label">Nama</label>
                  <div className="controls">
                    <input
                      type="text"
                      className="input"
                      placeholder="Nama"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field mt-5">
                  <label className="label">NIM</label>
                  <div className="controls">
                    <input
                      type="text"
                      className="input"
                      placeholder="Nomor Induk Mahasiswa"
                      value={nim}
                      onChange={(e) => setNim(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field mt-5">
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
                <div className="field mt-5">
                  <label className="label">Semester</label>
                  <div className="controls">
                    <input
                      type="number"
                      className="input"
                      placeholder="Semester"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field mt-5">
                  <label className="label">Password</label>
                  <div className="controls">
                    <input
                      type="password"
                      className="input"
                      placeholder="Masukin Password lu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field mt-5">
                  <label className="label">Confirm Password</label>
                  <div className="controls">
                    <input
                      type="password"
                      className="input"
                      placeholder="Pastiin udah bener belom!"
                      value={confPassword}
                      onChange={(e) => setConfPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field mt-5">
                  <button className="button is-dark is-fullwidth is-rounded">
                    DAFTAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;