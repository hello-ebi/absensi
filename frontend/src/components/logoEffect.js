import React, { useState } from "react";
import "../styles/logoEffect.css";
import velocity from "../images/velocityemoji.gif";
import logostmik from "../images/logostmikpamitran.png";

const LogoEffect = () => {
  const [zooming, setZooming] = useState(false);
  const [showGif, setShowGif] = useState(false);

  const handleClick = () => {
    if (zooming) return; // biar gak spam klik pas animasi jalan

    if (!showGif) {
      // dari logo → GIF
      setZooming(true);
      setTimeout(() => {
        setShowGif(true);
        setZooming(false);
      }, 600);
    } else {
      // dari GIF → balik ke logo
      setShowGif(false);
    }
  };

  return (
    <div className="logo-wrapper" onClick={handleClick}>
      {!showGif ? (
        <img
          src={logostmik}
          alt="Logo"
          className={`logo-img ${zooming ? "logo-zoom" : ""}`}
        />
      ) : (
        <img src={velocity} alt="GIF Logo" className="gif-logo" />
      )}
    </div>
  );
};

export default LogoEffect;