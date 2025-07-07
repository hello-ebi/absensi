// frontend/src/components/Layout.js

import React from "react";
import Sidebar from "./sidebar.js";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="columns is-gapless is-fullheight">
      <div className="column is-narrow">
        <Sidebar />
      </div>
      <div className="column content-area">
        <div className="main-content">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;