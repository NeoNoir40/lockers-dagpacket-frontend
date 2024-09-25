import { useState, useEffect } from "react";
import animationLoading from "../assets/icons/Cargando.svg";

const NO_QUOTES_ERROR = "No se encontraron cotizaciones.";
const LOADING_MESSAGE = "Cargando cotizaciones...";

export default function ShipmentServices({
  quote,
  handleClick,
  handleStep4,
  logoMap,
}) {
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
                className={`mb-4 p-4 border rounded-md shadow-lg cursor-pointer ${
                  selectedQuote?.idServicio === service.idServicio
                    ? "border-orange-400"
                    : ""
                }`}
              >
                <img
                  src={logo}
                  alt={`${service.proveedor} logo`}
                  className="h-12 mb-2"
                />
                <h2 className="font-bold">{service.proveedor}</h2>
                <p>Servicio: {service.nombre_servicio}</p>
                <p>Tiempo de entrega: {service.tiempo_de_entrega}</p>
                <p>Precio: ${service.precio}</p>
                <p>Kilos a cobrar: {service.kilos_a_cobrar}</p>
                <p>Zona: {service.zona}</p>
                <p>
                  Cobertura especial: {service.cobertura_especial === "FALSE" ? "No" : "Sí"}
                </p>
                <button
                  onClick={() => handleSelectQuote(service)}
                  className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-4"
                >
                  Seleccionar
                </button>
              </div>
            );
          }
        });
      }
    }

    return services.length > 0 ? services : <p>No se encontraron servicios disponibles.</p>;
  };

  if (loading) {
    return (
      <div className="w-full h-full">
        <img className="h-20 w-20 mx-auto" src={animationLoading} alt="Cargando" />
        <h1 className="text-xl text-orange-500">{LOADING_MESSAGE}</h1>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-lg">
      <h1 className="text-xl font-bold mb-4">Información de cotización</h1>
      <div className="grid grid-cols-4 gap-5">{renderServices()}</div>
      {provedorPrincipal && <p>Proveedor Principal: {provedorPrincipal}</p>} {/* Mostrar el proveedor principal */}
    </div>
  );
}
