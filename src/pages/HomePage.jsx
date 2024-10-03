import React, { useState, useEffect } from "react";
import "../assets/css/home.css";
import Logo from "../assets/images/logo.webp";
import Lottie from "lottie-react";
import animationData from "../assets/lotties/js/band.json";
import animationServices from "../assets/lotties/js/services_animation.json";
import animationShipping from "../assets/lotties/js/shipping.json";
import animationBills from "../assets/lotties/js/bills.json";
import animationPackage from "../assets/lotties/js/packagelottie.json";
import Box from "../assets/images/package.png";
import { useNavigate } from "react-router-dom";
import { getCode } from "country-list";
import { Link } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleClick = (path) => {
    window.location.href = path;
  };



  


 
  return (
    <main className="flex flex-col w-full min-h-[100vh] bg-white overflow-hidden">
      
      <div id="topSection" className="grid grid-cols-2 w-full h-[55vh]">
        <div className="flex flex-col gap-4 justify-center items-center">
          <img src={Logo} alt="Logo" className="mb-12 w-1/2" />
          <h1 className="text-4xl font-semibold mx-8">
            Enfócate en lo que importa, déjanos los{" "}
            <span className="text-orange-500">envíos a nosotros</span>
          </h1>
          <p className="text-2xl font-normal mx-8">
            Con nuestros servicios de envío internacional y nacional, puedes
            tener la tranquilidad de que tus paquetes llegarán a tiempo y en
            perfectas condiciones
          </p>
        </div>
        <div className="flex justify-center items-center">
          <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{ width: "50%", alignSelf: "center" }}
          />
        </div>
      </div>
      <div className="w-full h-[10vh]"></div>
      <div className="grid grid-cols-3 bg-red-600 w-full h-[35vh]">
        <Link
          to={"/envios"}
          className="service1 service flex flex-col justify-around items-center bg-gray-100 w-full h-full relative overflow-hidden">
          <div className="circle absolute w-52 h-52 bg-[#FFFFFF35] rounded-full"></div>
          <div className="flex flex-col justify-center items-center px-12 gap-1">
            <h3 className="text-3xl font-medium text-center z-10">Envíos</h3>
            <p className="serviceInfo text-center">
              Pesa tu paquete, identifica tu locker, y realiza tu envío Nacional
              o Internacional
            </p>
          </div>
          <img
            src={Box}
            alt="Envio"
            className="z-10 transition-all"
            style={{ width: "60%", height: "70%" }}
          />
        </Link>
        <div className="slide1 absolute grid grid-cols-2 h-[55vh] bg-white z-20">
          <div className="flex flex-col gap-4 justify-center items-center">
            <img src={Logo} alt="DagPacket Logo" className="w-1/2 mb-12" />
            <h1 className="text-4xl font-semibold mx-8">
              Realiza envíos{" "}
              <span className="text-orange-500">
                nacionales e internacionales
              </span>
            </h1>
            <p className="text-2xl font-normal mx-8">
              Pesa y dimensiona de forma fácil tu paquete, ingrésalo en el
              locker indicado y nosotros nos encargaremos de lo demás
            </p>
          </div>
          <div className="flex justify-center items-center">
            <Lottie
              animationData={animationShipping}
              loop
              autoplay
              style={{ width: "60%" }}
            />
          </div>
        </div>
        <div
          className="service2 service flex flex-col justify-around items-center bg-gray-100 w-full h-full relative overflow-hidden"
          onClick={() => navigate("/recolectar")}>
          <div className="circle absolute w-52 h-52 bg-[#FFFFFF35] rounded-full"></div>
          <div className="flex flex-col justify-center items-center px-12 gap-1">
            <h3 className="text-3xl font-medium text-center z-10">
              Recibir Paquetes
            </h3>
            <p className="serviceInfo text-center">
              Escanea tu código QR y recolecta tu paquete en nuestros lockers
            </p>
          </div>
          <img
            src={Box}
            alt="Envio"
            className="z-10 transition-all"
            style={{ width: "60%", height: "70%" }}
          />
        </div>
        <div className="slide2 absolute grid grid-cols-2 h-[55vh] bg-white z-20">
          <div className="flex flex-col gap-4 justify-center items-center">
            <img src={Logo} alt="DagPacket Logo" className="w-1/2 mb-12" />
            <h1 className="text-4xl font-semibold mx-8">
              Recoge tu paquete en
              <span className="text-orange-500"> nuestros Lockers</span>
            </h1>
            <p className="text-2xl font-normal mx-8">
              Escanea tu código QR o ingresa tu código y obtén de forma rápida y
              sencilla tu envío
            </p>
          </div>
          <div className="flex justify-center items-center">
            <Lottie
              animationData={animationPackage}
              loop
              autoplay
              style={{ width: "60%" }}
            />
          </div>
        </div>
        <Link
          to={"/servicios"}
          className="service3 service flex flex-col justify-around items-center bg-gray-100 w-full h-full relative overflow-hidden">
          <div className="circle absolute w-52 h-52 bg-[#FFFFFF35] rounded-full"></div>
          <div className="flex flex-col justify-center items-center px-12 gap-1 hover:text-white ">
            <h3 className="text-3xl font-medium text-center z-10 ">
              Recargas y Servicios
            </h3>
            <p className="serviceInfo  text-center hover:text-white">
              Recarga saldo a tu número o paga tus servicios favoritos de manera
              rápida
            </p>
          </div>
          <Lottie
            animationData={animationServices}
            loop
            autoplay
            style={{ width: "60%", height: "70%" }}
          />
        </Link>
        <div className="slide3 absolute grid grid-cols-2 h-[55vh] bg-white z-20">
          <div className="flex flex-col gap-4 justify-center items-center">
            <img src={Logo} alt="DagPacket Logo" className="w-1/2 mb-12" />
            <h1 className="text-4xl font-semibold mx-8">
              Recarga saldo o{" "}
              <span className="text-orange-500">paga tus servicios</span>
            </h1>
            <p className="text-2xl font-normal mx-8">
              Paga en nuestras pantallas los servicios más comunes como luz,
              cable, entretenimiento o recarga saldo a tu número telefónico
            </p>
          </div>
          <div className="flex justify-center items-center">
            {/* <Lottie
              animationData={animationBills}
              loop
              autoplay
              style={{ width: "60%" }}
            /> */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
