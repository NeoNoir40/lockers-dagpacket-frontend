import React, { useEffect, useRef, useState } from 'react';
import '../../assets/css/VirtualKeyboard.css';

const VirtualKeyboard = ({ onKeyPress, activeInput, setActiveInput, onSubmit }) => {
  const keyboardRef = useRef(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const handleKeyClick = (key) => {
    if (!activeInput) return;

    if (key === 'X') {
      onKeyPress((prev) => prev.slice(0, -1));
    } else if (key === '✔') {
      setActiveInput(null); // Ocultar el teclado
      setOverlayVisible(false); // Ocultar el overlay
      onSubmit(); // Llama a la función de envío del formulario
    } else {
      onKeyPress((prev) => prev + key);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (keyboardRef.current && !keyboardRef.current.contains(event.target) && event.target !== activeInput) {
        setActiveInput(null); // Oculta el teclado si se hace clic fuera
        setOverlayVisible(false); // Ocultar el overlay
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeInput, setActiveInput]);

  useEffect(() => {
    if (activeInput) {
      setOverlayVisible(true); // Mostrar overlay cuando el teclado está activo
    } else {
      setOverlayVisible(false); // Ocultar overlay cuando no está activo
    }
  }, [activeInput]);

  return (
    <>
      {overlayVisible && <div className="overlay" />}
      <div
        ref={keyboardRef}
        className={`keyboard ${activeInput ? 'visible' : 'hidden'}`}
        style={{ position: 'fixed', bottom: 0 }}
      >
        <div className="keyboard-row">
          <div className="key" onClick={() => handleKeyClick('1')}>1</div>
          <div className="key" onClick={() => handleKeyClick('2')}>2</div>
          <div className="key" onClick={() => handleKeyClick('3')}>3</div>
        </div>
        <div className="keyboard-row">
          <div className="key" onClick={() => handleKeyClick('4')}>4</div>
          <div className="key" onClick={() => handleKeyClick('5')}>5</div>
          <div className="key" onClick={() => handleKeyClick('6')}>6</div>
        </div>
        <div className="keyboard-row">
          <div className="key" onClick={() => handleKeyClick('7')}>7</div>
          <div className="key" onClick={() => handleKeyClick('8')}>8</div>
          <div className="key" onClick={() => handleKeyClick('9')}>9</div>
        </div>
        <div className="keyboard-row">
          <div className="key special" onClick={() => handleKeyClick('X')}>X</div>
          <div className="key" onClick={() => handleKeyClick('0')}>0</div>
          <div className="key special" onClick={() => handleKeyClick('✔')}>✔</div>
        </div>
      </div>
    </>
  );
};

export default VirtualKeyboard;
