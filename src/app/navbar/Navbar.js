/**
 *
 * src/app/navbar/Navbar.js
 *
 */

import React from "react";

import icon from "../../assets/img/icon.svg";

const Navbar = ({ balance, setBalance }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-black px-5 py-4 shadow-lg">
      <a href="/" className="flex items-center gap-3 decoration-none">
        <img src={icon} alt="navbar-icon" className="w-8 h-8" />
        <span className="text-2xl font-black tracking-wider text-emerald-400">
          CRASH<span className="text-white">.IO</span>
        </span>
      </a>

      <div className="flex items-center gap-4">
        <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl flex items-center gap-3">
          <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase">
            Balance
          </span>
          <span className="text-lg font-bold text-emerald-400">
            ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <button
          onClick={() => setBalance(1000)}
          className="text-xs text-slate-400 hover:text-white underline transition"
        >
          Reset
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
