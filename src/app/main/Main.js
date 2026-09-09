/**
 *
 * src/app/main/Main.js
 *
 */

import React, { useState } from "react";

import Grid from "../grid/Grid";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

const Main = () => {
  const [balance, setBalance] = useState(1000.0);

  return (
    <>
      <Navbar balance={balance} setBalance={setBalance} />
      <Grid balance={balance} setBalance={setBalance} />
      <Footer />
    </>
  );
};

export default Main;
