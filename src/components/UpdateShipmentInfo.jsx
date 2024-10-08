import { useAuth } from "../../context/AuthContext";
import { useState,useEffect } from "react";
import DhlLogo from "../assets/images/logos/dhl-logo.svg";
import FedexLogo from "../assets/images/logos/fedex-logo.svg";
import EstafetaLogo from "../assets/images/logos/estafeta-logo-png-transparent.png";
import PaqueteExLogo from "../assets/images/logos/Paquetexpress Logo Vector.svg";
import { getCode } from "country-list";

export default function UpdateShipmentInfo({ shipment_info, handleClick,handleSenderDataChange, handleRecipientDataChange }) {
  const logoMap = {
    Fedex: FedexLogo,
    "Paquete Express": PaqueteExLogo,
    DHL: DhlLogo,
    Estafeta: EstafetaLogo,
  };
  const provider_shiping = localStorage.getItem("provedorPrincipal");
 const data = JSON.parse(localStorage.getItem("orden"));

  console.log("Data received in UpdateShipmentInfo:", data);

  const logo = logoMap[shipment_info.company.proveedor] || ""; // Si no hay logo, se deja vacío

  const { user } = useAuth();
  const locker_info = user.locker_info;

useEffect(() => {
    if (data?.from && handleSenderDataChange) {
      const senderData = {
        nameSender: data.from.name,
        phoneSender: data.from.phone,
        emailSender: data.from.email,
      };
      handleSenderDataChange(senderData);
    }

    if (data?.to && handleRecipientDataChange) {
      const recipientData = {
        name: data.to.name,
        phone: data.to.phone,
        email: data.to.email,
        street: data.to.street,
        city: data.to.city,
        state: data.to.state,
        country: data.to.country,
        colony: data.to.settlement,
        zipCode: data.to.zip_code,
        externalNumber: data.to.external_number,
        internalNumber: data.to.internal_number,
        references: data.to.reference,
      };
      handleRecipientDataChange(recipientData);
    }
  }, [data]);

  if (!data || !shipment_info) {
    console.log("Data or shipment_info is null in UpdateShipmentInfo");
    return <div>Loading... Please wait while we fetch the shipment information.</div>;
  }
  
  return (
    <div className="p-8 bg-white shadow-lg rounded-lg mt-6 flex flex-row gap-5">
     <div className="bg-gray-50  shadow-lg p-5  justify-start flex flex-col gap-3">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Total
      </h1>
      <p className="text-lg  text-gray-600">
        <strong>Costo:</strong> {shipment_info.company.precio} MXN
      </p>
      <p className="text-lg  text-gray-600">
        <strong>Paquete:</strong> {shipment_info.package.type}
      </p>
      <p className="text-lg  text-gray-600">
        <strong>Seguro:</strong> {shipment_info.package.insurance ? "Sí" : "No"}
      </p>
      <p className="text-lg  text-gray-600">
        <strong>Origen:</strong> {locker_info.city}, {locker_info.state}
      </p>
      <p className="text-lg  text-gray-600">
        <strong>Destino:</strong> {data.to.city}, {data.to.state}
      </p>
      <p className="text-lg  text-gray-600">
        <strong>Fecha de envío:</strong> {new Date().toLocaleDateString()}
      </p>
      <p className="text-lg  text-gray-600">
        <strong>Fecha de entrega:</strong> {shipment_info.company.tiempo_de_entrega}
      </p>
    
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
                {shipment_info.company.proveedor}
              </p>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              <strong>Servicio:</strong> {shipment_info.company.nombre_servicio}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Precio:</strong> {shipment_info.company.precio}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Tipo de paquete:</strong> {shipment_info.package.type}
            </p>
          </div>

          {/* Información del Paquete */}
          <div className="p-6 bg-gray-50 rounded-lg shadow-lg flex flex-col gap-5">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Paquete
            </h2>
            <p className="text-sm text-gray-600">
              <strong>Tipo:</strong> {shipment_info.package.type}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Seguro:</strong> {shipment_info.package.insurance ? "Sí" : "No"}
            </p>
          </div>

          {/* Información del Origen */}
          <div className="p-6 bg-gray-50 rounded-lg shadow-lg flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Origen</h2>
            <p className="text-sm text-gray-600">
              <strong>Nombre:</strong> {data.from.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Teléfono:</strong> {data.from.phone}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Correo electrónico:</strong> {data.from.email}
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
              <strong>Nombre:</strong> {data.to.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Teléfono:</strong> {data.to.phone}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Correo electrónico:</strong> {data.to.email}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Calle:</strong> {data.to.street}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Colonia:</strong> {data.to.colony}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Ciudad:</strong> {data.to.city}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Estado:</strong> {data.to.state}
            </p>
            <p className="text-sm text-gray-600">
              <strong>País:</strong> {data.to.country}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Código Postal:</strong> {data.to.zipCode}
            </p>
          </div>

          <div></div>
        </div>
      </div>
    </div>
  );
}
