import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Step1 from "./RechargeServicesSteps/Step1";
import MobileServices from "../../components/MobileServices";
import { phoneRecharge } from "../../../context/auth";
const api = import.meta.env.VITE_REACT_API_URL; // Obtener la URL desde el .env

export default function RechargeServices() {
  const [currentStep, setCurrentStep] = useState(1); // Start at step 1
  const [selectedService, setSelectedService] = useState("recargas"); // Start with recharge selected
  const [service, setService] = useState([]);
  const [scan, setScan] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // New state for controlling first load
  const [phoneNumber, setPhoneNumber] = useState(""); // State to store the phone number
  const [barcodeNumber, setBarcodeNumber] = useState(""); // State to store barcode
  const [selectedScaner, setSelectedScaner] = useState(null); // State to store selected scaner

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const handleServiceSelect = (serviceType) => {
    setSelectedService(serviceType);
    setCurrentStep(2); // Advance to step 2 on service selection
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setCurrentStep(3);
  };

  const handlePayProduct = async () => {
    try {
      const body = {
        productId: selectedProduct.ProductId,
        accountId: phoneNumber, // Use the phone number from state
        amount: selectedProduct.Amount,
      };
      const response = await phoneRecharge(body);
      console.log("Response:", response);
    } catch (error) {
      console.error("Error paying product:", error);
    }
  };

  const handleScanProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const body = {
        name: selectedScaner.name, // Enviar el nombre del scaner seleccionado
        barcode: barcodeNumber,    // Enviar el código de barras ingresado
      };
  
      console.log('Datos enviados:', body); // Para ver los datos que se están enviando
  
      const response = await axios.post(`${api}/scans`, body, {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token de autenticación
        },
      });
  
      if (response.status === 201) {
        console.log("Código de barras guardado exitosamente:", response.data);
        alert("Código de barras guardado exitosamente");
        setBarcodeNumber(""); // Limpiar el campo después de guardar
      } else {
        console.error("Error al guardar el código de barras:", response.data);
      }
    } catch (error) {
      console.error("Error al guardar el código de barras:", error);
    }
  };
  

  const handleScanSelect = (scaner) => {
    console.log("Scan seleccionado:", scaner); // Para verificar si la función se está llamando
    setSelectedScaner(scaner);
    setCurrentStep(3); // Cambiar a paso 3
  };

  // Function to fetch services from the API
  const fetchServices = async () => {
    try {
      const response = await axios.get(`${api}/emida/products`);
      setService(response.data);

      // Extract unique categories for the filter bar
      const uniqueCategories = [
        ...new Set(response.data.map((item) => item.ProductCategory)),
      ];
      setCategories(uniqueCategories);

      // Only set the selected category the first time categories are loaded
      if (isFirstLoad && uniqueCategories.length > 0) {
        setSelectedCategory(uniqueCategories[0]);
        setIsFirstLoad(false); // After the first load, do not set again
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchPaymentServices = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${api}/scans`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en los headers
        },
      });
      setScan(response.data.data);
      console.log("Servicios obtenidos:", response.data); // Aquí puedes ver los datos de la API
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Filter services by selected category
  const filteredServices =
    selectedCategory === null
      ? [] // If no category is selected, do not show any service
      : service.filter((item) => item.ProductCategory === selectedCategory);

  useEffect(() => {
    fetchServices();
    fetchPaymentServices();
  }, [selectedService]);

  return (
    <>
      <header className="grid grid-cols-4 w-full h-16">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`flex justify-center items-center cursor-pointer ${
              currentStep === step
                ? `bg-orange-500 text-white`
                : `bg-gray-${100 + step * 100}`
            }`}
          >
            <h1 className="text-xl">{`${step}. ${
              step === 1
                ? "Tipo de servicio"
                : step === 2
                ? "Opciones"
                : step === 3
                ? "Pago"
                : "Resumen"
            }`}</h1>
          </div>
        ))}
      </header>

      <main className="min-h-screen bg-gray-100 w-[100vw] flex justify-center items-center">
        <Link
          to="/"
          className="fixed top-16 left-4 z-40 w-1/6 mt-4 bg-gray-300 px-6 py-2 rounded-full cursor-pointer hover:bg-gray-400"
        >
          Cancelar
        </Link>

        {currentStep === 1 && <Step1 onServiceSelect={handleServiceSelect} />}

        {currentStep === 2 && selectedService === "recargas" && (
          <>
            <div>
              <div className="flex justify-center mt-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`mx-2 px-4 py-2 rounded-md ${
                      selectedCategory === category
                        ? "bg-orange-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {filteredServices.length > 0 ? (
                <MobileServices
                  service={filteredServices}
                  onSelectProduct={handleProductSelect}
                />
              ) : (
                <h1>No hay servicios disponibles en esta categoría</h1>
              )}
            </div>
          </>
        )}

        {currentStep === 2 && selectedService === "pagos" && (
          <div className="grid grid-cols-2 gap-6">
          {scan.map((scaner) => (
            <div
              key={scaner._id}
              onClick={() => handleScanSelect(scaner)} // Al hacer clic selecciona el scaner
              className="bg-white border border-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {scaner.name || "Sin nombre"}
              </h3>
              <p className="text-lg text-gray-600">
                Código de barras:{" "}
                <span className="font-semibold text-gray-700">
                  {scaner.barcode || "N/A"}
                </span>
              </p>
            </div>
          ))}
        </div>
        
        )}

        {/* Formulario del código de barras solo se muestra en el paso 3 */}
        {currentStep === 3 && selectedScaner && (
        <div className="pb-[250px]">
          <div className="flex flex-col items-center justify-center bg-white rounded-md shadow-lg py-4 px-10">
            <h1 className="text-2xl font-normal m-5">
              Escaneo del código de barras para{" "}
              <span className="text-orange-500 font-semibold">
                {selectedScaner.name || "Producto sin nombre"}
              </span>
            </h1>
            <p className="text-3xl font-normal">
              Código de barras: {selectedScaner.barcode || "N/A"}
            </p>
            <input
              placeholder="000-000-0000-000-00000"
              type="tel"
              className={`px-5 py-4 w-3/4 rounded-md shadow-md m-5 text-3xl focus:border-orange-400 ${barcodeNumber.length !== 18 && barcodeNumber.length > 0 ? 'border-red-500' : ''}`} // Estilo rojo si no tiene 18 caracteres
              value={barcodeNumber}
              onChange={(e) => setBarcodeNumber(e.target.value)} // Update the state on input change
            />
            {barcodeNumber.length !== 18 && barcodeNumber.length > 0 && (
              <p className="text-red-500">El código de barras debe tener exactamente 18 caracteres.</p>
            )}
            <button
              className="bg-orange-500 px-5 py-4 w-3/4 rounded-md shadow-md m-5 text-white"
              onClick={handleScanProduct}
              disabled={barcodeNumber.length !== 18} // Deshabilitar el botón si no tiene 18 caracteres
            >
              Escanear
            </button>
          </div>
        </div>
      )}


        {currentStep === 3 && selectedProduct && (
          <div className="pb-[250px]">
            <div className="flex flex-col items-center justify-center bg-white rounded-md shadow-lg py-4 px-10">
              <h1 className="text-2xl font-normal m-5">
                Ingresa el número para{" "}
                <span className="text-orange-500 font-semibold">
                  {selectedProduct?.ProductName || "Producto sin nombre"}{" "}
                </span>
              </h1>
              <img
                className="w-[50%] h-25 mx-auto"
                src={
                  selectedProduct?.ReferenceParameters?.Reference1?.URLImage ||
                  "https://via.placeholder.com/150"
                }
                alt={selectedProduct?.ProductName || "Producto sin nombre"}
              />
              <input
                placeholder="000-000-0000"
                type="tel"
                className="px-5 py-4 w-3/4 rounded-md shadow-md m-5 text-3xl focus:border-orange-400"
                value={phoneNumber} // Bind the input value to the state
                onChange={(e) => setPhoneNumber(e.target.value)} // Update the state on input change
              />
              <p className="text-3xl font-normal">
                {selectedProduct.Amount} {selectedProduct.CurrencyCode}
              </p>
              <button
                className="bg-orange-500 px-5 py-4 w-3/4 rounded-md shadow-md m-5 text-white"
                onClick={handlePayProduct} // Call the function without parameters
              >
                Pagar
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2>Resumen de la transacción para {selectedService}</h2>
            {/* Aquí puedes mostrar el resumen de la transacción */}
          </div>
        )}
      </main>
    </>
  );
}
