import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import animtationQr from "../../assets/lotties/js/qrscan.json";
import animationLocker from "../../assets/lotties/js/locker.json";
import { recolectGabeta } from "../../../context/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert
import { Link } from "react-router-dom";
import "../../assets/css/shipment/shipment.css";

export default function Recolect() {
  const [currentStep, setCurrentStep] = useState(1);
  const [gaveta, setGaveta] = useState([]);

  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await recolectGabeta(data);
      console.log(response);
      if (response.success) {
        setCurrentStep(2);
        setGaveta(response.message);
      }else{
        Swal.fire({
          title: "Error",
          text: response.message,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Effect to show notification after 5 seconds in step 2
  useEffect(() => {
    if (currentStep === 2) {
      const timer = setTimeout(() => {
        Swal.fire({
          title: "¡Paquete listo para ser recogido!",
          text: "Puedes recoger tu paquete en la gabeta indicada.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }, 5000); // 5 segundos

      return () => clearTimeout(timer); // Limpiar el timeout al desmontar
    }
  }, [currentStep]);

  console.log(gaveta);

  return (
    <body className="overflow-hidden">
      <header className="grid grid-cols-3 w-full h-16 ">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`flex justify-center items-center cursor-pointer ${
              currentStep === step
                ? `bg-orange-500`
                : `bg-gray-${100 + step * 100}`
            }`}>
            <h1 className="text-xl">{`${step}. ${
              step === 1
                ? "Escanea tu código QR"
                : step === 2
                ? "Recoge tu paquete"
                : step === 3
                ? "Finalizar"
                : ""
            }`}</h1>
          </div>
        ))}
      </header>
      <main className="h-[44vw] w-[100vw] flex justify-center items-center bg-gray-100 overflow-hidden">
      <Link
          to="/"
          className="fixed top-16 left-4 z-40 w-1/6 mt-4 bg-gray-300 w-auto px-6 py-2 rounded-full cursor-pointer hover:bg-gray-400"
          type="button">
          Cancelar
        </Link>
        {currentStep === 1 && (
          <div className="flex flex-col items-center gap-10">
            <Lottie
              animationData={animtationQr}
              loop
              autoplay
              style={{ width: "60%" }}
            />
            <h1 className="text-4xl font-semibold mx-8 text-center ">
              Escanea tu <span className="text-orange-500">Código QR</span>
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                className="text-3xl w-full p-4 rounded-lg border-2 border-orange-400 mt-2"
                type="text"
                placeholder="Ingresa tu código de pedido"
                {...register("pin")}
              />
            </form>
          </div>
        )}
        {currentStep === 2 && (
          <div className="step2 flex flex-col justify-center items-center gap-8 bg-white p-10 rounded-md shadow-md">
            <h1 className="text-3xl font-semibold mx-8 text-center">
              Espera a que la gabeta indicada se abra e{" "}
              <span className="text-orange-500">introduce tu paquete</span>
            </h1>
            <div className="flex justify-center items-center h-[40vh] w-full max-w-5xl px-4">
              <div className="screen-container grid gap-1 h-full w-1/5 bg-gray-400 border-4 border-gray-400">
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
          </div>
        )}
        {currentStep === 3 && (
          <div className="step3 flex flex-col justify-center items-center gap-16 w-[100vw] absolute h-full ">
            <Lottie
              animationData={animationLocker}
              loop
              autoplay
              background="transparent"
              speed={1.5}
              style={{ width: 300, height: 300 }}
            />
            <h1 className="text-4xl font-semibold mx-8 text-center">
              Asegúrate de que el locker esté{" "}
              <span className="text-orange-500">correctamente cerrado</span>
            </h1>
          </div>
        )}
      </main>
    </body>
  );
}
