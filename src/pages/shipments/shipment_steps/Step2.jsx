import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
const api = import.meta.env.VITE_REACT_API_URL; // Obtener la URL desde el .env

import "../../../assets/css/shipment/shipment.css";

const Step2 = ({ handleClick, onWeightChange }) => {
  const [detectedWeight, setDetectedWeight] = useState("");
  const [openDoor, setOpenDoor] = useState(false);
  const [weight, setWeight] = useState("");
const id_locker = localStorage.getItem("locker_id");
const scale = localStorage.getItem("weighing_scale_gabeta_id");
  const handleContinue = () => {
    handleClick(3);
  };

  
    const handleOpenDoor = async () => {
      try {
        const TOKEN = localStorage.getItem("token");
        const openDoorResponse = await axios.post(
          `${api}/mqtt/`,
          {
            locker_id: id_locker,
            action: "sendLocker",
            gabeta: scale,
          },{
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
    
        if (!openDoorResponse.data.error) {
          setOpenDoor(true);
    
          Swal.fire({
            title: "Locker Abierto",
            text: `El locker se ha abierto correctamente.`,
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: `No se pudo abrir el locker.`,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: `No se pudo abrir el locker.`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };
    

    const handleCheckDoor = async () => {
      try {
        const checkDoorResponse = await axios.post(
          `${api}/api/v1/mqtt/`,
          {
            locker_id: "2",
            action: "checkDoor", // Cambiado a "checkDoor"
            gabeta: "100",
          },{
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
    
        if (!checkDoorResponse.data.error) {
          const doorStatus = checkDoorResponse.data.status; // Ajusta según tu API
          Swal.fire({
            title: "Estado de la Puerta",
            text: `La puerta está ${doorStatus}.`, // Muestra el estado
            icon: "info",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: `No se pudo obtener el estado de la puerta.`,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: `No se pudo obtener el estado de la puerta.`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };
    

    
  const handleStartWeighing = () => {
    // Simular el pesado con un valor fijo de 19
    const weight = "19"; // Simulamos que se detecta un peso de 19
    setDetectedWeight(weight);
    onWeightChange(weight);

    // Mostrar la alerta con el peso detectado
    Swal.fire({
      title: "Peso Detectado",
      text: `Se ha detectado el peso`,
      icon: "info",
      confirmButtonText: "OK",
    });
  };

  // Determina si el botón "Continuar" debe ser visible
  const showContinueButton = detectedWeight;

  return (
    <div className="step2 flex flex-col justify-center items-center gap-8 bg-white p-10 rounded-md shadow-md">
      <h1 className="text-3xl font-semibold mx-8 text-center">
        Espera a que el locker indicado se abra e
        <span className="text-orange-500"> introduce tu paquete</span> para
        pesarlo
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
        onClick={handleStartWeighing}
        className="px-10 py-4 bg-orange-500 text-white text-bold text-xl rounded-full"
        id="startWeighingButton"
        style={{
          display: showContinueButton ? "none" : "block",
        }}>
        Iniciar pesado
      </button>
      <button
        id="continueButton"
        className="px-8 py-2 bg-orange-500 text-white text-bold text-xl rounded-full"
        type="button"
        onClick={handleContinue}
        style={{
          display: showContinueButton ? "block" : "none",
        }}>
        Continuar
      </button>
      {/* <button
        onClick={handleOpenDoor}
        className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-4">
        PRUEBA DE BOTON CON MQTT
      </button> */}
     
    </div>
  );
};

export default Step2;
