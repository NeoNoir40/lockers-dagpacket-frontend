import { useState } from "react";
import Step1 from "./shipment_steps/Step1";
import Step2 from "./shipment_steps/Step2";
import Step3 from "./shipment_steps/Step3";
import Step4 from "./shipment_steps/Step4";
import Step5 from "./shipment_steps/Step5";
import { Link } from "react-router-dom";

export default function Shipment() {
  // Estado para el paso actual
  const [currentStep, setCurrentStep] = useState(1);

  // Estados para almacenar la información del usuario
  const [destinationCP, setDestinationCP] = useState("");
  const [weight, setWeight] = useState("");
  const [packageType, setPackageType] = useState("sobre");
  const [shippingData, setShippingData] = useState({
    sender: {},
    recipient: {},
    package: { weight: "", type: "" },
    company: null,
  });

  // Manejar el cambio de paso
  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  // Manejar el cambio del código postal
  const handleCPChange = (value) => {
    setDestinationCP(value);
    if (value === "00000") {
      window.location.href = "/login";
    }
  };

  // Manejar el cambio del peso
  const handleWeightChange = (value) => {
    setWeight(value);
    setShippingData((prev) => ({
      ...prev,
      package: { ...prev.package, weight: value }, // Actualizar el peso en package
    }));
  };

  const handlePackageTypeChange = (value) => {
    setPackageType(value);
    setShippingData((prev) => ({
      ...prev,
      package: { ...prev.package, type: value }, // Actualizar el tipo de paquete en package
    }));
  };

  // Manejar los datos del remitente
  const handleSenderDataChange = (data) => {
    setShippingData((prev) => ({
      ...prev,
      sender: data,
    }));
  };

  // Manejar los datos del destinatario
  const handleRecipientDataChange = (data) => {
    setShippingData((prev) => ({
      ...prev,
      recipient: data,
    }));
  };

  const handlePackageDataChange = (data) => {
    setShippingData((prev) => ({
      ...prev,
      package: data,
    }));
  };

  // Manejar la selección de la compañía de envío
  const handleCompanySelection = (company) => {
    setShippingData((prev) => ({
      ...prev,
      company,
    }));
  };

  return (
    <body className="overflow-hidden">
      <header className="grid grid-cols-5 w-full h-16 ">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`flex justify-center items-center cursor-pointer ${
              currentStep === step
                ? `bg-orange-500`
                : `bg-gray-${100 + step * 100}`
            }`}>
            <h1 className="text-xl">{`${step}. ${
              step === 1
                ? "CP de Destino"
                : step === 2
                ? "Pesa tu paquete"
                : step === 3
                ? "Elige tu paquetería"
                : step === 4
                ? "Checkout"
                : "Ingresa tu paquete"
            }`}</h1>
          </div>
        ))}
      </header>
      <main className="min-h-screen w-[100vw] flex justify-center items-center bg-gray-100 overflow-hidden">
        <Link
          to="/"
          className="fixed top-16 left-4 z-40 w-1/6 mt-4 bg-gray-300 w-auto px-6 py-2 rounded-full cursor-pointer hover:bg-gray-400"
          type="button">
          Cancelar
        </Link>
        {currentStep === 1 && (
          <Step1
            handleClick={handleStepChange}
            destinationCP={destinationCP}
            onCPChange={handleCPChange}
            handleWeightChange={handleWeightChange}
            handlePackage={handlePackageTypeChange}
          />
        )}
        {currentStep === 2 && (
          <Step2
            weight={weight}
            onWeightChange={handleWeightChange}
            handleClick={handleStepChange}
          />
        )}
        {currentStep === 3 && (
          <Step3
            handleClick={handleStepChange}
            handleSenderDataChange={handleSenderDataChange}
            handleRecipientDataChange={handleRecipientDataChange}
            handlePackageDataChange={handlePackageDataChange}
            handleCompanySelection={handleCompanySelection}
            handleStepChange={handleStepChange}
            destinationCP={destinationCP}
            shippingData={shippingData}
          />
        )}
        {currentStep === 4 && (
          <Step4
            shippingData={shippingData}
            handleStepChange={handleStepChange}
          />
        )}
        {currentStep === 5 && <Step5 handleStepChange={handleStepChange} />}
        {/* Añade más componentes para otros pasos aquí */}
      </main>
    </body>
  );
}
