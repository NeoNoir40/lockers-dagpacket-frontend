import React, { useState, useEffect, act } from "react";
import { getCode } from "country-list";
import Swal from "sweetalert2";
import axios from "axios";
import "../../../assets/css/shipment/shipment.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { generateLogGaveta, updateSaturation } from "../../../../context/auth";
const api = import.meta.env.VITE_REACT_API_URL; // Obtener la URL desde el .env

const Step5 = ({ handleClick, onWeightChange, shippingData }) => {
  const estadosHizo = {
    Aguascalientes: "AS",
    "Baja California": "BC",
    "Baja California Sur": "BS",
    Campeche: "CM",
    Chiapas: "CS",
    Chihuahua: "CH",
    Coahuila: "CO",
    Colima: "CL",
    Durango: "DG",
    Guanajuato: "GT",
    Guerrero: "GR",
    Hidalgo: "HG",
    Jalisco: "JA",
    México: "EM",
    Michoacán: "MI",
    Morelos: "MO",
    Nayarit: "NA",
    "Nuevo León": "NL",
    Oaxaca: "OA",
    Puebla: "PB",
    Querétaro: "QT",
    "Quintana Roo": "QR",
    "San Luis Potosí": "SL",
    Sinaloa: "SI",
    Sonora: "SO",
    Tabasco: "TB",
    Tamaulipas: "TM",
    Tlaxcala: "TL",
    Veracruz: "VE",
    Yucatán: "YN",
    Zacatecas: "ZA",
    "Ciudad de México": "CM", // Para la CDMX
  };

  function obtenerHizo(estadoNombre) {
    return estadosHizo[estadoNombre] || null; // Devuelve el código si se encuentra
  }

  const [isPackageInserted, setIsPackageInserted] = useState(false);
  const [openDoor, setOpenDoor] = useState(false);
  const { user } = useAuth();
  const locker_id = localStorage.getItem("locker_id");
  const gabeta_id = localStorage.getItem("idGabeta");
  const user_id = localStorage.getItem("user_id");
  const guideNumber = localStorage.getItem("guideNumber");
  const guideUrl = localStorage.getItem("guideUrl");
  const navigate = useNavigate();

  // Define initial state for data
  const [data, setData] = useState({
    locker_id: locker_id, // Se obtiene de user
    gabeta_id: gabeta_id, // Se obtiene de localStorage
    client_id: '616f2b7ee3f11134f74f8296', // Se obtiene de user
    account_id: '616f2b7ee3f11134f74f8296', // Se obtiene de user
    action: "sell",
    purchase_id: '616f2b7ee3f11134f74f8296', // Se obtiene de user
    // Acción de inserción, por ejemplo
    sell: Number(shippingData.company.precio), // Precio de la venta
    buy: Number(shippingData.company.precio_regular), // Precio de compra
    profit:
      Number(shippingData.company.precio) -
      Number(shippingData.company.precio_regular), // Beneficio
    delivery: shippingData.company.proveedor, // Si hay entrega o no
    technician: null, // Dejar en null
    delivery_driver: null, // Dejar en null
    delivery_person: null, // Dejar en null
  });

  function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  const recipientIsoCode = removeAccents(shippingData.recipient.country);
  const senderIsoCode = removeAccents(shippingData.sender.country);
  const isoCountryCodeRecipient = getCode(recipientIsoCode); // Usa el país normalizado
  const isoCountryCodeSender = getCode(senderIsoCode); // Usa el país normalizado
  const provider_shiping = localStorage.getItem("provedorPrincipal");
  const isoEstadoSender = obtenerHizo(shippingData.sender.state);
  const isoEstadoRecipient = obtenerHizo(shippingData.recipient.state);
  const guideNumberAccount = localStorage.getItem("guideNumber");
  const guideUrlAccount = localStorage.getItem("guideUrl");

  const [guide, setGuide] = useState({
    guide: guideUrlAccount,
    guide_number: guideNumberAccount,
  });

  const [generateGuide, setGenerateGuide] = useState({
    provider: provider_shiping,
    from: {
      name: shippingData.sender.name,
      rfc: "", // Puedes agregar el RFC si es necesario
      phone: shippingData.sender.phone,
      street: shippingData.sender.street,
      external_number: "0",
      internal_number: "0",
      settlement: shippingData.sender.colony,
      locality_key: "01", // Cambia si tienes el valor correcto
      municipality_key: "001", // Cambia si tienes el valor correcto
      zip_code: shippingData.sender.zipCode,
      city: shippingData.sender.city,
      iso_estado: isoEstadoSender, // Asegúrate de usar el código ISO correcto
      iso_pais: isoCountryCodeSender, // Usa código ISO
      cross_street_1: "",
      cross_street_2: "",
      description: "",
      reference: "Referencia válida", // Cambia a una referencia significativa
    },
    to: {
      name: shippingData.recipient.name,
      rfc: "", // Puedes agregar el RFC si es necesario
      phone: shippingData.recipient.phone,
      street: shippingData.recipient.street,
      external_number: "0",
      internal_number: "0",
      settlement: shippingData.recipient.colony,
      locality_key: "01", // Cambia si tienes el valor correcto
      municipality_key: "001", // Cambia si tienes el valor correcto
      zip_code: shippingData.recipient.zipCode,
      city: shippingData.recipient.city,
      iso_estado: isoEstadoRecipient, // Asegúrate de usar el código ISO correcto
      iso_pais: isoCountryCodeRecipient,
      cross_street_1: "",
      cross_street_2: "",
      description: "",
      reference: "Casa color rosa",
    },
    package: {
      weight: shippingData.package.weight,
      height: shippingData.package.height,
      width: shippingData.package.width,
      length: shippingData.package.length,
      service_id: shippingData.company.idServicio, // Cambia según corresponda
      package_type: 1,
      content: shippingData.package.description,
      detailed_content: shippingData.package.description,
      insurance: 100,
      declared_value: shippingData.package.value,
    },
    impresion: {
      tipo_impresion: 2,
      tipo_impresora: "ZPLII",
      tipo_papel: "PAPER_4X6",
    },
    items: [
      {
        clave_producto: "53101601", // Asegúrate de que esto sea correcto
        descripcion_producto: shippingData.package.description,
        clave_unidad: "EA",
        cantidad_producto: "1",
        alto_producto: shippingData.package.height.toString(),
        ancho_producto: shippingData.package.width.toString(),
        largo_producto: shippingData.package.length.toString(),
        valor_producto: shippingData.package.value.toString(),
        peso_producto: shippingData.package.weight.toString(),
      },
    ],
  });

  const [shipment, setShipment] = useState({
    shipment_type: shippingData.package.type, // Tipo de paquete
    from: {
      name: shippingData.sender.name,
      phone: shippingData.sender.phone,
      email: shippingData.sender.email,
      street: shippingData.sender.street,
      city: shippingData.sender.city,
      state: shippingData.sender.state,
      country: shippingData.sender.country,
      settlement: shippingData.sender.colony,
      zip_code: shippingData.sender.zipCode,
      external_number: "0", // Debes asignar el valor correcto
      internal_number: "0", // Debes asignar el valor correcto
      reference: null, // Debes asignar el valor correcto
      rfc: null, // RFC es opcional, lo tienes como null
      iso_estado: isoEstadoSender, // Pendiente, debes definir este valor en tu objeto
      iso_pais: isoCountryCodeSender, // Pendiente, debes definir este valor en tu objeto
      contry_code: shippingData.sender.countryCode, // Asegúrate de tener el country code correcto
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
      external_number: "0", // Debes asignar el valor correcto
      internal_number: "0", // Debes asignar el valor correcto
      reference: null, // Debes asignar el valor correcto
      rfc: null, // RFC es opcional, lo tienes como null
      iso_estado: isoEstadoRecipient, // Pendiente, debes definir este valor en tu objeto
      iso_pais: isoCountryCodeRecipient, // Pendiente, debes definir este valor en tu objeto
      contry_code: shippingData.recipient.countryCode, // Asegúrate de tener el country code correcto
    },
    payment: {
      method: "saldo",
      status: "Pendiente",
      transaction_id: `ID-1223223232`, // Generación de ID único
    },
    packing: {
      answer: "No",
      packing_id: '1123132132133', // Generación de ID único
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
    status: "Pagado",
    dagpacket_profit: data.profit, // Ganancia
    utilice_lic: data.profit * 0.3, // Utilidad de licencias (30% de ganancia)
    description: shippingData.package.descripcion, // Descripción del paquete
    provider: shippingData.company.proveedor, // Proveedor, ejemplo: "FedEx"
    apiProvider: provider_shiping, // API del proveedor
    idService: shippingData.company.idServicio, // Servicio, ejemplo: "SAME_DAY_CITY"
    utilitie_dag: data.profit * 0.7, // Utilidad para dagpacket
  });

  const saveGuide = async (data) => {
    try {
      const token = localStorage.getItem("token"); // Reemplaza 'token' con la clave que usaste para almacenarlo

      const response = axios.patch(
        `${api}/shipments/save-guide/${data}`,
        guide,
        {
          headers: {
        Authorization: `Bearer ${token}`, // Agregamos el token en los headers
          },
        }
      );
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const generateShipments = async () => {
    try {
      // Obtén el token del localStorage
      const token = localStorage.getItem("token"); // Reemplaza 'token' con la clave que usaste para almacenarlo

      // Realiza la solicitud con el token Bearer
      const response = await axios.post(
        `${api}/shipments/create/${user_id}`,
        shipment,
        {
          headers: {
        Authorization: `Bearer ${token}`, // Agregamos el token en los headers
          },
        }
      );

      if (response.data.success) {
        console.log("Paquete insertado correctamente:", response.data);
        const shipmentId = response.data.shipment;
        localStorage.setItem("shipmentId", shipmentId);

        try {
          generateGuideClient();

          if (guideNumber) {
            saveGuide(shipmentId);
            handlePackageLog();
            updateSaturation(true);
          }
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const generateGuideClient = async () => {
    try {
      const token = localStorage.getItem("token"); // Reemplaza 'token' con la clave que usaste para almacenarlo

      const response = await axios.post(
        `${api}/shipping/generate-guide`,
        generateGuide,
        {
          headers: {
        Authorization: `Bearer ${token}`, // Agregamos el token en los headers
          },
        }
      );

      if (response.data.success) {
        // console.log("Número de Guía:", response.data.data.guideNumber); // Asegúrate de que sea data
        // console.log("URL de la Guía:", response.data.data.guideUrl);
        localStorage.setItem("guideNumber", response.data.data.guideNumber);
        localStorage.setItem("guideUrl", response.data.data.guideUrl);
      } else {
        Swal.fire({
          title: "Error al generar guía",
          text: response.data.message,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (e) {
      // console.log(generateGuide);
      console.log(e);
    }
  };

  const handlePackageLog = async () => {
    try {
      const response = await generateLogGaveta(data);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const handleOpenDoor = async () => {
    try {
      const token = localStorage.getItem("token"); // Reemplaza 'token' con la clave que usaste para almacenarlo
      const openDoorResponse = await axios.post(
        `${api}/mqtt/`,
        {
          locker_id: locker_id,
          action: "sendLocker",
          gabeta: gabeta_id,
        },
        {
          headers: {
        Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!openDoorResponse.data.error) {
        setOpenDoor(true);

        Swal.fire({
          title: "Locker Abierto",
          text: `El locker se ha abierto correctamente.`,
          icon: "success",
          confirmButtonText: "OK",
        });

        return true; // Retorna true si se abrió correctamente
      } else {
        Swal.fire({
          title: "Error",
          text: `No se pudo abrir el locker.`,
          icon: "error",
          confirmButtonText: "OK",
        });

        return false; // Retorna false si hubo error en la apertura
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: `No se pudo abrir el locker.`,
        icon: "error",
        confirmButtonText: "OK",
      });

      return false; // Retorna false en caso de error
    }
  };

  const checkStatusDoor = async () => {
    try {
      const token = localStorage.getItem("token"); // Asegúrate de tener el token en localStorage
      const checkDoorResponse = await axios.post(
        `${api}/mqtt/`,
        {
          locker_id: locker_id,
          action: "checkDoor",
          gabeta: gabeta_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const responseMessage = checkDoorResponse.data.message;
  
      // Revisar si el mensaje incluye "0", lo que indica que la puerta está cerrada
      if (checkDoorResponse.data.error) {
        Swal.fire({
          title: "Error",
          text: `No se pudo revisar el estado del locker.`,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else if (responseMessage.includes(": 0")) {
        // Puerta cerrada
        return true;
      } else {
        // Puerta abierta
        return false;
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: `No se pudo revisar el estado del locker.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  
  const handleCloseDoor = async () => {
    let isClosed = false;
  
    while (!isClosed) {
      // Revisar el estado de la puerta
      const doorClosed = await checkStatusDoor();
  
      if (!doorClosed) {
        // Si la puerta sigue abierta, mostrar el mensaje
        await Swal.fire({
          title: "Atención",
          text: "Por favor, cierra la puerta del locker.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      } else {
        // Si la puerta está cerrada, mostrar agradecimiento y salir del bucle
        await Swal.fire({
          title: "Gracias",
          text: "Gracias por confiar en DagPacket.",
          icon: "success",
          confirmButtonText: "OK",
        });
        isClosed = true;
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        // Genera los envíos y espera a que termine
        await generateShipments();
        setIsPackageInserted(true);
  
        // Luego intenta abrir el locker solo si la operación fue exitosa
        const lockerOpened = await handleOpenDoor();
  
        if (lockerOpened) {
          console.log("Locker abierto correctamente.");
  
          // Llamar a la función para revisar el estado de la puerta
          await handleCloseDoor(); // Aquí revisa si la puerta está cerrada o no
        } else {
          console.log("Hubo un problema abriendo el locker.");
        }
      } catch (error) {
        console.error(
          "Error en la generación del envío o apertura del locker:",
          error
        );
      }
    }, 5000);
  
    return () => clearTimeout(timer);
  }, []);
  
  // Mostrar una tarjeta de confirmación después de que se ingresa el paquete
  // useEffect(() => {
  //   if (isPackageInserted) {
  //     Swal.fire({
  //       title: "¡Paquete ingresado correctamente!",
  //       text: "Tu paquete ha sido insertado en la gabeta.",
  //       icon: "success",
  //       confirmButtonText: "Aceptar",
  //     }).then(() => {
  //       // Aquí podrías manejar el envío de data a la API si es necesario
  //       console.log(data); // Verifica los datos antes de enviarlos
  //       navigate("/")// o hacer otra acción después de la confirmación
  //     });
  //   }
  // }, [isPackageInserted, data, navigate]);

  return (
    <div className="step2 flex flex-col justify-center items-center gap-8 bg-white p-10 rounded-md shadow-md">
      <h1 className="text-3xl font-semibold mx-8 text-center">
        Espera a que la gabeta indicada se abra e{" "}
        <span className="text-orange-500">introduce tu paquete</span>
      </h1>
      <button onClick={generateGuideClient}>generar guia</button>
      <button onClick={generateShipments}>ola</button>
      <div className="flex justify-center items-center h-[40vh] w-full max-w-5xl px-4">
        <div className="screen-container grid gap-1 h-full w-1/5 bg-gray-400 border-4 border-gray-400">
          {/* Pantalla de simulación de la apertura de la gabeta */}
          <div className="locker17 bg-gray-200 px-3 py-2">
            <div className="bg-black w-full h-full"></div>
          </div>
          <div className="locker18 bg-gray-200 px-7 pb-2 pt-1">
            <div className="flex justify-center items-center bg-white h-full w-full">
              <img src="logo.webp" alt="Logo" className="w-1/2" />
            </div>
          </div>
          <div className="locker19 bg-gray-200 p-3"></div>
          <div className="locker20 bg-gray-200 p-3 open"></div>
        </div>
        <div className="lockers-container grid gap-1 h-full w-2/5 bg-gray-400 border-4 border-gray-400">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="bg-gray-200 p-3"></div>
          ))}
        </div>
      </div>

      {/* Tarjeta de confirmación cuando se inserta el paquete */}
      {isPackageInserted && (
        <div
          className="bg-green-100 border-t-4 border-green-500 rounded-md text-green-700 px-4 py-3 shadow-md mt-6"
          role="alert">
          <p className="font-bold">¡Paquete ingresado correctamente!</p>
          <p>Tu paquete ha sido insertado en la gabeta correctamente.</p>
        </div>
      )}
    </div>
  );
};

export default Step5;
