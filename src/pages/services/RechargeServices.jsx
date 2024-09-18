import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Step1 from "./RechargeServicesSteps/Step1";
import MobileServices from "../../components/MobileServices";

export default function RechargeServices() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null); // Estado para almacenar el servicio seleccionado
  const [service, setService] = useState(null); // Estado para almacenar los servicios de la API
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para almacenar el producto seleccionado

  // Función para cambiar de paso
  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  // Función que maneja la selección de un servicio
  const handleServiceSelect = (serviceType) => {
    setSelectedService(serviceType); // Actualiza el servicio seleccionado
    setCurrentStep(2); // Cambia al siguiente paso (Opciones)
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product); // Actualiza el producto seleccionado
    setCurrentStep(3); // Cambia al siguiente paso (Pago)
  };
  // Función para obtener los servicios de la API
  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/emida/products"
      );
      setService(response.data); // Guarda la respuesta de la API
      console.log("Servicios obtenidos:", response.data); // Aquí puedes ver los datos de la API
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Llamar a la función fetchServices cuando el componente se monta
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <>
      <header className="grid grid-cols-4 w-full h-16">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`flex justify-center items-center cursor-pointer ${
              currentStep === step
                ? `bg-orange-500 text-white`
                : `bg-gray-${100 + step * 100}`
            }`}>
            <h1 className="text-xl">{`${step}. ${
              step === 1
                ? "Tipo de servicio"
                : step === 2
                ? "Opciones"
                : step === 3
                ? "Pago"
                : "Resumen"
            }`}</h1>
          </div>
        ))}
      </header>
      <main className="min-h-screen bg-gray-100 w-[100vw] flex justify-center items-center">
        <Link
          to="/"
          className="fixed top-16 left-4 z-40 w-1/6 mt-4 bg-gray-300 px-6 py-2 rounded-full cursor-pointer hover:bg-gray-400">
          Cancelar
        </Link>
        {/* Renderiza el contenido de acuerdo al paso actual */}
        {currentStep === 1 && <Step1 onServiceSelect={handleServiceSelect} />}
        {currentStep === 2 && (
          <div>
            {selectedService === "recargas" && service ? (
              <MobileServices
                service={service}
                onSelectProduct={handleProductSelect}
              />
            ) : selectedService === "pagos" ? (
              <h1>Opciones de Pagos</h1>
            ) : (
              <h1>No se seleccionó un servicio</h1>
            )}
            <button onClick={() => setCurrentStep(3)}>Continuar al Pago</button>
          </div>
        )}
        {currentStep === 3 && (
          <div className="pb-[250px]">
            <div className="flex flex-col items-center justify-center bg-white rounded-md shadow-lg py-4 px-10 ">
              <h1 className="text-2xl font-normal m-5">
                Ingresa el numero para{" "}
                <span className="text-orange-500 font-semibold">{selectedProduct?.ProductName} </span>
              </h1>
              <img
                className="w-[50%] h-25 mx-auto"
                src={selectedProduct?.ReferenceParameters.Reference1.URLImage}
                alt={selectedProduct?.ProductName}
              />
              <input
                placeholder="000-000-0000"
                type="tel"
                className="px-5 py-4 w-3/4 rounded-md shadow-md m-5 text-3xl focus:border-orange-400 "
              />
              <p className="text-3xl font-normal">
                {selectedProduct?.Amount} {selectedProduct?.CurrencyCode}
              </p>
              <button
                className="bg-orange-500 px-5 py-4 w-3/4 rounded-md shadow-md m-5 text-white"
                onClick={() => setCurrentStep(4)}>
                Pagar
              </button>
            </div>
          </div>
        )}
        {currentStep === 4 && (
          <div>
            <h2>Resumen de la transacción para {selectedService}</h2>
            {/* Aquí puedes mostrar el resumen de la transacción */}
          </div>
        )}
      </main>
    </>
  );
}
