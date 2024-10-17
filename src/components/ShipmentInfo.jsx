import { useAuth } from "../../context/AuthContext";
import DhlLogo from "../assets/images/logos/dhl-logo.svg";
import FedexLogo from "../assets/images/logos/fedex-logo.svg";
import EstafetaLogo from "../assets/images/logos/estafeta-logo-png-transparent.png";
import PaqueteExLogo from "../assets/images/logos/Paquetexpress Logo Vector.svg";

export default function ShipmentInfo({ data, handleClick }) {
  const paqute_tipo = localStorage.getItem("tipo_paquete");
  const logoMap = {
    Fedex: FedexLogo,
    "Paquete Express": PaqueteExLogo,
    DHL: DhlLogo,
    Estafeta: EstafetaLogo,
  };
  console.log('paqute_tipo', paqute_tipo);

  const logo = logoMap[data.company.proveedor] || ""; // Si no hay logo, se deja vacío

  const { user } = useAuth();
  const locker_info = user.locker_info;

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg mt-6 flex flex-row gap-5">
     <div className="bg-gray-50  shadow-lg p-5  justify-start flex flex-col gap-3">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Total
      </h1>
      <p className="text-lg  text-gray-600">
        <strong>Costo:</strong> {data.company.precio} MXN
      </p>
      <p className="text-lg  text-gray-600">
        <strong>Paquete:</strong> {data.package.type}
      </p>
      <p className="text-lg  text-gray-600">
        <strong>Seguro:</strong> {data.package.insurance ? "Sí" : "No"}
      </p>
      <p className="text-lg  text-gray-600">
        <strong>Origen:</strong> {locker_info.city}, {locker_info.state}
      </p>
      <p className="text-lg  text-gray-600">
        <strong>Destino:</strong> {data.recipient.city}, {data.recipient.state}
      </p>
      <p className="text-lg  text-gray-600">
        <strong>Fecha de envío:</strong> {new Date().toLocaleDateString()}
      </p>
      <p className="text-lg  text-gray-600">
        <strong>Fecha de entrega:</strong> {data.company.tiempo_de_entrega}
      </p>
      {paqute_tipo === "Paquete" && (
        <p className="text-lg  text-gray-600">
          <strong>Valor Declarado:</strong> {data.package.value} MXN
        </p>
      )}
    
     <button
        onClick={() => handleClick(4)}
        className="bg-orange-500 p-3 mt-2 text-white text-lg font-semibold rounded-lg"
      >
        Confirmar envío
      </button>
     </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Información de Envío
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información de Paquetería */}

          <div className="p-6 bg-gray-50 rounded-lg shadow-lg   flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Paquetería
            </h2>
            <div className="flex items-center space-x-4">
              <img
                src={logo}
                alt="Logo de paquetería"
                className="h-16 w-16 rounded-full object-cover border border-gray-300"
              />
              <p className="text-lg font-medium text-gray-600">
                {data.company.proveedor}
              </p>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              <strong>Servicio:</strong> {data.company.nombre_servicio}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Precio:</strong> {data.company.precio}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Tipo de paquete:</strong> {data.package.type}
            </p>
          </div>

          {/* Información del Paquete */}
          <div className="p-6 bg-gray-50 rounded-lg shadow-lg flex flex-col gap-5">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Paquete
            </h2>
            <p className="text-sm text-gray-600">
              <strong>Tipo:</strong> {data.package.type}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Seguro:</strong> {data.package.insurance ? "Sí" : "No"}
            </p>
            {paqute_tipo === "Paquete" && (
        <p className="text-lg  text-gray-600">
          <strong>Valor Declarado:</strong> {data.package.value} MXN
        </p>
      )}
          </div>

          {/* Información del Origen */}
          <div className="p-6 bg-gray-50 rounded-lg shadow-lg flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Origen</h2>
            <p className="text-sm text-gray-600">
              <strong>Nombre:</strong> {data.sender.nameSender}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Teléfono:</strong> {data.sender.phoneSender}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Correo electrónico:</strong> {data.sender.emailSender}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Calle:</strong> {locker_info.street}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Colonia:</strong> {locker_info.ubication}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Ciudad:</strong> {locker_info.city}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Estado:</strong> {locker_info.state}
            </p>
            <p className="text-sm text-gray-600">
              <strong>País:</strong> {locker_info.country}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Código Postal:</strong> {locker_info.cp}
            </p>
          </div>

          {/* Información del Destinatario */}
          <div className="p-6 bg-gray-50 rounded-lg shadow-lg flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Destinatario
            </h2>
            <p className="text-sm text-gray-600">
              <strong>Nombre:</strong> {data.recipient.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Teléfono:</strong> {data.recipient.phone}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Correo electrónico:</strong> {data.recipient.email}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Calle:</strong> {data.recipient.street}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Colonia:</strong> {data.recipient.colony}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Ciudad:</strong> {data.recipient.city}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Estado:</strong> {data.recipient.state}
            </p>
            <p className="text-sm text-gray-600">
              <strong>País:</strong> {data.recipient.country}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Código Postal:</strong> {data.recipient.zipCode}
            </p>
          </div>

          <div></div>
        </div>
      </div>
    </div>
  );
}
