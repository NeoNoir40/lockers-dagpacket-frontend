import React, { useState } from "react";
import Swal from "sweetalert2";

import "../../../assets/css/shipment/shipment.css";

const Step5 = ({ handleClick, onWeightChange }) => {

  // Determina si el botón "Continuar" debe ser visible

  return (
    <div className="step2 flex flex-col justify-center items-center gap-8 bg-white p-10 rounded-md shadow-md">
      <h1 className="text-3xl font-semibold mx-8 text-center">
        Espera a que la gabeta indicada se abra e{" "}
        <span className="text-orange-500">introduce tu paquete</span>
      </h1>
      <div className="flex justify-center items-center h-[40vh] w-full max-w-5xl px-4">
        {/* Contenedor de la pantalla */}
        <div className="screen-container grid gap-1 h-full w-1/5 bg-gray-400 border-4 border-gray-400">
          <div className="locker17 bg-gray-200 px-3 py-2">
            <div className="bg-black w-full h-full"></div>
          </div>
          <div className="locker18 bg-gray-200 px-7 pb-2 pt-1">
            <div className="flex justify-center items-center bg-white h-full w-full">
              <img src="logo.webp" alt="Logo" className="w-1/2" />
            </div>
          </div>
          <div className="locker19 bg-gray-200 p-3"></div>
          <div className="locker20 bg-gray-200 p-3 open"></div>
        </div>
        <div className="lockers-container grid gap-1 h-full w-2/5 bg-gray-400 border-4 border-gray-400">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="bg-gray-200 p-3"></div>
          ))}
        </div>
      </div>
      <button
      className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-4"
      >
        Finalizar
      </button>
    </div>
  );
};

export default Step5;
