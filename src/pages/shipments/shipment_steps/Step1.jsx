import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import Logo from "../../../assets/images/logo.webp";
import animationMap from "../../../assets/lotties/js/map.json";
import { useState } from "react";
export default function Step1({
  handleClick,
  destinationCP,
  onCPChange,
  handleWeightChange,
  handlePackage,
}) {
  const [packageType, setPackageType] = useState("sobre");

  const handleCPChange = (event) => {
    onCPChange(event.target.value);
  };

  const handlePackageTypeChange = (event) => {
    setPackageType(event.target.value); // Actualizamos el tipo de paquete seleccionado
  };

  const handleContinue = () => {
    // Si el tipo de paquete es sobre, ir al paso 3, si no, ir al paso 2
    if (packageType === "sobre") {
      handleWeightChange(0.5);
      handlePackage(packageType);
      handleClick(3);
    } else {
      handlePackage(packageType);

      handleClick(2);
    }
  };

  return (
    <>
      <img src={Logo} alt="DagPacketLogo" className="fixed top-16 w-1/4 mt-4" />

      <div className="flex flex-col justify-center items-center gap-16 w-[100vw] absolute h-full">
        <Lottie
          animationData={animationMap}
          loop
          autoplay
          background="transparent"
          speed={1.5}
          style={{ width: 300, height: 300 }}
        />
        <h1 className="text-4xl font-semibold mx-8 text-center">
          Ingresa el <span className="text-orange-500">Código Postal</span> del
          destino
        </h1>
        <div className="flex flex-row items-center gap-5">
          <input
            type="text"
            name="destinationCP"
            id="destinationCP"
            placeholder="Ej. 47260"
            className="text-4xl text-center p-2 bg-white shadow-md  rounded-md"
            maxLength="5"
            value={destinationCP}
            onChange={handleCPChange}
            required
          />
          <div className="flex flex-col gap-5">
            <label htmlFor="">Tipo de paquete</label>
            <select
              onChange={handlePackageTypeChange}
              value={packageType}
              name="packageType"
              id="packageType"
              className=" p-2 bg-white shadow-md rounded-md">
              <option value="sobre">Sobre</option>
              <option value="paquete">Paquete</option>
            </select>
          </div>
        </div>
        <button
          type="button" // Cambiado a button sin submit, solo ejecuta la función
          className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
          onClick={handleContinue} // Manejador para cambiar el paso
        >
          Continuar
        </button>
      </div>
    </>
  );
}
