// frontend/src/components/AdminLogin.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import LogoEffect from "./logoEffect";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const Auth = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login-admin", {
        username,
        password,
      });
      localStorage.setItem("accessToken", response.data.accessToken);
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <section className="hero is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered mt-5">
            <div className="column is-4-desktop">
              <div className="is-flex is-justify-content-center mb-4">
                <LogoEffect />
              </div>
              <form onSubmit={Auth} className="box">
                <p className="has-text-centered">{msg}</p>
                <h2 className="title is-4 has-text-centered">LOGIN ADMIN</h2>
                <div className="field mt-5">
                  <div className="control has-icons-left">
                    <input
                      type="text"
                      className="input is-rounded"
                      placeholder="Masukin username lu"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <span className="icon is-small is-left"><i className="fa-solid fa-envelope"></i></span>
                  </div>
                </div>
                <div className="field mt-5">
                  <div className="control has-icons-left">
                    <input
                      type="password"
                      className="input is-rounded"
                      placeholder="Masukin Password lu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="icon is-small is-left"><i className="fa-solid fa-lock"></i></span>
                  </div>
                </div>
                <div className="field mt-5">
                  <button className="button is-dark is-fullwidth is-rounded">
                    MASUK!
                  </button>
                </div>
                <div className="field mt-3 has-text-centered">
                  <a href="/login-mahasiswa" className="has-text-white">Masuk sebagai Mahasiswa</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default AdminLogin;