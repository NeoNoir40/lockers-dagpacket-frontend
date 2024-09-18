import React from 'react';
import Logo from "../../assets/images/logo.webp";
import LottieAnimation from "./LottieAnimation";
const Header = () => (
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
      <LottieAnimation
        src="./band.json"
        style={{ width: "50%", alignSelf: "center" }}
      />
    </div>
  </div>
);

export default Header;
