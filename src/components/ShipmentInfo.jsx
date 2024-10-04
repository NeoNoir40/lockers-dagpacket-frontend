import { useAuth } from "../../context/AuthContext";

export default function ShipmentInfo({ data }) {
  const { user  } = useAuth();
  console.log(user.locker_info  );
  const locker_info = user.locker_info;
  console.log(data);
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg mt-2">
      <h1 className="text-2xl font-semibold mb-4">Información de Envío</h1>

      <div className="grid grid-cols-3 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-2">Remitente</h2>
          <p className="mb-1">
            <strong className="font-semibold">Nombre:</strong>{" "}
            {data.sender.nameSender}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">Teléfono:</strong>{" "}
            {data.sender.phoneSender}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">Correo electrónico:</strong>{" "}
            {data.sender.emailSender}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">Calle:</strong>{" "}
            {locker_info.street}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">Colonia:</strong>{" "}
            {locker_info.ubication}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">Ciudad:</strong>{" "}
            {locker_info.city}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">Estado:</strong>{" "}
            {locker_info.state}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">País:</strong>{" "}
            {locker_info.country}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">Código Postal:</strong>{" "}
            {locker_info.cp}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-2">Destinatario</h2>
          <p className="mb-1">
            <strong className="font-semibold">Nombre:</strong>{" "}
            {data.recipient.name}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">Teléfono:</strong>{" "}
            {data.recipient.phone}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">Correo electrónico:</strong>{" "}
            {data.recipient.email}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">Calle:</strong>{" "}
            {data.recipient.street}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">Colonia:</strong>{" "}
            {data.recipient.colony}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">Ciudad:</strong>{" "}
            {data.recipient.city}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">Estado:</strong>{" "}
            {data.recipient.state}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">País:</strong>{" "}
            {data.recipient.country}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">Código postal:</strong>{" "}
            {data.recipient.zipCode}
          </p>
        </div>
        <div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-medium mb-2">Paquete</h2>
            <p className="mb-1">
              <strong className="font-semibold">Tipo:</strong>{" "}
              {data.package.type}
            </p>
            <p className="mb-1">
              <strong className="font-semibold">Seguro:</strong>{" "}
              {data.package.insurance ? "Sí" : "No"}
            </p>
          </div>
        </div>
        <div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-medium mb-2">Paqueteria</h2>
            <p className="mb-1">
              <strong className="font-semibold">Nombre:</strong>{" "}
              {data.company.proveedor}
            </p>
            <p className="mb-1">
              <strong className="font-semibold">Servicio:</strong>{" "}
              {data.company.nombre_servicio}
            </p>
            <p className="mb-1">
              <strong className="font-semibold">Precio:</strong>{" "}
              {data.company.precio}
            </p>
            <p className="mb-1">
              <strong className="font-semibold">Tipo de paquete:</strong>{" "}
              {data.package.type}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
