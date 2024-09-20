import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

import "../../../assets/css/shipment/shipment.css";

const Step2 = ({ handleClick, onWeightChange }) => {
  const [detectedWeight, setDetectedWeight] = useState("");
  const [openDoor, setOpenDoor] = useState(false);
  const [weight, setWeight] = useState("");

  const handleContinue = () => {
    handleClick(3);
  };

  const TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY2YzI4YjdlZTNmMTExMzRmNzRmODI5NiIsIm5hbWUiOiJIdWdvIiwic3VybmFtZSI6IlJ1aXoiLCJlbWFpbCI6ImRlc2Fycm9sbG93ZWJAZGFncGFja2V0LmNvbS5teCIsInJvbGUiOiJBRE1JTiJ9LCJpYXQiOjE3MjY3ODQyOTYsImV4cCI6MTcyNjgxMzA5Nn0.tM7mrxgxMzc2OsYcKxNnbcYEUnrPUk9ofzwMCdFQuds";

  const handleOpenDoor = async () => {
    try {
      const openDoorResponse = await axios.post(
        "http://192.168.1.95:3000/api/v1/mqtt/",
        {
          locker_id: "2",
          action: "sendLocker",
          gabeta: "100",
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

        const weightResponse = await axios.post(
          "http://192.168.1.95:3000/api/v1/mqtt/",
          {
            locker_id: "2",
            action: "getWeight",
            gabeta: "100",
          },{
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        if (!weightResponse.data.error) {
          const message = weightResponse.data.message;
          const weight = message.split(':')[1].trim();  // Obtener la parte después de ':'
          setWeight(weight);
          onWeightChange(weight);
          handleClick(3);
          console.log(weight);
          
        } else {
          Swal.fire({
            title: "Error",
            text: `No se pudo obtener el peso del paquete.`,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }

      if(weight && openDoor){
        handleClick(3);
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

  const handleStartWeighing = () => {
    // Simular el pesado con un valor fijo de 19
    const weight = "19"; // Simulamos que se detecta un peso de 19
    setDetectedWeight(weight);
    onWeightChange(weight);

    // Mostrar la alerta con el peso detectado
    Swal.fire({
      title: "Peso Detectado",
      text: `Se ha detectado un peso de ${weight} kg.`,
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
        <span className="text-orange-500">introduce tu paquete</span> para
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
      <button
        onClick={handleOpenDoor}
        className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-4">
        PRUEBA DE BOTON CON MQTT
      </button>
      <h3 id="weight" className="text-xl">
        {detectedWeight && `Peso: ${detectedWeight} kg`}
      </h3>
    </div>
  );
};

export default Step2;
