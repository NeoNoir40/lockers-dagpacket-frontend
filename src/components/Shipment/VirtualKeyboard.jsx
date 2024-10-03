import React from "react";
import image from '../../assets/images/logo.webp';

const VirtualKeyboard = ({ onKeyPress }) => {
  const handleKeyPress = (key) => {
    if (key === "←") {
      onKeyPress(""); // Enviar una cadena vacía para indicar un retroceso
    } else if (key === "Enter") {
      onKeyPress("Enter");
    } else if (key === "Espacio") {
      onKeyPress(" ");
    } else {
      onKeyPress(key);
    }
  };

  const renderRow = (keys) => (
    <div className="flex justify-center mb-2">
      {keys.map((key) => (
        <button
          key={key}
          onClick={() => handleKeyPress(key)}
          className={`border rounded-md h-10 min-w-10 p-2 m-1 ${
            key === "Espacio" || key === "Enter" || key === "." || key === "@" || key === "←"
              ? "bg-[#353068] text-white hover:bg-[#534baf]" // Color especial para teclas
              : "border-orange-500 text-orange-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500" // Color normal
          }`}
        >
          {key}
        </button>
      ))}
    </div>
  );

return (
    <div className="bg-white p-4 rounded-lg shadow-md overflow-hidden flex flex-col items-center">
        {renderRow(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "←"])} {/* Colocar el botón de borrar al lado del 0 */}
        {renderRow(["@", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p"])} {/* Arroba al lado de Q */}
        {renderRow(["a", "s", "d", "f", "g", "h", "j", "k", "l", ])} {/* Mover Enter al final de la fila */}
        {renderRow(["z", "x", "c", "v", "b", "n", "m"])}
        {renderRow([".", "Espacio"])} {/* Punto y Espacio en una fila separada */}
        {/* Logo en el centro inferior */}
        <div className="flex justify-center mt-4 mb-2">
            <img src={image} alt="keyboard" className=" h-[20px]" /> {/* Tamaño pequeño */}
        </div>
    </div>
);
};

export default VirtualKeyboard;
