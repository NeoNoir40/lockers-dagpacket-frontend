import { useState, useEffect, useRef } from "react";
import animationLoading from "../assets/icons/loading.mp4";
import loadingAudio from '../assets/voice/loading.mp3'
import { useNavigate } from "react-router-dom";
import AudioService from '../assets/voice/select_quote.mp3'
import { useAuth } from "../../context/AuthContext";
const NO_QUOTES_ERROR = "No se encontraron cotizaciones.";
const LOADING_MESSAGE = "Cargando cotizaciones...";

export default function ShipmentServices({
  quote,
  handleClick,
  handleStep4,
  logoMap,
}) {

  const {  gavetaAvailable} = useAuth();

  const navigate = useNavigate(); // Inicializa useNavigate
  
  useEffect(() => {
    if (gavetaAvailable === null || gavetaAvailable === false) {
      const title = gavetaAvailable === null ? "Gaveta no asignada" : "Sin Gavetas Disponibles por el momento";
      
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
        }
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("I was closed by the timer");
          navigate('/'); // Redirige a la ruta principal

        }
      });
    }
  }, []); 


  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const audioLoading = useRef(null);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [provedorPrincipal, setProvedorPrincipal] = useState(null); // Estado para el proveedor principal
  useEffect(() => {
    if (quote) {
      setLoading(false);
      if (Object.keys(quote).length === 0) {
        setError(NO_QUOTES_ERROR);
      } else {
        setError(null); // Clear any previous error
      }
    } else {
      setLoading(true);
    }
  }, [quote]);


  useEffect(() => {
    if (loading && videoRef.current && audioRef.current && audioLoading.current) {

      videoRef.current.play().catch((error) => {
        console.error("Error al reproducir video:", error);
      });

      audioLoading.current.play().catch((error) => {
        console.error("Error al reproducir audio:", error);
      });

      audioRef.current.stop()

  
    }else if(!loading && audioRef.current){
      audioRef.current.play().catch((error) => {
        console.error("Error al reproducir audio:", error);
      });
    }
  }, [loading]);

  const handleSelectQuote = (service) => {
    setSelectedQuote(service);
    handleClick(service);

    // Extraer el proveedor principal de la cotización
    for (const provider in quote) {
      const providerData = quote[provider];
      if (providerData.success && providerData.data.paqueterias) {
        providerData.data.paqueterias.forEach((s) => {
          if (s.idServicio === service.idServicio) {
            setProvedorPrincipal(provider); // Guardar el proveedor principal
            localStorage.setItem("provedorPrincipal", provider); // Guardar el proveedor principal en localStorage
          }
        });
      }
    }

    handleStep4(); // Call function to proceed to the next step
  };

  const renderServices = () => {
    const services = [];

    for (const provider in quote) {
      const providerData = quote[provider];
      if (providerData.success && providerData.data.paqueterias) {
        providerData.data.paqueterias.forEach((service) => {
          if (service.precio > 0) {
            const logo = logoMap[service.proveedor] || "";
            services.push(
              <div
                key={service.idServicio}
                className={`mb-4 p-4 border rounded-md shadow-lg cursor-pointer  
                  ${
                    selectedQuote?.idServicio === service.idServicio
                      ? "border-orange-400"
                      : ""
                  }`}
              >
                <img
                  src={logo}
                  alt={`${service.proveedor} logo`}
                  className="h-8 mb-2"
                />
                <h2 className="font-bold">{service.proveedor}</h2>
                <p>Servicio: {service.nombre_servicio}</p>
                <p>Tiempo de entrega: {service.tiempo_de_entrega}</p>
                <p>Precio: ${service.precio}</p>
                <p>Kilos a cobrar: {service.kilos_a_cobrar}</p>
                <p>Zona: {service.zona}</p>
                <p>
                  Cobertura especial:{" "}
                  {service.cobertura_especial === "FALSE" ? "No" : "Sí"}
                </p>
                <button
                  onClick={() => handleSelectQuote(service)}
                  className="bg-orange-500 text-white text-lg font-semibold px-6 py-3 rounded-lg mt-4"
                >
                  Seleccionar
                </button>
              </div>
            );
          }
        });
      }
    }

    return services.length > 0 ? (
      services
    ) : (
      <p>No se encontraron servicios disponibles.</p>
    );
  };

  if (loading) {
    return (
      <div className="w-full h-full">
          <video
            ref={videoRef}
            src={animationLoading}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full"
          />
          <audio
            ref={audioLoading}
            src={loadingAudio}
            type="audio/mp3"
            autoPlay
          />
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-lg mt-10">
      <h1 className="text-xl font-bold mb-4">Información de cotización</h1>
      <audio
        ref={audioRef}
        src={AudioService}
        type="audio/mp3"
        autoPlay
      />
      <div className="flex flex-wrap gap-2  items-center justify-center">
        {renderServices()}
      </div>
      {provedorPrincipal && <p>Proveedor Principal: {provedorPrincipal}</p>}{" "}
      {/* Mostrar el proveedor principal */}
    </div>
  );
}
