import { useState, useEffect } from "react";
import DhlLogo from "../../../assets/images/logos/dhl-logo.svg";
import FedexLogo from "../../../assets/images/logos/fedex-logo.svg";
import EstafetaLogo from "../../../assets/images/logos/estafeta-logo-png-transparent.png";
import PaqueteExLogo from "../../../assets/images/logos/Paquetexpress Logo Vector.svg";
import axios from "axios";
import ShipmentServices from "../../../components/ShipmentServices";
import ShipmentInfo from "../../../components/ShipmentInfo";

import {
  FormSection,
  InputField,
  SenderFormSection,
  PackageFormSection,
} from "../../../components/Shipment/FormSection";
import { useAuth } from "../../../../context/AuthContext";
const api = import.meta.env.VITE_REACT_API_URL; // Obtener la URL desde el .env

const logoMap = {
  Fedex: FedexLogo,
  Superenvios: "",
  "Paquete Express": PaqueteExLogo,
  DHL: DhlLogo,
  Estafeta: EstafetaLogo,
};

const inputFields = [
  { label: "Dirección", key: "address", type: "text", id: "1address" },
  { label: "Nombre", key: "name", type: "text", id: "1name" },
  { label: "Correo Electrónico", key: "email", type: "email", id: "8email" },
  { label: "Teléfono", key: "phone", type: "tel", id: "7phone" },
  { label: "País", key: "country", type: "text", id: "6country" },
  { label: "Código Postal", key: "zipCode", type: "text", id: "1zipCode" },
  { label: "Estado", key: "state", type: "text", id: "5state" },
  { label: "Ciudad", key: "city", type: "text", id: "4city" },
  { label: "Colonia", key: "colony", type: "text", id: "2colony" },
  { label: "Calle", key: "street", type: "text", id: "3street" },
  {
    label: "Número Exterior",
    key: "extNumber",
    type: "text",
    id: "9extNumber",
  },
  {
    label: "Número Interior",
    key: "intNumber",
    type: "text",
    id: "10intNumber",
  },
  { label: "Referencias", key: "references", type: "text", id: "11references" },
];

const inputFieldsSender = [
  { label: "Nombre", key: "nameSender", type: "text", id: "s1name" },
  { label: "Teléfono", key: "phoneSender", type: "tel", id: "s7phone" },
  {
    label: "Correo Electrónico",
    key: "emailSender",
    type: "email",
    id: "s8email",
  },
];

const packageFields = [
  { label: "Descripción", key: "description", type: "textarea" },
  { label: "Seguro", key: "insurance", type: "checkbox" },
];

