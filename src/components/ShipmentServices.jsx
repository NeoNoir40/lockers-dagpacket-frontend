import { useState, useEffect } from "react";
import animationLoading from "../assets/icons/Cargando.svg";

export default function ShipmentServices({
  quote,
  handleClick,
  handleStep4,
  logoMap,
}) {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (quote) {
      setLoading(false);
      if (!quote || Object.keys(quote).length === 0) {
        setError("No se encontraron cotizaciones.");
      }
    } else {
      setLoading(true);
    }
  }, [quote]);

  const handleSelectQuote = (quote) => {
    setSelectedQuote(quote);
    handleClick(quote);
    handleStep4(); // Llama a la función para continuar
  };

  // Mapea los datos de paqueterías
  const renderServices = () => {
    const services = [];

    for (const provider in quote) {
      const providerData = quote[provider];

      if (providerData.success && providerData.data.paqueterias.length > 0) {
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
                }`}>
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
                  Cobertura especial:{" "}
                  {service.cobertura_especial === "FALSE" ? "No" : "Sí"}
                </p>
                <button
                  onClick={() => handleSelectQuote(service)}
                  className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-4">
                  Seleccionar
                </button>
              </div>
            );
          }
        });
      }
    }

    if (services.length === 0) {
      return <p>No se encontraron servicios disponibles.</p>;
    }

    return services;
  };

  if (loading) {
    return (
      <div className="w-full h-full">
        <img className="h-20 w-20 mx-auto" src={animationLoading} alt="Cargando" />
        <h1 className="text-xl text-orange-500">Cargando cotizaciones...</h1>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div className="p-4 bg-white rounded-md shadow-lg">
        <h1 className="text-xl font-bold mb-4">Información de cotización</h1>
        <div className="grid grid-cols-4 gap-5">{renderServices()}</div>
      </div>
      {/* Botón "Continuar" ya no es necesario aquí */}
    </>
  );
}
