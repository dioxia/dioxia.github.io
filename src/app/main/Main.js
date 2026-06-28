/**
 *
 * src/app/main/Main.js
 *
 */

import React from "react";

import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import Card from "../card/Card";

const Main = () => {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Navbar />

      <section className="flex justify-center items-center min-h-screen px-8 pt-20 pb-20">
        <Card />
      </section>

      <Footer />
    </main>
  );
};

export default Main;

