import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import Logo from "../../../assets/images/logo.webp";
import animationMap from "../../../assets/lotties/js/map.json";
import animationSobre from '../../../assets/lotties/js/sobre.json'
import animationCaja from '../../../assets/lotties/js/caja.json'
import updateOrder from '../../../assets/lotties/js/updateOrder.json'
import { useState, useEffect } from "react";
import VirtualKeyboard from "../../../components/VirtualKeyboard.jsx/VirtualKerboard";
import { useAuth } from "../../../../context/AuthContext";
import { get } from "react-hook-form";

export default function Step1({
  handleClick,
  destinationCP,
  onCPChange,
  handleWeightChange,
  handlePackage,
}) {
  const [packageType, setPackageType] = useState("");
  const [inputValue, setInputValue] = useState('');
  const [packageIsSelected, setPackageIsSelected] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const {getGabetas} = useAuth();

  const handleFocus = (inputRef) => {
    setActiveInput(inputRef);
  };

  const handleCPChange = (event) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 5);
    setInputValue(value);
    onCPChange(value);
  };

  const handlePackageTypeChange = (event) => {
    setPackageType(event.target.value);
  };

  const handleContinue = () => {
    // Update the postal code before continuing
    if (inputValue) {
      onCPChange(inputValue); // Ensure the postal code is set
    }

    // If the package type is 'Sobre', go to step 3, else go to step 2
    if (packageType === "Sobre") {
      handleWeightChange(0.5);
      handlePackage(packageType);
      handleClick(3);
    } else {
      handlePackage(packageType);
      handleClick(2);
    }
  };

  const handleSubmit = () => {
    handleContinue();
  };

  const selectPackageType = (type) => {
    setPackageType(type);
    setPackageIsSelected(true);
  };

  useEffect(() => {
    if (handleContinue) {
      getGabetas();
    }
  }, []);

  return (
    <>
      <img src={Logo} alt="DagPacketLogo" className="fixed top-16 w-1/4 mt-4" />

      {packageIsSelected ? (
        <>
          <div className="flex flex-col justify-center items-center gap-16 w-[100vw] absolute overflow-hidden">
            <Lottie
              animationData={animationMap}
              loop
              autoplay
              background="transparent"
              speed={1.5}
              style={{ width: 300, height: 300 }}
            />
            <h1 className="text-4xl font-semibold mx-8 text-center">
              Ingresa el <span className="text-orange-500">Código Postal</span> del destino
            </h1>

            <VirtualKeyboard
              onKeyPress={setInputValue}
              activeInput={activeInput}
              setActiveInput={setActiveInput}
              onSubmit={handleSubmit}
            />

            <div className="flex flex-row items-center gap-5">
              <input
                type="text"
                name="destinationCP"
                id="destinationCP"
                placeholder="Ej. 47260"
                className="text-4xl text-center p-2 bg-white shadow-md rounded-md"
                maxLength="5"
                value={inputValue.slice(0, 5)}
                onFocus={() => handleFocus("destinationCP")}
                onChange={handleCPChange}
                required
              />
              <div className="flex flex-col gap-5">
                <label htmlFor="packageType">Tipo de paquete</label>
                <input
                  type="text"
                  value={packageType}
                  readOnly
                  className="p-2 bg-gray-200 text-center shadow-md rounded-md"
                />
              </div>
            </div>
            <button
              type="button"
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
              onClick={handleContinue}
            >
              Continuar
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center gap-16 w-[100vw] absolute overflow-hidden">
            <h1 className="text-4xl font-semibold mx-8 text-center">
              Selecciona el tipo de <span className="text-orange-500">paquete</span>
            </h1>
            <div className="flex flex-row gap-5 justify-center">
              <div
                className="p-6 bg-white shadow-md rounded-md cursor-pointer hover:shadow-lg"
                onClick={() => selectPackageType("Sobre")}
              >
                <h2 className="text-2xl text-center">Sobre</h2>
                <Lottie
              animationData={animationSobre}
              loop
              autoplay
              background="transparent"
              speed={1}
              style={{ width: 500, height: 500 }}
            />
              </div>
              <div
                className="p-6 bg-white shadow-md rounded-md cursor-pointer hover:shadow-lg"
                onClick={() => selectPackageType("Paquete")}
              >
                <h2 className="text-2xl text-center">Paquete</h2>
                <Lottie
              animationData={animationCaja}
              loop
              autoplay
              background="transparent"
              speed={1}
              style={{ width: 500, height: 500 }}
            />
              </div>
              <div
                className="p-6 bg-white shadow-md rounded-md cursor-pointer hover:shadow-lg flex flex-col items-center justify-center w-[30%]"
                onClick={() => selectPackageType("Paquete")}
              >
             <div className="flex flex-col ">
             <h2 className="text-2xl text-center">Actualiza tu orden</h2>
                <p className="text-xl text-center ">
                  Si cuentas con algun folio de un pedido con el pago pendiente puedes actualizar tu orden y pagar en la terminal.
                </p>
             </div>
                <Lottie
              animationData={updateOrder}
              loop
              autoplay
              background="transparent"
              speed={1}
              style={{ width: 500, height: 500 }}
            />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
