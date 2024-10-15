import React, { useState, useEffect,useRef } from "react";
import Lottie from "lottie-react";
import animtationQr from "../../assets/lotties/js/qrscan.json";
import animationLocker from "../../assets/lotties/js/locker.json";
import { recolectGabeta,logGaveta } from "../../../context/auth";
import axios from 'axios'
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert
import Audio from '../../assets/voice/recibir_paquete.mp3'
import { Link } from "react-router-dom";
import "../../assets/css/shipment/shipment.css";
const api = import.meta.env.VITE_REACT_API_URL; // Obtener la URL desde el .env
const locker_id = localStorage.getItem("locker_id");
const gabeta_id = localStorage.getItem("idGabeta");
const TOKEN = localStorage.getItem("token");
const id_locker = localStorage.getItem("id_locker");
const userAgent = localStorage.getItem("userAgent");

export default function Recolect() {
  const audioRef = useRef(null); // Añadir referencia para el audio

  const [currentStep, setCurrentStep] = useState(1);
  const [gaveta, setGaveta] = useState([]);
  const [doorOpenAlertShown, setDoorOpenAlertShown] = useState(false);


  const inputRef = useRef(null);

  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();


  const handleLogGaveta = async (action) => {
    const logData = {
      gabeta_id: gabeta_id,
      locker_id: id_locker,
      action: action,
      device: userAgent , // Solo añade delivery si existe
    };
    try {
      const logResponse = await logGaveta(logData);
      if (logResponse.success) {
        console.log(logData);
        Swal.fire({
          title: "Registro Exitoso",
          text: "La acción de la gaveta se ha registrado correctamente.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        console.error("Data:", logData);

        Swal.fire({
          title: "Error",
          text: "No se pudo registrar la acción de la gaveta.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error registrando la acción de la gaveta:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al registrar la acción de la gaveta.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleOpenDoor = async () => {
    console.log("Locker ID:", locker_id);
    console.log("Gaveta ID:", gaveta.id_gabeta);
    try {
      const openDoorResponse = await axios.post(
        `${api}/mqtt/`,
        {
          locker_id: locker_id,
          action: "receiveLocker",
          gabeta: gaveta.id_gabeta,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!openDoorResponse.data.error) {
        Swal.fire({
          title: "Locker Abierto",
          text: `El locker se ha abierto correctamente.`,
          icon: "success",
          confirmButtonText: "OK",
        });
        // Llama a la función de log al abrir la gaveta
        await handleLogGaveta("Recibir paquete");
        await handleCheckStatusDoor();

      } else {
        Swal.fire({
          title: "Error",
          text: `No se pudo abrir el Locker.`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: `No se pudo abrir el Locker.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleCheckStatusDoor = async () => {
    try {
      const checkDoorResponse = await axios.post(
        `${api}/mqtt/`,
        {
          locker_id: locker_id,
          action: "checkDoor",
          gabeta: gaveta.id_gabeta,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
  
      if (checkDoorResponse.data.error) {
        console.error("Error al verificar el estado de la puerta:", checkDoorResponse.data);
        return;
      }
  
      const doorStatusRaw = checkDoorResponse.data.message;
      const doorStatus = parseInt(doorStatusRaw.split(': ')[1]);
  
      if (doorStatus === 1 && !doorOpenAlertShown) {
        // Puerta abierta y aún no hemos mostrado la alerta
        setDoorOpenAlertShown(true);
        Swal.fire({
          title: "Puerta Abierta",
          text: "Por favor, cierre la puerta de la gaveta cuando ingrese su paquete.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        // Programar la próxima verificación
        setTimeout(handleCheckStatusDoor, 5000);
      } else if (doorStatus === 0) {
        // Puerta cerrada
        setDoorOpenAlertShown(false);
        Swal.fire({
          title: "Gracias",
          text: "La puerta de la gaveta está correctamente cerrada.",
          icon: "success",
          confirmButtonText: "OK",
        });
        // Aquí puedes agregar lógica adicional para pasar al siguiente paso si es necesario
      } else if (doorStatus === 1 && doorOpenAlertShown) {
        // Puerta sigue abierta, pero ya mostramos la alerta. Seguimos verificando.
        setTimeout(handleCheckStatusDoor, 5000);
      }
    } catch (error) {
      console.error("Error al verificar el estado de la puerta:", error);
    }
  };


  
  const onSubmit = async (data) => {
    try {
      const response = await recolectGabeta(data);
      console.log(response);
      if (response.success) {
        setCurrentStep(2);
        setGaveta(response.data);
      }else{
        Swal.fire({
          title: "Error",
          text: response.message,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (e) {
      console.log(e);
    }
  };


  useEffect(() => {
    if (currentStep === 1 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentStep]);

useEffect(() => {
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Enfocar el input inicialmente
  focusInput();

  // Agregar event listener para enfocar el input cuando la ventana gane el foco
  window.addEventListener('focus', focusInput);

  // Limpiar el event listener cuando el componente se desmonte
  return () => {
    window.removeEventListener('focus', focusInput);
  };
}, []);

  // Effect to show notification after 5 seconds in step 2
  useEffect(() => {
    if (currentStep === 2) {
     handleOpenDoor()
     if (audioRef.current) {
      audioRef.current.play(); // Reproduce el audio en step2
    }
    }
  }, [currentStep]);

  // console.log(gaveta.id_gabeta);

  return (
    <body className="overflow-hidden">
      <header className="grid grid-cols-3 w-full h-16 ">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`flex justify-center items-center cursor-pointer ${
              currentStep === step
                ? `bg-orange-500`
                : `bg-gray-${100 + step * 100}`
            }`}>
            <h1 className="text-xl">{`${step}. ${
              step === 1
                ? "Escanea tu código QR"
                : step === 2
                ? "Recoge tu paquete"
                : step === 3
                ? "Finalizar"
                : ""
            }`}</h1>
          </div>
        ))}
      </header>
      <main className="h-[44vw] w-[100vw] flex justify-center items-center bg-gray-100 overflow-hidden">
      <Link
          to="/"
          className="fixed top-16 left-4 z-40 w-1/6 mt-4 bg-gray-300 w-auto px-6 py-2 rounded-full cursor-pointer hover:bg-gray-400"
          type="button">
          Cancelar
        </Link>
        {currentStep === 1 && (
          <div className="flex flex-col items-center gap-10">
            <Lottie
              animationData={animtationQr}
              loop
              autoplay
              style={{ width: "60%" }}
            />
            <h1 className="text-4xl font-semibold mx-8 text-center ">
              Escanea tu <span className="text-orange-500">Código QR</span>
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
            <input
  className="  position-absolute"
  type="text"
  {...register("pin")}
  ref={(e) => {
    register("pin").ref(e);
    inputRef.current = e;
  }}
/>
            </form>
          </div>
        )}
        {currentStep === 2 && (
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
            <audio ref={audioRef}>
              <source src={Audio} type="audio/mp3" />
            </audio>
          </div>
        )}
        {currentStep === 3 && (
          <div className="step3 flex flex-col justify-center items-center gap-16 w-[100vw] absolute h-full ">
            <Lottie
              animationData={animationLocker}
              loop
              autoplay
              background="transparent"
              speed={1.5}
              style={{ width: 300, height: 300 }}
            />
            <h1 className="text-4xl font-semibold mx-8 text-center">
              Asegúrate de que el locker esté{" "}
              <span className="text-orange-500">correctamente cerrado</span>
            </h1>
            
          </div>
          
        )}
      </main>
    </body>
  );
}
