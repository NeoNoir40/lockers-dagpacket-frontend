import { useState } from "react";

export default function ShipmentServices({ services, onServiceSelect }) {
    const [selectedService, setSelectedService] = useState(null);

    // Asegúrate de que `services` no esté vacío
    if (!services || services.length === 0) {
        return <p>No hay servicios disponibles.</p>;
    }

    const handleServiceClick = (service) => {
        setSelectedService(service);
        onServiceSelect(service);  // Pasa el servicio seleccionado al componente padre
    };

    return (
        <div className="p-4 bg-white rounded-md shadow-md ">
            {services.map((provider) => (
                <div key={provider.providerName} className="mb-6">
                    <h2 className="text-xl font-bold mb-4">{provider.providerName}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {provider.services.map((service) => (
                            <div
                                key={service._id}
                                className={`p-4 border border-gray-100 rounded-md shadow-md cursor-pointer ${selectedService && selectedService._id === service._id ? 'border-orange-400' : ''}`}
                                onClick={() => handleServiceClick(service)}
                            >
                                <h3 className="text-lg font-semibold">{service.name}</h3>
                                <p><strong>Porcentaje:</strong> {service.percentage}%</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
