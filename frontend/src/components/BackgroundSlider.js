import React, { useEffect, useState } from "react";
import lab from '../images/lab.webp';
import frontoffice from '../images/frontoffice.webp';
import ruangkelas from '../images/ruangkelas.webp';

const images = [lab, frontoffice, ruangkelas];

const BackgroundSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      {images.map((img, i) => (
        <div
          key={i}
          className={`slide ${i === index ? "active" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        ></div>
      ))}
    </div>
  );
};

export default BackgroundSlider;