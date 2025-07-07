// frontend/src/components/Footer.js

import mysqllogo from "../images/mysqllogo.png";
import expressjslogo from "../images/expressjslogo.png";
import reactlogo from "../images/reactlogo.png";
import nodejslogo from "../images/nodejslogo.png";

const Footer = () => {
  return (
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
  );
};

export default Footer;