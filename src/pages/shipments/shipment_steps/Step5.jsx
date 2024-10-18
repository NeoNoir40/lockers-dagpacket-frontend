import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import waitAudioGaveta from '../../../assets/voice/wait_for_open.mp3'
import errroGaveta from '../../../assets/voice/error_open_gaveta.mp3'
import "../../../assets/css/shipment/shipment.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import {updateSaturation} from '../../../../context/auth'
import { set } from "react-hook-form";

const api = import.meta.env.VITE_REACT_API_URL;

const Step5 = ({ handleClick, onWeightChange, shippingData }) => {
  const [isPackageInserted, setIsPackageInserted] = useState(false);
  const [openDoor, setOpenDoor] = useState(false);
  const { user } = useAuth();
  const locker_id = localStorage.getItem("locker_id");
  const gabeta_id = localStorage.getItem("idGabeta");
  const _idgabeta = localStorage.getItem("_idgabeta");
  console.log("Gabeta ID:", gabeta_id);
  const shipment_id = localStorage.getItem("shipment_id");
  const user_id = localStorage.getItem("user_id");
  const pin_gabeta = localStorage.getItem("pin_gabeta");
  console.log("Locker ID:", locker_id);
  console.log("User ID:", _idgabeta);
  const [idGabetaTest, setIdGabetaTest] = useState(1);
  const [pinTest, setPinTest] = useState('');
  const type_gabeta = localStorage.getItem("tipo_paquete");


  useEffect(() => {
    if(audioOpen.current){
      audioOpen.current.play();
    }

    if(type_gabeta == 'Sobre'){
      setIdGabetaTest(1);
      setPinTest('2tb71kyR7Q');
    }else{
      setIdGabetaTest(2);
      setPinTest('ccgxTyknsr');
    }

  }
  ,[]);
  const audioOpen = useRef(null);
  const audioError = useRef(null);
  const navigate = useNavigate();

  console.log("Shipment datos:", shippingData);

    const email = shippingData.recipient.email;
    const name = shippingData.recipient.name;


    // Define initial state for data

  

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


  const updateGabetaSaturation = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${api}/gabeta/update-saturation`,
        {
          _id: idGabetaTest,
          package:shipment_id,
          saturation: true,
          pin: pinTest,
          email: email,
          nombre: name
        },
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
  }


  // const handleOpenDoor = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const openDoorResponse = await axios.post(
  //       `${api}/mqtt/`,
  //       {
  //         locker_id: locker_id,
  //         action: "sendLocker",
  //         gabeta: gabeta_id,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!openDoorResponse.data.error) {
  //       setOpenDoor(true);

  //       Swal.fire({
  //         title: "Locker Abierto",
  //         text: `El locker se ha abierto correctamente.`,
  //         icon: "success",
  //         confirmButtonText: "OK",
  //       });

  //       return true;
  //     } else {
  //       Swal.fire({
  //         title: "Error",
  //         text: `No se pudo abrir el locker.`,
  //         icon: "error",
  //         confirmButtonText: "OK",
  //       });

  //       return false;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Swal.fire({
  //       title: "Error",
  //       text: `No se pudo abrir el locker.`,
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });

  //     return false;
  //   }
  // };

  const handleOpenDoor = async () => {
    const attemptOpenDoor = async () => {
      try {
        const token = localStorage.getItem("token");
        const openDoorResponse = await axios.post(
          `${api}/mqtt/`,
          {
            locker_id: locker_id,
            action: "sendLocker",
            gabeta: idGabetaTest,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!openDoorResponse.data.error) {
          setOpenDoor(true);
  
          await Swal.fire({
            title: "Locker Abierto",
            text: `El locker se ha abierto correctamente.`,
            icon: "success",
            confirmButtonText: "OK",
          });
  
          return true;
        } else {
          throw new Error("No se pudo abrir el locker.");
        }
      } catch (error) {
        console.error(error);

        if (audioError.current) {
          audioError.current.play();
        }


        const result = await Swal.fire({
          title: "Error",
          text: `No se pudo abrir el locker. ¿Desea intentar nuevamente?`,
          icon: "error",
          showCancelButton: true,
          confirmButtonText: "Reintentar",
          cancelButtonText: "Cancelar",
        });
  
        if (result.isConfirmed) {
          return attemptOpenDoor(); // Reintento recursivo
        } else {
          return false; // El usuario ha decidido cancelar
        }
      }
    };
  
    return attemptOpenDoor();
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
          await updateGabetaSaturation();
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
      <audio ref={audioOpen} src={waitAudioGaveta} autoPlay />
      <audio ref={audioError} src={errroGaveta}  />
      <h1 className="text-3xl font-semibold mx-8 text-center">
        Espera a que la gabeta indicada se abra e{" "}
        <span className="text-orange-500">introduce tu paquete</span>
      </h1>
      <div className="flex justify-center items-center h-[40vh] w-full max-w-5xl px-4">
      <div className="lockers-container grid gap-1 h-full w-[250px] bg-gray-400 border-4 border-gray-400">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-200 p-3"></div>
          ))}
        </div>
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
        <div className="lockers-container grid gap-1 h-full w-[250px] bg-gray-400 border-4 border-gray-400">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-200 p-3"></div>
          ))}
        </div>
      </div>

    
    </div>
  );
};

export default Step5;