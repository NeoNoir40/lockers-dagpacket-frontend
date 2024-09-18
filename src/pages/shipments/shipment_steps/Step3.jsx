import { useState, useEffect } from "react";
import DhlLogo from "../../../assets/images/logos/dhl-logo.svg";
import FedexLogo from "../../../assets/images/logos/fedex-logo.svg";
import EstafetaLogo from "../../../assets/images/logos/estafeta-logo-png-transparent.png";
import PaqueteExLogo from "../../../assets/images/logos/Paquetexpress Logo Vector.svg";
import axios from "axios";
import ShipmentServices from "../../../components/ShipmentServices";
import ShipmentInfo from "../../../components/ShipmentInfo";
const logoMap = {
  Fedex: FedexLogo,
  Superenvios: "",
  "Paquete Express": PaqueteExLogo,
  DHL: DhlLogo,
  Estafeta: EstafetaLogo,
};

const inputFields = [
  { label: "Nombre", key: "name", type: "text" },
  { label: "Colonia", key: "colony",  type: "text" },
  { label: "Calle", key: "street", type: "text" },
  { label: "Ciudad", key: "city", type: "text" },
  { label: "Estado", key: "state", type: "text" },
  { label: "País", key: "country", type: "text" },
  { label: "Teléfono", key: "phone", type: "tel" },
  { label: "Correo Electrónico", key: "email", type: "email" },
  { label: "Código Postal", key: "zipCode", type: "text" },
];

const packageFields = [
  { label: "Alto", key: "height", type: "number" },
  { label: "Ancho", key: "width" , type: "number"},
  { label: "Largo", key: "length", type: "number" },
  { label: "Peso", key: "weight" , type: "number"},
  { label: "Seguro", key: "insurance", type: "checkbox" },
  { label: "Valor", key: "value", type: "number" },
];

const PackageFormSection = ({ title, data, onChange, disabled }) => (
  <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-1 gap-4">
      {packageFields.map(({ label, key }) => (
        <InputField
          key={key}
          label={label}
          value={data[key]}
          type={key === "insurance" ? "checkbox" : "number"}
          onChange={(e) => onChange({ ...data, [key]: e.target.value })}
          disabled={disabled}
        />
      ))}
    </div>
  </div>
);

const InputField = ({ label, value, onChange, disabled,type }) => (
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
  <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
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
  // Estados para almacenar las compañías de envío y los servicios
  const [shippingCompanies, setShippingCompanies] = useState([]);
  const [services, setServices] = useState([]);
  // Estados para almacenar la compañía seleccionada y mostrar la confirmación
  const [selectedService, setSelectedService] = useState(null);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isConfirmedService, setIsConfirmedService] = useState(false);

  useEffect(() => {
    if (destinationCP) {
      handleRecipientDataChange({
        ...shippingData.recipient,
        zipCode: destinationCP,
      });
    }
  }, [destinationCP]);

  const fetchShippingCompanies = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/services/services"
      );
      setShippingCompanies(response.data);
    } catch (error) {
      console.error("Error fetching shipping companies:", error);
    }
  };

  const handleContinue = () => {
    setShowConfirmation(true);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    console.log("Servicio seleccionado:", service);
  };

  useEffect(() => {
    fetchShippingCompanies();
  }, []);

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    handleCompanySelection(company);
  };

  const handleConfirmService = () => {
    setIsConfirmedService(true);
  };

  const handleConfirm = async () => {
    setIsConfirmed(true);
    console.log("Datos confirmados", shippingData);

    // Verifica si se ha seleccionado una compañía antes de intentar obtener los servicios
    if (selectedCompany) {
      try {
        // Llama a la función para obtener los servicios
        await fetchServices(selectedCompany.name);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    }
  };

  const fetchServices = async (company) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/services/services/name",

        {
          name: company,
        }
      );
      setServices(response.data);

      console.log("Services:", response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleEdit = () => {
    setShowConfirmation(false);
  };

  const handleContinueStep = () => {
    handleClick(4);
  };

  return (
    <div className="p-6">
     
      {showConfirmation ? (
        <div>
          <h1 className="text-3xl font-semibold mb-6">Confirmar Datos</h1>
          <div className="flex gap-8">
            <FormSection
              title="Datos del Remitente"
              data={shippingData.sender}
              onChange={handleSenderDataChange}
              disabled={true} // Deshabilitar inputs
            />
            <FormSection
              title="Datos del Destinatario"
              data={shippingData.recipient}
              onChange={handleRecipientDataChange}
              disabled={true} // Deshabilitar inputs
            />
            <PackageFormSection
              title="Datos del Paquete"
              data={shippingData.package}
              onChange={handlePackageDataChange}
              disabled={true} // Deshabilitar inputs
            />
          </div>
          <h2 className="text-2xl font-semibold mt-6 mb-4">
            Selecciona una Compañía de Envío
          </h2>
          <div className="bg-white shadow-md p-4 flex gap-6 justify-center">
            {shippingCompanies.map((company) => (
              <div
                key={company.name}
                className={`cursor-pointer border-2 bg-white shadow-md px-10 py-5 p-4 rounded-lg ${
                  selectedCompany === company ? "border-orange-500" : ""
                }`}
                onClick={() => handleCompanyClick(company)}>
                <img
                  src={logoMap[company.name]}
                  alt={company.name}
                  className="h-16 w-auto mb-2"
                />
                <p className="text-center text-lg font-semibold">
                  {company.name}
                </p>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleConfirm}
              className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-lg">
              Confirmar
            </button>
            <button
              onClick={handleEdit}
              className="bg-gray-500 text-white text-xl font-semibold px-6 py-3 rounded-lg">
              Editar
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex gap-8">
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
              <PackageFormSection
              title="Datos del Paquete"
              data={shippingData.package}
              onChange={handlePackageDataChange}
              disabled={false} // Habilitar inputs
            />
          </div>

          <button
            onClick={handleContinue}
            className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-6">
            Continuar
          </button>
        </div>
      )}
      ¨
      {isConfirmed && (
        <>
          <ShipmentServices
            services={services}
            onServiceSelect={handleServiceSelect}
          />
          <button
            onClick={handleConfirmService}
            className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-6">
            Continuar
          </button>
        </>
      )}
      {isConfirmedService && (
        <ShipmentInfo data={shippingData} handleClick={handleContinueStep} />
      )}
    </div>
  );
}
