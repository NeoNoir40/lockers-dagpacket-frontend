import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const api = import.meta.env.VITE_REACT_API_URL; // Obtener la URL desde el .env
import { useAuth } from "../../../../context/AuthContext";
import "../../../assets/css/shipment/shipment.css";

const Step2 = ({ handleClick, onWeightChange, handlePackage }) => {
  const [detectedWeight, setDetectedWeight] = useState("");
  const [openDoor, setOpenDoor] = useState(false);
  const [weight, setWeight] = useState("");
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const id_locker = localStorage.getItem("locker_id");
  const scale = localStorage.getItem("Pesa");

  const handleContinue = () => {
    handleClick(3);
  };

  // useEffect(() => {
  //   // Datos simulados
  //   const packageType = "Paquete"; // Tipo de paquete
  //   const simulatedHeight = 30.10; // Altura en cm
  //   const simulatedWidth = 20.50; // Ancho en cm
  //   const simulatedLength = 10.20; // Longitud en cm
  //   const simulatedWeight = 5.30; // Peso en kg

  //   // Llama a handlePackage con datos simulados
  //   handlePackage(packageType,simulatedHeight, simulatedWidth, simulatedLength, simulatedWeight);
  //   setDetectedWeight(simulatedWeight); // Establecer el peso detectado para propósitos de prueba
  //   setShowContinueButton(true); // Mostrar el botón continuar
  // }, []); // Ejecutar una vez al montar el componente

  console.log("Locker ID:", id_locker);
  console.log("Pesa:", scale);

  const { gavetaAvailable } = useAuth();

  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    if (gavetaAvailable === null || gavetaAvailable === false) {
      const title =
        gavetaAvailable === null
          ? "Gaveta no asignada"
          : "Sin Gavetas Disponibles por el momento";

      let timerInterval;

      Swal.fire({
        icon: "error",
        title: title,
        html: "Se cerrara en <b></b>. milisegundos.",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false, // Deshabilita el clic fuera del modal
        allowEscapeKey: false, // Deshabilita la tecla ESC
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup().querySelector("b");
          timerInterval = setInterval(() => {
            timer.textContent = `${Swal.getTimerLeft()}`; // Actualiza el tiempo restante
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("I was closed by the timer");
          navigate("/"); // Redirige a la ruta principal
        }
      });
    }
  }, []);

  const getMesaure = async () => {
    try {
      const TOKEN = localStorage.getItem("token");
      const measureResponse = await axios.post(
        `${api}/mqtt`,
        {
          locker_id: id_locker,
          action: "getMeasure",
          gabeta: scale,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!measureResponse.data.error) {
  const message = measureResponse.data.message;
  const medidas = message.split("sendMeasure: ")[1].split(",");
  
  // Extraer ancho, largo, alto y convertirlos a números
  const ancho = parseFloat(medidas[0]);
  const largo = parseFloat(medidas[1]);
  const alto = parseFloat(medidas[2]);
  const value = 1000
  // Suponiendo que 'weight' está disponible en la respuesta o en alguna otra parte del código
  const weight = detectedWeight; // Peso detectado
  console.log("Peso detectado:", weight); // Ejemplo: 5.30
  const paqueteTipo = "Paquete"; // Tipo de paquete

  console.log("Ancho:", ancho); // Ejemplo: 22.59
  console.log("Largo:", largo); // Ejemplo: 29.43
  console.log("Alto:", alto); // Ejemplo: 25.55


  // Llama a handlePackage con las medidas detectadas y el peso convertido
  handlePackage(paqueteTipo,alto,ancho,largo,weight );
  handleClick(3);
}
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: `No se pudo obtener la medida.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    if (loading) {
      Swal.fire({
        title: "Cargando...",
        text: "Por favor espera mientras se completa el proceso.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    } 
  }, [loading]);

  const handleOpenDoor = async () => {
    setLoading(true);
    try {
      const TOKEN = localStorage.getItem("token");
      // Abrir el locker
      const openDoorResponse = await axios.post(
        `${api}/mqtt`,
        {
          locker_id: id_locker,
          action: "sendLocker",
          gabeta: scale,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!openDoorResponse.data.error) {
        setOpenDoor(true);
        // Mostrar alerta de éxito de apertura
        Swal.fire({
          title: "Locker Abierto",
          text: `El locker se ha abierto correctamente.`,
          icon: "success",
          confirmButtonText: "OK",
        });
        // Iniciar polling para obtener el peso hasta que la puerta esté cerrada
        const pollWeight = async () => {
          const weightResponse = await axios.post(
            `${api}/mqtt`,
            {
              locker_id: id_locker,
              action: "getWeight",
              gabeta: scale,
            },
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
            }
          );

          if (!weightResponse.data.error) {
            const message = weightResponse.data.message; // Ajusta según tu API
            const [weightData, doorStatus] = message
              .split(":")[1]
              .trim()
              .split(","); // Obtener peso y estado de puerta
            const weight = weightData.trim();
            const isDoorClosed = doorStatus === "0"; // Puerta cerrada si es "0"

            if (isDoorClosed) {
              // Puerta cerrada: mostrar el peso y detener el polling
              setWeight(weight);
              onWeightChange(weight);
              console.log("Peso detectado:", weight);
              getMesaure();
            } else {
              // Si la puerta está abierta, repetir la consulta
              Swal.fire({
                title: "Locker Abierto",
                text: `La puerta del locker está abierta.`,
                icon: "info",
                confirmButtonText: "OK",
              });
              setTimeout(pollWeight, 2000); // Reintentar en 2 segundos (puedes ajustar el tiempo)
            }
          } else {
            Swal.fire({
              title: "Error",
              text: `No se pudo pesar el paquete.`,
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        };
        pollWeight(); // Iniciar el polling
      } else {
        Swal.fire({
          title: "Error",
          text: `No se pudo abrir el locker.`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      Swal.fire({
        title: "Error",
        text: `No se pudo abrir el locker.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }finally{
      setLoading(false);
    }
  };


  // Determina si el botón "Continuar" debe ser visible
  return (
    <div className="step2 flex flex-col justify-center items-center gap-8 bg-white p-10 rounded-md shadow-md">
      <h1 className="text-3xl font-semibold mx-8 text-center">
        Espera a que el locker indicado se abra e
        <span className="text-orange-500"> introduce tu paquete</span> para
        pesarlo
      </h1>
      <div className="flex justify-center items-center h-[40vh] w-full max-w-5xl px-4">
      <div className="lockers-container grid gap-1 h-full w-[250px] bg-gray-400 border-4 border-gray-400">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-200 p-3"></div>
          ))}
        </div>
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
        <div className="lockers-container grid gap-1 h-full w-[250px] bg-gray-400 border-4 border-gray-400">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-200 p-3"></div>
          ))}
        </div>
      </div>

      <button
        onClick={handleOpenDoor}
        className="px-10 py-4 bg-orange-500 text-white text-bold text-xl rounded-full"
        id="startWeighingButton"
        style={{
          display: showContinueButton ? "none" : "block",
        }}
      >
        Iniciar pesado
      </button>
      <button
        id="continueButton"
        className="px-8 py-2 bg-orange-500 text-white text-bold text-xl rounded-full"
        type="button"
        onClick={handleContinue}
        style={{
          display: showContinueButton ? "block" : "none",
        }}
      >
        Iniciar pesado test
      </button>
    </div>
  );
};

export default Step2;
