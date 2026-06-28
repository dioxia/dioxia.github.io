/**
 *
 * src/app/navbar/Navbar.js
 *
 */

import React from "react";

// import "../../assets/css/navbar.css";

import icon from "../../assets/img/icon.svg";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center bg-black px-5 py-4 shadow-lg">
      <a href="/" className="decoration-none">
        <img src={icon} alt="navbar-icon" className="w-8 h-8" />
      </a>
    </nav>
  );
};

export default Navbar;
