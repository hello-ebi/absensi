// frontend/src/components/landingPage.js

import React, { useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import { useNavigate } from "react-router-dom";
import BackgroundSlider from "./BackgroundSlider";
import "../styles/LandingPage.css";
import mysqllogo from "../images/mysqllogo.png";
import reactlogo from "../images/reactlogo.png";
import expressjslogo from "../images/expressjslogo.png";
import nodejslogo from "../images/nodejslogo.png";
import logostmikpamitran from "../images/logostmikpamitran.png";
import puhsepuh from "../videos/puhsepuh.mp4"
import LogoEffect from "./logoEffect";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isModalActive, setIsModalActive] = useState(false);

  const goToLogin = () => {
    navigate("/login-mahasiswa");
  };

  const openModal = () => {
    setIsModalActive(true);
  };

  const closeModal = () => {
    setIsModalActive(false);
  };

  return (
    <div className="landing-container">
      <section className="hero is-fullheight landing-hero">
        <BackgroundSlider />
        <div className="hero-body">
          <div className="container has-text-centered">

            <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
              <div className="navbar-brand">
                <a className="navbar-item" href="https://www.instagram.com/stmik_pamitran_official">

                  <img src={logostmikpamitran} alt="logopamitran" /> <h1><span className="warnalogosatu is-size-4">PAMITRAN Stud</span><span className="warnalogodua is-size-4 has-text-weight-semibold">Ease</span></h1>
                </a>

                <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                </a>
              </div>

              <div id="navbarBasicExample" className="navbar-menu">
                <div className="navbar-end">
                  <a className="navbar-item">
                    Tentang Kami
                  </a>

                  <a className="navbar-item" onClick={openModal}>
                    Bantuan
                  </a>
                  <a className="navbar-item" href="https://github.com/hello-ebi">
                    Kunjungi hello-ebi <span className="icon is-medium"><i className="fa-brands fa-github fas fa-lg mr-4"></i></span>
                  </a>
                </div>
              </div>
            </nav>

            <h1 className="title is-1 landing-title">
              <span style={{
                display: "inline-block",
                minWidth: "500px",
                textAlign: "center"
              }}>
              <Typewriter
                words={["SELAMAT DATANG DI PORTAL ABSENSI"]}
                loop={0}
                cursor
                cursorStyle=""
                typeSpeed={50}
                deleteSpeed={50}
                delaySpeed={5000}
              />
              </span>
            </h1>
            <p className="subtitle is-3 landing-subtitle"> Student, Utility, Dasboard, & Ease <br />
              Kelola absensi mahasiswa, dan akademik dengan mudah dan efisien.
            </p>
            <button
              className="button is-dark is-large is-rounded landing-button"
              onClick={goToLogin}
            >
              <span className="icon">
                <i className="fas fa-sign-in-alt"></i>
              </span>
              <span>Masuk Sekarang</span>
            </button>
          </div>
        </div>

        <div className={`modal ${isModalActive ? "is-active" : ""}`}>
          <div className="modal-background" onClick={closeModal}></div>
          <div className="modal-content">
            <div className="box">
              <video controls width="100%">
                <source src={puhsepuh} type="video/mp4" />
                browser anda butut, tidak bisa play video.
              </video>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={closeModal}></button>
        </div>

        <footer className="footer landing-footer">
          <div className="content has-text-centered">
            <p>Website ini sedang dikembangkan oleh <a href="https://www.instagram.com/penantang.hilang/">ebi</a> <br>
            </br>dan didukung oleh <b>kelompok 1.</b>&nbsp;
              Dibuat menggunakan stack: <br></br>
              <i className="icon is-large">
                <img src={mysqllogo} alt="mysqllogo" />
                <img src={expressjslogo} alt="expressjslogo" />
                <img src={reactlogo} alt="reactlogo" />
                <img src={nodejslogo} alt="nodejslogo" />

              </i>
            </p>
          </div>
        </footer>
      </section>

    </div>
  );
};

export default LandingPage;