import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage'
import Shipment from "./pages/shipments/Shipments";
import RechargeServices from "./pages/services/RechargeServices";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/envios" element={<Shipment />} />
        <Route path="/servicios" element={<RechargeServices />} />


        {/* <Route path="*" element={<NoMatch />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
