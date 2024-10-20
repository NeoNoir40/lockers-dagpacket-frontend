import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Shipment from "./pages/shipments/Shipments";
import RechargeServices from "./pages/services/RechargeServices";
import Swal from "sweetalert2";
import { AuthProvider } from "../context/AuthContext";
import Login from "./pages/login/Login";
import ProtectedRoute from "../ProtectedRoutes/ProtectedRoute";
import HomePageAdmin from "./pages/admin/HomeAdmin";
import Recolect from "./pages/collect/Recolect";
import GavetaDetails from "./pages/admin/gavetaDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/envios" element={<Shipment />} />
          <Route path="/servicios" element={<RechargeServices />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recolectar" element={<Recolect/>}/>

          <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePageAdmin />} />
          <Route path="/gaveta/:id/:gabeta_id" element={<GavetaDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
