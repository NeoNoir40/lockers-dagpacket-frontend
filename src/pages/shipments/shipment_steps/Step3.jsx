import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DhlLogo from "../../../assets/images/logos/dhl-logo.svg";
import FedexLogo from "../../../assets/images/logos/fedex-logo.svg";
import EstafetaLogo from "../../../assets/images/logos/estafeta-logo-png-transparent.png";
import PaqueteExLogo from "../../../assets/images/logos/Paquetexpress Logo Vector.svg";
import axios from "axios";
import ShipmentServices from "../../../components/ShipmentServices";
import ShipmentInfo from "../../../components/ShipmentInfo";
import UpdateShipmentInfo from "../../../components/updateShipmentInfo";
import Swal from "sweetalert2";
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
  { label: "Colonia", key: "colony", type: "text", id: "colony" },
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
  const { getGabetas ,gavetaAvailable} = useAuth();
  const [step1, setStep1] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [step3, setStep3] = useState(false);
  const [step4, setStep4] = useState(false);
  const [step5, setStep5] = useState(false);

  const cp = localStorage.getItem("zipCode");
  const [isConfirmedPackage, setIsConfirmedPackage] = useState(false);
  const [goToDetails, setGoToDetails] = useState(false);
  const [isConfirmedQuote, setIsConfirmedQuote] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [activeFormSender, setActiveFormSender] = useState(true);
  const [activeFormRecipient, setActiveFormRecipient] = useState(false);
  const order = localStorage.getItem("update_order");

  const [update_order, setUpdateOrder] = useState(false);
  const [data, setData] = useState({
    pais_origen: "MX",
    pais_destino: "MX",
    cp_origen: cp, // Inicialmente vacío, se actualizará con los datos del paquete
    cp_destino:
      localStorage.getItem("zipCodeReceiver") || shippingData.recipient.zipCode, // Se actualizará con el código postal del destinatario
    alto: 10,
    ancho: 10,
    largo: 10,
    peso: 2,
    seguro: shippingData.package.insurance || false,
    valor_declarado: 250,
  });
  useEffect(() => {
    console.log("Order:", order);
    if (order) {
      setUpdateOrder(true);
      setStep1(false);
      setStep3(true);
      fetchQuote(data);
      console.log("Datos enviados:", data);
    }else{
      setUpdateOrder(false);

    }
  }, []);

    const navigate = useNavigate(); // Inicializa useNavigate
  
    useEffect(() => {
      if (gavetaAvailable === null || gavetaAvailable === false) {
        const title = gavetaAvailable === null ? "Gaveta no asignada" : "Sin Gavetas Disponibles por el momento";
        
        let timerInterval;
  
        Swal.fire({
          icon: "error",
          title: title,
          html: "Se cerrara en <b></b>. milisegundos.",
          timer: 3000,
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

  const [quote, setQuote] = useState(null);

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
    if (
      shippingData.package.description === "" ||
      !shippingData.package.description
    ) {
      Swal.fire({
        title: "Error",
        text: "Por favor, ingrese una descripción del paquete",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }
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
      cp_destino:
        localStorage.getItem("zipCodeReceiver") ||
        shippingData.recipient.zipCode,
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
    const errors = []; // Array para almacenar los campos que no se llenaron

    // Comprobar cada campo del remitente
    if (!shippingData.sender.nameSender) {
      errors.push("Nombre del Remitente");
    }
    if (!shippingData.sender.phoneSender) {
      errors.push("Teléfono del Remitente");
    }
    if (!shippingData.sender.emailSender) {
      errors.push("Email del Remitente");
    }

    // Si hay errores, mostrar un mensaje de error
    if (errors.length > 0) {
      Swal.fire({
        title: "Error",
        text: `Por favor, complete los siguientes campos: ${errors.join(", ")}`,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    setActiveFormSender(false);
    setActiveFormRecipient(true);
  };

  const handleFormRecipient = () => {
    const errors = []; // Array para almacenar los campos que no se llenaron

    // Validar cada campo y agregar el mensaje correspondiente al array de errores
    if (!shippingData.recipient.name) {
      errors.push("Nombre");
    }
    if (!shippingData.recipient.phone) {
      errors.push("Teléfono");
    } else if (!/^[0-9]{10}$/.test(shippingData.recipient.phone)) {
      errors.push("Teléfono debe tener 10 dígitos.");
    }

    if (!shippingData.recipient.email) {
      errors.push("Correo electrónico");
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.recipient.email)
    ) {
      errors.push("Correo electrónico no tiene un formato válido.");
    }

    if (!shippingData.recipient.country) {
      errors.push("País");
    }
    if (!shippingData.recipient.zipCode) {
      errors.push("Código postal");
    } else if (!/^[0-9]{5}$/.test(shippingData.recipient.zipCode)) {
      errors.push("Código postal debe tener 5 dígitos.");
    }

    if (!shippingData.recipient.state) {
      errors.push("Estado");
    }
    if (!shippingData.recipient.city) {
      errors.push("Ciudad");
    }
    if (!shippingData.recipient.colony) {
      errors.push("Colonia");
    }
    if (!shippingData.recipient.street) {
      errors.push("Calle");
    }
    if (!shippingData.recipient.externalNumber) {
      errors.push("Número exterior");
    }
    if (!shippingData.recipient.address) {
      errors.push("Dirección");
    }

    // Si hay errores, muestra el mensaje de error
    if (errors.length > 0) {
      Swal.fire({
        title: "Error",
        text: `Por favor, complete los siguientes campos: ${errors.join(", ")}`,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

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
          <ShipmentInfo data={shippingData} handleClick={handleClick} />
        </>
      )}
      
      {shippingData.company != null && update_order !== false && (
  <>
    <UpdateShipmentInfo
      handleClick={handleClick}
      shipment_info={shippingData}
      handleSenderDataChange={handleSenderDataChange}
      handleRecipientDataChange={handleRecipientDataChange}
    />
  </>
)}
   
{update_order ? (
  <>
  </>

):(<>
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
          className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-6"
        >
          Continuar
        </button>
      ) : (
        <button
          onClick={editFormSender}
          className="bg-gray-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-6"
        >
          Editar
        </button>
      )}
      {activeFormRecipient && (
        <button
          onClick={handleFormRecipient}
          className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-6"
        >
          Continuar
        </button>
      )}

      {!activeFormRecipient && !activeFormSender && (
        <button
          onClick={handleEditFormRecipient}
          className="bg-gray-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-6"
        >
          Editar
        </button>
      )}

      {!activeFormRecipient && !activeFormSender ? (
        <div className=" absolute  left-[77%] text-center text-md bg-white p-5 shadow-md rounded-xl">
          <h2>Presione para continuar a la siguiente pantalla</h2>
          <button
            onClick={handleStep5}
            className="bg-orange-500  text-white text-xl font-semibold px-6 py-3 rounded-lg "
          >
            Continuar
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  </>
)}
</>)}
      
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
              className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-full"
            >
              Confirmar
            </button>
            <button
              onClick={handleEdit}
              className="bg-gray-500 text-white text-xl font-semibold px-6 py-3 rounded-full"
            >
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
            className="bg-orange-500 text-white text-xl font-semibold px-6 py-3  mt-6 rounded-full"
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}
