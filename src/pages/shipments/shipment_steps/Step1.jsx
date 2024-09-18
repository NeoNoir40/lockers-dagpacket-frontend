import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import Logo from "../../../assets/images/logo.webp";
import animationMap from "../../../assets/lotties/js/map.json";

export default function Step1({ handleClick, destinationCP, onCPChange }) {
  const handleCPChange = (event) => {
    onCPChange(event.target.value);
  };

  const handleContinue = () => {
    // Cambiar al paso 2 al hacer clic en Continuar
    handleClick(2);
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
          Ingresa el <span className="text-orange-500">Código Postal</span> del destino
        </h1>
        <div className="flex flex-col items-center">
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
          <button
            type="button" // Cambiado a button sin submit, solo ejecuta la función
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
            onClick={handleContinue} // Manejador para cambiar el paso
          >
            Continuar
          </button>
        </div>
      </div>
    </>
  );
}
