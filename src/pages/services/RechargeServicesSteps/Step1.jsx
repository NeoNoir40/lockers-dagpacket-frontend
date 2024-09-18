import React from "react";
import Lottie from "lottie-react";
import phoneAnimation from "../../../assets/lotties/js/phone_animation.json";
import paymentAnimation from "../../../assets/lotties/js/payment.json";

export default function Step1({ onServiceSelect }) {
  const handleServiceClick = (serviceType) => {
    onServiceSelect(serviceType); // Llama a la función pasada como prop cuando se selecciona un servicio
  };

  return (
    <div id="serviceButtons" className="grid grid-cols-2 gap-6 w-[60vw] mb-8">
      <div
        id="recargas"
        onClick={() => handleServiceClick("recargas")} // Selecciona recargas
        className="hover:scale-105 service-button hover:cursor-pointer bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center justify-center"
      >
        <Lottie
          animationData={phoneAnimation}
          loop
          autoplay
          style={{ width: "60%", height: "70%" }}
        />
        <span className="text-2xl font-medium">Recargas</span>
      </div>
      <div
        id="pagos"
        onClick={() => handleServiceClick("pagos")} // Selecciona pagos
        className="hover:scale-105 service-button hover:cursor-pointer bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center justify-center"
      >
        <Lottie
          animationData={paymentAnimation}
          loop
          autoplay
          style={{ width: "60%", height: "70%" }}
        />
        <span className="text-2xl font-medium">Pago de Servicios</span>
      </div>
    </div>
  );
}
