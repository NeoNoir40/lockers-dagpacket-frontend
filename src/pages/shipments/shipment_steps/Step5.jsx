import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "../../../assets/css/shipment/shipment.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

const api = import.meta.env.VITE_REACT_API_URL;

const Step5 = ({ handleClick, onWeightChange, shippingData }) => {
  const [isPackageInserted, setIsPackageInserted] = useState(false);
  const [openDoor, setOpenDoor] = useState(false);
  const { user } = useAuth();
  const locker_id = localStorage.getItem("locker_id");
  const gabeta_id = localStorage.getItem("idGabeta");

  const navigate = useNavigate();

  // Commented out guide generation and saving functions
  /*
  const saveGuide = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = axios.patch(
        `${api}/shipments/save-guide/${data}`,
        guide,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const generateGuideClient = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${api}/shipping/generate-guide`,
        generateGuide,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        localStorage.setItem("guideNumber", response.data.data.guideNumber);
        localStorage.setItem("guideUrl", response.data.data.guideUrl);
      } else {
        Swal.fire({
          title: "Error al generar guía",
          text: response.data.message,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  */

  const handleOpenDoor = async () => {
    try {
      const token = localStorage.getItem("token");
      const openDoorResponse = await axios.post(
        `${api}/mqtt/`,
        {
          locker_id: locker_id,
          action: "sendLocker",
          gabeta: gabeta_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

        return true;
      } else {
        Swal.fire({
          title: "Error",
          text: `No se pudo abrir el locker.`,
          icon: "error",
          confirmButtonText: "OK",
        });

        return false;
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: `No se pudo abrir el locker.`,
        icon: "error",
        confirmButtonText: "OK",
      });

      return false;
    }
  };

  const checkStatusDoor = async () => {
    try {
      const token = localStorage.getItem("token");
      const checkDoorResponse = await axios.post(
        `${api}/mqtt/`,
        {
          locker_id: locker_id,
          action: "checkDoor",
          gabeta: gabeta_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const responseMessage = checkDoorResponse.data.message;
  
      if (checkDoorResponse.data.error) {
        Swal.fire({
          title: "Error",
          text: `No se pudo revisar el estado del locker.`,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else if (responseMessage.includes(": 0")) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: `No se pudo revisar el estado del locker.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  
  const handleCloseDoor = async () => {
    let isClosed = false;
  
    while (!isClosed) {
      const doorClosed = await checkStatusDoor();
  
      if (!doorClosed) {
        await Swal.fire({
          title: "Atención",
          text: "Por favor, cierra la puerta del locker.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      } else {
        await Swal.fire({
          title: "Gracias",
          text: "Gracias por confiar en DagPacket.",
          icon: "success",
          confirmButtonText: "OK",
        });
        isClosed = true;
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    }
  };

  useEffect(() => {
    console.log("Locker ID:", locker_id);
    console.log("Gabeta ID:", gabeta_id);
    const timer = setTimeout(async () => {
      try {
        const lockerOpened = await handleOpenDoor();
  
        if (lockerOpened) {
          console.log("Locker abierto correctamente.");
          setIsPackageInserted(true);
          await handleCloseDoor();
        } else {
          console.log("Hubo un problema abriendo el locker.");
        }
      } catch (error) {
        console.error("Error en la apertura del locker:", error);
      }
    }, 5000);
  
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="step2 flex flex-col justify-center items-center gap-8 bg-white p-10 rounded-md shadow-md">
      <h1 className="text-3xl font-semibold mx-8 text-center">
        Espera a que la gabeta indicada se abra e{" "}
        <span className="text-orange-500">introduce tu paquete</span>
      </h1>
      <div className="flex justify-center items-center h-[40vh] w-full max-w-5xl px-4">
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

      {isPackageInserted && (
        <div
          className="bg-green-100 border-t-4 border-green-500 rounded-md text-green-700 px-4 py-3 shadow-md mt-6"
          role="alert">
          <p className="font-bold">¡Paquete ingresado correctamente!</p>
          <p>Tu paquete ha sido insertado en la gabeta correctamente.</p>
        </div>
      )}
    </div>
  );
};

export default Step5;