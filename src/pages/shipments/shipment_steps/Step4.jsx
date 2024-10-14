import { useState, useEffect, useRef } from "react";
import { getCode } from "country-list";
import { useAuth } from "../../../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import loading_animtation from "../../../assets/icons/loading.mp4";
import animationPaymet from "../../../assets/lotties/js/payment_terminal.json";
import Lottie from "lottie-react";
import { set } from "react-hook-form";
const api = import.meta.env.VITE_REACT_API_URL; // Obtener la URL desde el .env
export default function Step4({ handleClick, shippingData }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [folio, setFolio] = useState("");
  const videoRef = useRef(null);

  const locker_info = user.locker_info;
  const estadosHizo = {
    aguascalientes: "AS",
    "baja california": "BC",
    "baja california sur": "BS",
    campeche: "CM",
    chiapas: "CS",
    chihuahua: "CH",
    coahuila: "CO",
    colima: "CL",
    durango: "DG",
    guanajuato: "GT",
    guerrero: "GR",
    hidalgo: "HG",
    jalisco: "JA",
    mexico: "EM",
    michoacan: "MI",
    morelos: "MO",
    nayarit: "NA",
    "nuevo leon": "NL",
    oaxaca: "OA",
    puebla: "PB",
    queretaro: "QT",
    "quintana roo": "QR",
    "san luis potosi": "SL",
    sinaloa: "SI",
    sonora: "SO",
    tabasco: "TB",
    tamaulipas: "TM",
    tlaxcala: "TL",
    veracruz: "VE",
    yucatan: "YN",
    zacatecas: "ZA",
    "ciudad de mexico": "CM",
  };

  function removeAccents(str) {
    if (typeof str !== "string") {
      console.warn("removeAccents received a non-string value:", str);
      return "";
    }
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function normalizeState(state) {
    if (typeof state !== "string") {
      console.warn("normalizeState received a non-string value:", state);
      return "";
    }
    return removeAccents(state.toLowerCase().trim());
  }

  function obtenerHizo(estadoNombre) {
    if (typeof estadoNombre !== "string") {
      console.warn("obtenerHizo received a non-string value:", estadoNombre);
      return null;
    }
    const normalizedState = normalizeState(estadoNombre);
    for (const [key, value] of Object.entries(estadosHizo)) {
      if (normalizeState(key) === normalizedState) {
        return value;
      }
    }
    console.warn("No matching state found for:", estadoNombre);
    return null;
  }

  const recipientIsoCode = removeAccents(
    shippingData?.recipient?.country || ""
  );
  const senderIsoCode = removeAccents(locker_info.country || "");
  const isoCountryCodeRecipient = getCode(recipientIsoCode);
  const isoCountryCodeSender = getCode(senderIsoCode);
  const provider_shiping = localStorage.getItem("provedorPrincipal");
  const isoEstadoSender = obtenerHizo(locker_info.state);
  const isoEstadoRecipient = obtenerHizo(shippingData?.recipient?.state);

  const [shipment, setShipment] = useState({
    shipment_type: shippingData.package.type, // Tipo de paquete
    from: {
      name: shippingData.sender.nameSender,
      phone: shippingData.sender.phoneSender,
      email: shippingData.sender.emailSender,
      street: locker_info.street,
      city: locker_info.city,
      state: locker_info.state,
      country: locker_info.country,
      settlement: locker_info.ubication,
      zip_code: locker_info.cp,
      external_number: locker_info.num_ext, // Debes asignar el valor correcto
      internal_number: 0, // Debes asignar el valor correcto
      reference: locker_info.references || "no hay referencia", // Debes asignar el valor correcto
      rfc: null, // RFC es opcional, lo tienes como null
      iso_estado: isoEstadoSender, // Pendiente, debes definir este valor en tu objeto
      iso_pais: isoCountryCodeSender, // Pendiente, debes definir este valor en tu objeto
      contry_code: isoEstadoSender, // Asegúrate de tener el country code correcto
    },
    to: {
      name: shippingData.recipient.name,
      phone: shippingData.recipient.phone,
      email: shippingData.recipient.email,
      street: shippingData.recipient.street,
      city: shippingData.recipient.city,
      state: shippingData.recipient.state,
      country: shippingData.recipient.country,
      settlement: shippingData.recipient.colony,
      zip_code: shippingData.recipient.zipCode,
      external_number: shippingData.recipient.externalNumber, // Debes asignar el valor correcto
      internal_number: shippingData.recipient.internalNumber || 0, // Debes asignar el valor correcto
      reference: shippingData.recipient.references, // Debes asignar el valor correcto
      rfc: null, // RFC es opcional, lo tienes como null
      iso_estado: isoEstadoRecipient, // Pendiente, debes definir este valor en tu objeto
      iso_pais: isoCountryCodeRecipient, // Pendiente, debes definir este valor en tu objeto
      contry_code: isoEstadoRecipient, // Asegúrate de tener el country code correcto
    },
    payment: {
      method: "saldo",
      status: "Pendiente",
      transaction_id: `ID-1223223232`, // Generación de ID único
    },
    packing: {
      answer: "No",
      packing_id: "1123132132133", // Generación de ID único
      packing_type: "None",
      packing_cost: 0.0,
    },
    shipment_data: {
      height: shippingData.package.height,
      width: shippingData.package.width,
      length: shippingData.package.length,
      package_weight: shippingData.package.weight,
      volumetric_weight: 1.6,
    },
    insurance: 0.0,
    cost: shippingData.company.precio_regular, // Precio regular de la empresa
    price: shippingData.company.precio, // Precio final
    extra_price: 0.0,
    discount: 0.0,
    status: "Pendiente",
    dagpacket_profit:
      Number(shippingData.company.precio) -
      Number(shippingData.company.precio_regular), // Ganancia
    utilice_lic:
      Number(shippingData.company.precio) -
      Number(shippingData.company.precio_regular) * 0.3, // Utilidad de licencias (30% de ganancia)
    description: shippingData.package.descripcion, // Descripción del paquete
    provider: shippingData.company.proveedor, // Proveedor, ejemplo: "FedEx"
    apiProvider: provider_shiping, // API del proveedor
    idService: shippingData.company.idServicio, // Servicio, ejemplo: "SAME_DAY_CITY"
    utilitie_dag:
      Number(shippingData.company.precio) -
      Number(shippingData.company.precio_regular) * 0.7, // Utilidad para dagpacket
  });
  console.log("shipment", shipment);
  console.log("shippingData", shippingData);

  const updateShipment = async () => {
    setIsLoading(true);
    const id_folio = localStorage.getItem("folio");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${api}/shipments/update/${id_folio}`,
        shipment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success == false) {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar envío",
          text: response.data.message,
        });
        return;
      }
      setFolio(id_folio);
      Swal.fire({
        icon: "success",
        title: "Envío actualizado",
        text: "El envío se ha actualizado correctamente",
      });
    } catch (error) {
      console.error("Error al actualizar envío:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateShipment = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${api}/shipments/create/${user.user_id}`,
        shipment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success == false) {
        Swal.fire({
          icon: "error",
          title: "Error al crear envío",
          text: response.data.message,
        });
        return;
      }

      localStorage.setItem("shipment_id", response.data.shipment);
      setFolio(response.data.shipment);
      Swal.fire({
        icon: "success",
        title: "Envío creado",
        text: "El envío se ha creado correctamente",
      });
    } catch (error) {
      console.error("Error al crear envío:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const order = localStorage.getItem("update_order");

    if (order === "true") {
      updateShipment();
    } else {
      generateShipment();
    }
  }, []);

  useEffect(() => {
    if (isLoading && videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error al reproducir video:", error);
      });
    }
  }, [isLoading]);

  const copyToClipboard = () => {
    const shipmentId = localStorage.getItem("shipment_id");
    if (!shipmentId) {
      Swal.fire({
        icon: "error",
        title: "Folio no disponible",
        text: "No se encontró ningún folio para copiar.",
      });
      return;
    }

    navigator.clipboard
      .writeText(shipmentId)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Folio copiado",
          text: "El folio se ha copiado al portapapeles.",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo copiar el folio.",
        });
        console.error("Error al copiar folio:", error);
      });
  };

  const simulePayment = () => {
    Swal.fire({
      icon: "success",
      title: "Pago realizado con éxito",
    }).then(() => {
      handleClick(5);
    }
    );
   
  }

  return (
    <div>
      {isLoading ? (
        <>
          <video
            ref={videoRef}
            src={loading_animtation}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full"
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full p-6 bg-gray-100 rounded-lg shadow-lg">
          <p className="text-lg font-semibold text-orange-600 mb-4">
            El folio de tu envío es: {folio}
            <strong
              className="text-orange-600 cursor-pointer hover:underline"
              onClick={copyToClipboard}
            ></strong>
          </p>

          <Lottie animationData={animationPaymet} style={{ width: "300px" }} />
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Por favor realiza tu pago en la terminal, <br /> una vez realizado,
            tu envío estará listo para ser depositado en la gaveta.
          </h1>
          <button
            onClick={simulePayment}
            className="px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded-lg hover:bg-orange-700 transition duration-300 ease-in-out shadow-md"
          >
            Realizar Pago
          </button>
        </div>
      )}
    </div>
  );
}
