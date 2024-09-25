import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import Logo from "../../../assets/images/logo.webp";
import animationMap from "../../../assets/lotties/js/map.json";
import { useState, useEffect } from "react";
import VirtualKeyboard from "../../../components/VirtualKeyboard.jsx/VirtualKerboard";
export default function Step1({
  handleClick,
  destinationCP,
  onCPChange,
  handleWeightChange,
  handlePackage,
}) {
  const [packageType, setPackageType] = useState("Sobre");
  const [inputValue, setInputValue] = useState('');
  const [activeInput, setActiveInput] = useState(null);

  const handleFocus = (inputRef) => {
    setActiveInput(inputRef);
  };

  const handleCPChange = (event) => {
    const value = event.target.value;
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

    // If the package type is 'sobre', go to step 3, else go to step 2
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

  return (
    <>
      <img src={Logo} alt="DagPacketLogo" className="fixed top-16 w-1/4 mt-4" />

      <div className="flex flex-col justify-center items-center gap-16 w-[100vw] absolute ">
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
            value={inputValue}
            onFocus={() => handleFocus("destinationCP")}
            onChange={handleCPChange}
            required
          />
          <div className="flex flex-col gap-5">
            <label htmlFor="packageType">Tipo de paquete</label>
            <select
              onChange={handlePackageTypeChange}
              value={packageType}
              name="packageType"
              id="packageType"
              className="p-2 bg-white shadow-md rounded-md"
            >
              <option value="Sobre">Sobre</option>
              <option value="Paquete">Paquete</option>
            </select>
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
  );
}
