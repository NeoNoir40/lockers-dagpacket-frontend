import React, { useState } from "react";
import image from '../../assets/images/logo.webp';

const VirtualKeyboardFull = ({ onKeyPress }) => {
  const [isUpperCase, setIsUpperCase] = useState(false); // Estado para controlar si está en mayúsculas

  const handleKeyPress = (key) => {
    if (key === "←") {
      onKeyPress(""); // Enviar una cadena vacía para indicar un retroceso
    } else if (key === "Espacio") {
      onKeyPress(" ");
    } else if (key === "Mayus") {
      setIsUpperCase(!isUpperCase); // Alternar entre mayúsculas y minúsculas
    } else {
      const character = isUpperCase ? key.toUpperCase() : key;
      onKeyPress(character);
    }
  };

  const renderRow = (keys) => (
    <div className="flex justify-center mb-2">
      {keys.map((key) => (
        <button
          key={key}
          onClick={() => handleKeyPress(key)}
          className={`border rounded-md min-h-[50px] min-w-[60px] p-2 m-1 m-1 ${
            key === "Espacio" || key === "Enter" || key === "." || key === "@" || key === "←" || key === "Mayus"
              ? "bg-[#353068] text-white hover:bg-[#534baf]" // Color especial para teclas
              : "border-orange-500 text-orange-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500" // Color normal
          }.  ${key === "Mayus" && isUpperCase ? "bg-[#534baf]" : ""}
          `}
        >
          {key === "Mayus" ? "Mayus" : key} {/* Representar la tecla Shift */}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md overflow-hidden flex flex-col items-center">
      {renderRow(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "←"])}
      {renderRow(["@", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p"])}
      {renderRow(["a", "s", "d", "f", "g", "h", "j", "k", "l","Mayus",])}
      {renderRow([ "z", "x", "c", "v", "b", "n", "m", "."])} {/* Agregar Shift */}
      {renderRow(["Espacio"])}
      {/* Logo en el centro inferior */}
      <div className="flex justify-center mt-4 mb-2">
        <img src={image} alt="keyboard" className="h-[20px]" /> {/* Tamaño pequeño */}
      </div>
    </div>
  );
};

export default VirtualKeyboardFull;
