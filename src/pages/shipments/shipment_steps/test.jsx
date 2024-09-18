import { useState, useEffect } from "react";
import DhlLogo from "../../../assets/images/logos/dhl-logo.svg";
import FedexLogo from "../../../assets/images/logos/fedex-logo.svg";
import EstafetaLogo from "../../../assets/images/logos/estafeta-logo-png-transparent.png";
import PaqueteExLogo from "../../../assets/images/logos/Paquetexpress Logo Vector.svg";
import axios from "axios";

const logoMap = {
  Fedex: FedexLogo,
  Superenvios: "", // Añade el logo correspondiente aquí si lo tienes
  "Paquete Express": PaqueteExLogo,
  DHL: DhlLogo,
  Estafeta: EstafetaLogo,
};

export default function Step3({
  handleClick,
  handleSenderDataChange,
  handleRecipientDataChange,
  handleCompanySelection,
  shippingData,
}) {
  const [shippingCompanies, setShippingCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

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

  

  useEffect(() => {
    fetchShippingCompanies();
  }, []);

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    handleCompanySelection(company);
  };

  return (
    <div className="p-6">
      {selectedCompany ? (
        <div>
          <div className="flex gap-8">
            <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">
                Datos del Remitente
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={shippingData.sender.name || ""}
                  onChange={(e) =>
                    handleSenderDataChange({
                      ...shippingData.sender,
                      name: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="Colonia"
                  value={shippingData.sender.colony || ""}
                  onChange={(e) =>
                    handleSenderDataChange({
                      ...shippingData.sender,
                      colony: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <input
                  type="text"
                  placeholder="Calle"
                  value={shippingData.sender.street || ""}
                  onChange={(e) =>
                    handleSenderDataChange({
                      ...shippingData.sender,
                      street: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <input
                  type="text"
                  placeholder="Ciudad"
                  value={shippingData.sender.city || ""}
                  onChange={(e) =>
                    handleSenderDataChange({
                      ...shippingData.sender,
                      city: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="Estado"
                  value={shippingData.sender.state || ""}
                  onChange={(e) =>
                    handleSenderDataChange({
                      ...shippingData.sender,
                      state: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="País"
                  value={shippingData.sender.country || ""}
                  onChange={(e) =>
                    handleSenderDataChange({
                      ...shippingData.sender,
                      country: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={shippingData.sender.phone || ""}
                  onChange={(e) =>
                    handleSenderDataChange({
                      ...shippingData.sender,
                      phone: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  value={shippingData.sender.email || ""}
                  onChange={(e) =>
                    handleSenderDataChange({
                      ...shippingData.sender,
                      email: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                {/* Agrega más campos de entrada para el remitente */}
              </div>
            </div>
            <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">
                Datos del Destinatario
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={shippingData.recipient.name || ""}
                  onChange={(e) =>
                    handleRecipientDataChange({
                      ...shippingData.recipient,
                      name: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="Colonia"
                  value={shippingData.recipient.colony || ""}
                  onChange={(e) =>
                    handleRecipientDataChange({
                      ...shippingData.recipient,
                      colony: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <input
                  type="text"
                  placeholder="Calle"
                  value={shippingData.recipient.street || ""}
                  onChange={(e) =>
                    handleRecipientDataChange({
                      ...shippingData.recipient,
                      street: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <input
                  type="text"
                  placeholder="Ciudad"
                  value={shippingData.recipient.city || ""}
                  onChange={(e) =>
                    handleRecipientDataChange({
                      ...shippingData.recipient,
                      city: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <input
                  type="text"
                  placeholder="Estado"
                  value={shippingData.recipient.state || ""}
                  onChange={(e) =>
                    handleRecipientDataChange({
                      ...shippingData.recipient,
                      state: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <input
                  type="text"
                  placeholder="País"
                  value={shippingData.recipient.country || ""}
                  onChange={(e) =>
                    handleRecipientDataChange({
                      ...shippingData.recipient,
                      country: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={shippingData.recipient.phone || ""}
                  onChange={(e) =>
                    handleRecipientDataChange({
                      ...shippingData.recipient,
                      phone: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={shippingData.recipient.email || ""}
                  onChange={(e) =>
                    handleRecipientDataChange({
                      ...shippingData.recipient,
                      email: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="Código Postal"
                  value={shippingData.recipient.zipCode || ""}
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  readOnly
                />
              </div>
            </div>
          </div>
            <button
                onClick={handleContinue}
                className="bg-orange-500 text-white text-xl font-semibold px-6 py-3 rounded-lg mt-6">
                Continuar
            </button>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-semibold mb-6">Elige tu paquetería</h1>
          <div className="flex flex-wrap gap-4">
            {shippingCompanies.map((company) => (
              <div
                key={company.name}
                className="cursor-pointer p-4 border border-gray-300 rounded-lg shadow-md flex items-center gap-4"
                onClick={() => handleCompanyClick(company.name)}>
                <img
                  src={logoMap[company.name]}
                  alt={company.name}
                  className="w-24 h-auto"
                />
                <span className="text-xl">{company.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
