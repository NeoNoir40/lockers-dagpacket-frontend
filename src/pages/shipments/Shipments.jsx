import { useEffect, useState, useRef } from "react";
import Step1 from "./shipment_steps/Step1";
import Step2 from "./shipment_steps/Step2";
import Step3 from "./shipment_steps/Step3";
import Step4 from "./shipment_steps/Step4";
import Step5 from "./shipment_steps/Step5";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { get } from "react-hook-form";

export default function Shipment() {
  const navigate = useNavigate();
  const { getGabetas } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [destinationCP, setDestinationCP] = useState("");
  const [senderCP, setSenderCP] = useState("");
  const [weight, setWeight] = useState("");
  const [packageType, setPackageType] = useState("sobre");
  const [shippingData, setShippingData] = useState({
    sender: { zipCode: "" },
    recipient: {},
    package: { weight: "", type: "", insured: false }, // Agrega un campo para seguro
    company: null,
  });




  const deleteLocalStorage = () => {
    localStorage.removeItem("orden");
    localStorage.removeItem("update_order");
    localStorage.removeItem("folio");
  };

  const { user } = useAuth();
  console.log(shippingData);

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const handleCPChange = (value) => {
    setDestinationCP(value);
    if (value === "00000") {
      navigate("/login");
    }
  };

  const handleSenderCPChange = (value) => {
    setSenderCP(value);
    if (value === "00000") {
      navigate("/login");
    }
  };

  const handleWeightChange = (value) => {
    setWeight(value);
    setShippingData((prev) => ({
      ...prev,
      package: { ...prev.package, weight: value },
    }));
  };

  const handlePackageTypeChange = (value) => {
    setPackageType(value);
    setShippingData((prev) => ({
      ...prev,
      package: {
        ...prev.package,
        package: "",
        type: value,
        height: value === "Sobre" ? 10 : prev.package.height, // Asignar 10 si es "sobre"
        width: value === "Sobre" ? 10 : prev.package.width, // Asignar 10 si es "sobre"
        length: value === "Sobre" ? 10 : prev.package.length, // Asignar 10 si es "sobre"
        weight: value === "Sobre" ? 1 : prev.package.weight, // Asignar 10 si es "sobre"
        value: value === "Sobre" ? 100 : prev.package.value, // Asignar 0 si es "sobre"
      },
    }));
  };

    // Define handlePackage to accept height, width, length, weight, and value
    const handlePackage = (type,height, width, length ) => {
      setShippingData((prev) => ({
        ...prev,
        package: {
          ...prev.package,
          type: type,
          height,
          width,
          length,
        },
      }));
    };

    const handleValue = (value) => {
      setShippingData((prev) => ({
        ...prev,
        package: {
          ...prev.package,
          value,
        },
      }));
    };

  const handleSenderDataChange = (data) => {
    setShippingData((prev) => ({
      ...prev,
      sender: data,
    }));
  };

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

  const handleCompanySelection = (company) => {
    setShippingData((prev) => ({
      ...prev,
      company,
    }));
  };

  useEffect(() => {
    // getGabetas();

    if (user) {
      setShippingData((prev) => ({
        ...prev,
        sender: {
          zipCode: user.locker_info.cp,
        },
      }));
    }
  }, []);


  

  return (
    <body className="overflow-hidden h-[100vh]">
      <header className="grid grid-cols-5 w-full h-16 ">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`flex justify-center items-center cursor-pointer ${
              currentStep === step
                ? `bg-orange-500`
                : `bg-gray-${100 + step * 100}`
            }`}
          >
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
      <main className="h-[50vw] w-[100vw] flex justify-center items-center bg-gray-50 overflow-hidden">
        <Link
          to="/"
          className="fixed top-16 left-4 z-40 w-1/6 mt-4 bg-gray-300 w-auto px-6 py-2 rounded-full cursor-pointer hover:bg-gray-400"
          onClick={deleteLocalStorage}
          type="button"
        >
          Cancelar
        </Link>
        {currentStep === 1 && (
          <Step1
            handleClick={handleStepChange}
            destinationCP={destinationCP}
            senderCP={senderCP}
            onCPChange={handleCPChange}
            handleWeightChange={handleWeightChange}
            handlePackage={handlePackageTypeChange}
            onSenderCPChange={handleSenderCPChange}
          />
        )}
        {currentStep === 2 && (
          <Step2
            weight={weight}
            handlePackage={handlePackage}
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
            senderCP={senderCP}
            shippingData={shippingData}
          />
        )}
        {currentStep === 4 && (
          <Step4
            shippingData={shippingData}
            handleClick={handleStepChange}
          />
        )}
        {currentStep === 5 && (
          <Step5
            shippingData={shippingData}
            handleStepChange={handleStepChange}
          />
        )}
      </main>
    </body>
  );
}
