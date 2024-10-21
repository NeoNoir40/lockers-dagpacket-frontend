import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import waitAudioGaveta from '../../../assets/voice/wait_for_open.mp3'
import errroGaveta from '../../../assets/voice/error_open_gaveta.mp3'
import "../../../assets/css/shipment/shipment.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import audioFinishProccess from '../../../assets/voice/process_finish.mp3'
import {updateSaturation} from '../../../../context/auth'
import { set } from "react-hook-form";

const api = import.meta.env.VITE_REACT_API_URL;

const Step5 = ({ handleClick, onWeightChange, shippingData }) => {
  const [isPackageInserted, setIsPackageInserted] = useState(false);
  const [openDoor, setOpenDoor] = useState(false);
  const audioFinish = useRef(null);
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
  const [idGabetaTest, setIdGabetaTest] = useState(null);
  const [pinTest, setPinTest] = useState('');
  const type_gabeta = localStorage.getItem("tipo_paquete");


  useEffect(() => {
    if(audioOpen.current){
      audioOpen.current.play();
    }
    setIdGabetaTest(type_gabeta === 'Sobre' ? '1' : '2');
    setPinTest(type_gabeta === 'Sobre' ? '2tb71kyR7Q' : 'ccgxTyknsr');
  

  }
  ,[]);

 
  console.log('type_Gaveta :',  type_gabeta);
  console.log('abriendo gabeta:',idGabetaTest);
  console.log('pin:',pinTest);

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
      const idgabetatest = type_gabeta === 'Sobre' ? '1' : '2';
      const pintest = type_gabeta === 'Sobre' ? '2tb71kyR7Q' : 'ccgxTyknsr';
      const token = localStorage.getItem("token");
      const shipment_idTest = localStorage.getItem("shipment_id");

      const response = await axios.patch(
        `${api}/gabeta/update-saturation`,
        {
          _id: _idgabeta,
          package:shipment_idTest,
          saturation: false,
          pin: pintest,
          email: email,
          nombre: name
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response);
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

        const idgabetatest = type_gabeta === 'Sobre' ? '1' : '2';
        const actionType = type_gabeta === 'Sobre' ? 'receiveLocker' : 'sendLocker'; // Define la acción basada en type_gabeta

        const token = localStorage.getItem("token");
        const openDoorResponse = await axios.post(
          `${api}/mqtt/`,
          {
            locker_id: locker_id,
            action: actionType,
            gabeta: idgabetatest,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Locker ID:", openDoorResponse);
        if (!openDoorResponse.data.error) {
          setOpenDoor(true);

  
          await Swal.fire({
            title: "Locker Abierto",
            text: `El locker se ha abierto correctamente.`,
            icon: "success",
            confirmButtonText: "OK",
          });

          if (audioFinish.current) {
            audioFinish.current.play();
          }
  
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
      const idgabetatest = type_gabeta === 'Sobre' ? '1' : '2';
      
      const token = localStorage.getItem("token");
      const checkDoorResponse = await axios.post(
        `${api}/mqtt/`,
        {
          locker_id: locker_id,
          action: "checkDoor",
          gabeta: idgabetatest,
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
           updateGabetaSaturation();
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
      <audio ref={audioFinish} src={audioFinishProccess} />
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