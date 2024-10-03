import { useState, useEffect } from "react";
import DhlLogo from "../../../assets/images/logos/dhl-logo.svg";
import FedexLogo from "../../../assets/images/logos/fedex-logo.svg";
import EstafetaLogo from "../../../assets/images/logos/estafeta-logo-png-transparent.png";
import PaqueteExLogo from "../../../assets/images/logos/Paquetexpress Logo Vector.svg";
import axios from "axios";
import ShipmentServices from "../../../components/ShipmentServices";
import ShipmentInfo from "../../../components/ShipmentInfo";
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
  { label: "Nombre", key: "name", type: "text" },
  { label: "Colonia", key: "colony", type: "text" },
  { label: "Calle", key: "street", type: "text" },
  { label: "Ciudad", key: "city", type: "text" },
  { label: "Estado", key: "state", type: "text" },
  { label: "País", key: "country", type: "text" },
  { label: "Teléfono", key: "phone", type: "tel" },
  { label: "Correo Electrónico", key: "email", type: "email" },
];

const packageFields = [
  { label: "Descripción", key: "description", type: "text" },
  { label: "Seguro", key: "insurance", type: "checkbox" },
];



const PackageFormSection = ({ title, data, onChange, disabled }) => (
  <div className="w-full bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-1 gap-5">
      {packageFields.map(({ label, key }) => (
        <div key={key} className="flex items-center">
          {key === "insurance" ? (
            <>
              <label htmlFor="insurance-checkbox" className="mr-2 text-orange-500 font-normal">
                {label}
              </label>
              <input
                type="checkbox"
                id="insurance-checkbox"
                checked={data[key] || false}
                onChange={(e) => onChange({ ...data, [key]: e.target.checked })}
                disabled={disabled}
              />
            </>
          ) : (
            <InputField
              label={label}
              value={data[key]}
              type="text"
              onChange={(e) => onChange({ ...data, [key]: e.target.value })}
              disabled={disabled}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);


const InputField = ({ label, value, onChange, disabled, type }) => (
  <input
    type={type}
    placeholder={label}
    value={value || ""}
    onChange={onChange}
    disabled={disabled}
    className={`border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
      disabled ? "bg-gray-200 cursor-not-allowed" : ""
    }`}
    
  />
  
);

const FormSection = ({ title, data, onChange, disabled }) => (
  <div className=" bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-1 gap-4">
      {inputFields.map(({ label, key }) => (
        <InputField
          key={key}
          label={label}
          value={data[key]}
          onChange={(e) => onChange({ ...data, [key]: e.target.value })}
          disabled={disabled}
        />
      ))}
    </div>
  </div>
);

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
  const {getGabetas} = useAuth();

  const [step1, setStep1] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [step3, setStep3] = useState(false);
  const [step4, setStep4] = useState(false);
  const [step5, setStep5] = useState(false);
  //
  const cp = localStorage.getItem('zipCode')
  const [isConfirmedPackage, setIsConfirmedPackage] = useState(false);
  const [goToDetails, setGoToDetails] = useState(false);
  const [isConfirmedQuote, setIsConfirmedQuote] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (key) => {
    if (key === 'C') {
      setInputValue(""); // Limpiar el input
    } else if (key === 'OK') {
      // Aquí puedes manejar el valor ingresado
      console.log("Valor ingresado:", inputValue);
    } else {
      setInputValue((prev) => prev + key); // Agregar el número al input
    }
  };
  
  const [quote, setQuote] = useState(null);
  const [data, setData] = useState({
    pais_origen: "MX",
    pais_destino: "MX",
    cp_origen: "", // Inicialmente vacío, se actualizará con los datos del paquete
    cp_destino: "", // Se actualizará con el código postal del destinatario
    alto: 0,
    ancho: 0,
    largo: 0,
    peso: 0,
    seguro: 0,
    valor_declarado: 0,
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
      alto: shippingData.package.height,
      ancho: shippingData.package.width,
      largo: shippingData.package.length,
      peso: shippingData.package.weight,
      seguro: shippingData.package.insurance || false,
      valor_declarado: shippingData.package.value,
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
      const response = await axios.post(
        `${api}/shipping/quote`,
        dataToSend,{
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
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
            Continuar 4
          </button>
        </>
      )}
      {step4 && (
        <>
          <div className="grid grid-cols-2 gap-10">
            <FormSection
              title="Datos del Remitente"
              data={shippingData.sender}
              onChange={handleSenderDataChange}
              disabled={false} // Habilitar inputs
            />
            <FormSection
              title="Datos del Destinatario"
              data={shippingData.recipient}
              onChange={handleRecipientDataChange}
              disabled={false} // Habilitar inputs
            />
            <button
              onClick={handleStep5}
              className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-6">
              Continuar 4
            </button>
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
