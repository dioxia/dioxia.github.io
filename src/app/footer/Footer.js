/**
 *
 * src/app/footer/Footer.js
 *
 */

import React from "react";

// import "../../assets/css/footer.css";

import icon from "../../assets/img/icon.svg";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 flex items-center bg-black px-5 py-4 shadow-lg">
      <a href="/" className="decoration-none">
        <img src={icon} alt="footer-icon" className="w-8 h-8" />
      </a>
    </footer>
  );
}

export default Footer;