export default function Step3({
  destinationCP,
  handleClick,
  handleSenderDataChange,
  handleRecipientDataChange,
  handleCompanySelection,
  shippingData,
  handlePackageDataChange,
}) {
  //Nuevos estados para el flujo de la cotización
  const { getGabetas } = useAuth();
  const [step1, setStep1] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [step3, setStep3] = useState(false);
  const [step4, setStep4] = useState(false);
  const [step5, setStep5] = useState(false);
  //
  const cp = localStorage.getItem("zipCode");
  const [isConfirmedPackage, setIsConfirmedPackage] = useState(false);
  const [goToDetails, setGoToDetails] = useState(false);
  const [isConfirmedQuote, setIsConfirmedQuote] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [activeFormSender, setActiveFormSender] = useState(true);
  const [activeFormRecipient, setActiveFormRecipient] = useState(false);

  const [quote, setQuote] = useState(null);
  const [data, setData] = useState({
    pais_origen: "MX",
    pais_destino: "MX",
    cp_origen: "", // Inicialmente vacío, se actualizará con los datos del paquete
    cp_destino: "", // Se actualizará con el código postal del destinatario
    alto: 10,
    ancho: 10,
    largo: 10,
    peso: 2,
    seguro: false,
    valor_declarado: 250,
  });

  useEffect(() => {
    if (destinationCP) {
      handleRecipientDataChange({
        ...shippingData.recipient,
        zipCode: destinationCP,
      });
    }
  }, [destinationCP]);

  // Para mostrar los datos del paquete en el formulario de confirmación

  const handleContinue = () => {
    getGabetas();
    setShowConfirmation(true);
    setStep1(false);
  };

  // Para mostrar los datos del paquete en el formulario de confirmación
  const handleConfirm = async () => {
    const updatedData = {
      pais_origen: "MX",
      pais_destino: "MX",
      cp_origen: cp,
      cp_destino: shippingData.recipient.zipCode,
      alto: 10,
      ancho: 10,
      largo: 10,
      peso: 1,
      seguro: shippingData.package.insurance || false,
      valor_declarado: 200,
    };

    setStep3(true);
    setData(updatedData);
    setShowConfirmation(false);
    setIsConfirmed(false);
    setIsConfirmedPackage(true);
    fetchQuote(updatedData);
    console.log("Click en confirmar");
  };

  const fetchQuote = async (dataToSend) => {
    try {
      const TOKEN = localStorage.getItem("token");
      const response = await axios.post(`${api}/shipping/quote`, dataToSend, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      console.log("Datos enviados:", dataToSend);
      console.log("Quote:", response.data);
      setQuote(response.data);
    } catch (error) {
      console.log("Error fetching quote:", error);
    }
  };

  const handleSubmit = () => {};

  const handleConfirmQuote = () => {
    setIsConfirmedQuote(true);
  };

  const handleEdit = () => {
    setShowConfirmation(false);
    setStep1(true);
  };

  const handleContinueStep = () => {
    handleClick(4);
  };

  const handleSelectQuote = (quote) => {
    setSelectedQuote(quote);
    console.log("Quote seleccionado:", quote);
    handleCompanySelection(quote);
  };

  const handleFormSender = () => {
    setActiveFormSender(false);
    setActiveFormRecipient(true);
  };

  const handleFormRecipient = () => {
    setActiveFormRecipient(false);
  };

  const handleEditFormRecipient = () => {
    setActiveFormRecipient(true);
  };

  const editFormSender = () => {
    setActiveFormSender(true);
    setActiveFormRecipient(false);
  };

  const handleStep5 = () => {
    setStep5(true);
    setStep4(false);
  };

  const handleStep4 = () => {
    setStep4(true);
    setStep3(false);
  };

  return (
    <div className="p-6 overflow-hidden">
      {step5 && (
        <>
          <ShipmentInfo data={shippingData} />
          <button
            onClick={handleContinueStep}
            className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-6">
            Continuar 5
          </button>
        </>
      )}
      {step4 && (
        <>
          <div className="grid grid-cols-2 gap-10">
            <SenderFormSection
              title="Datos del Remitente"
              inputFields={inputFieldsSender}
              data={shippingData.sender}
              onChange={handleSenderDataChange}
              disabled={false} // Habilitar inputs
              active={activeFormSender}
              activeRecipient={activeFormRecipient}
            />
            <FormSection
              title="Datos del Destinatario"
              inputFields={inputFields}
              data={shippingData.recipient}
              onChange={handleRecipientDataChange}
              disabled={false} // Habilitar inputs
              activeRecipient={activeFormRecipient}
            />
            {/* <button
              onClick={handleStep5}
              className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-6">
              Continuar 4
            </button> */}
            {activeFormSender ? (
              <button
                onClick={handleFormSender}
                className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-6">
                Continuar
              </button>
            ) : (
              <button
                onClick={editFormSender}
                className="bg-gray-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-6">
                Editar
              </button>
            )}
            {activeFormRecipient && (
              <button
                onClick={handleFormRecipient}
                className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-6">
                Continuar
              </button>
            )}

            {!activeFormRecipient && !activeFormSender && (
              <button
                onClick={handleEditFormRecipient}
                className="bg-gray-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-6">
                Editar
              </button>
            )}

            {!activeFormRecipient && !activeFormSender ? (
              <button
                onClick={handleStep5}
                className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-6">
                Continuar
              </button>
            ) : (
              <></>
            )}
          </div>
        </>
      )}
      {step3 && (
        <>
          <ShipmentServices
            handleClick={handleSelectQuote}
            quote={quote}
            handleStep4={handleStep4}
            logoMap={logoMap}
          />
        </>
      )}
      {showConfirmation && (
        <div>
          <h1 className="text-3xl font-semibold mb-6">Confirmar Datos</h1>
          <div className="flex gap-8">
            <PackageFormSection
              title="Datos del Paquete"
              data={shippingData.package}
              onChange={handlePackageDataChange}
              disabled={true} // Deshabilitar inputs
            />
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleConfirm}
              className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-full">
              Confirmar 2
            </button>
            <button
              onClick={handleEdit}
              className="bg-gray-500 text-white text-xl font-semibold px-6 py-3 rounded-full">
              Editar
            </button>
          </div>
        </div>
      )}
      {step1 && (
        <div>
          <div className="flex gap-8">
            <PackageFormSection
              packageFields={packageFields}
              title="Datos del Paquete"
              data={shippingData.package}
              onChange={handlePackageDataChange}
              disabled={false} // Habilitar inputs
            />
          </div>

          <button
            onClick={handleContinue}
            className="bg-orange-500 text-white text-xl font-semibold px-6 py-3  mt-6 rounded-full">
            Continuar 1
          </button>
        </div>
      )}
    </div>
  );
}
