import { useState, useRef, useEffect } from "react";
import VirtualKeyboardFull from "./VirtualKeyboard.jsx"; // Asegúrate de importar correctamente
export const FormSection = ({
  title,
  data,
  onChange,
  disabled,
  inputFields,
  inputFieldsSender,
  activeRecipient,
}) => {
  const [activeInput, setActiveInput] = useState(null); // Estado del input activo
  const keyboardRef = useRef(null); // Referencia para el teclado virtual
  const handleKeyPress = (val) => {
    if (activeInput) {
      let currentValue = data[activeInput] || "";
      let newValue;

      if (activeInput === "phone") {
        // Para el campo de teléfono, aplicamos la lógica especial
        if (val === "") {
          // Si es borrar, quitamos el último dígito
          newValue = currentValue.slice(0, -1);
        } else {
          // Si es añadir, concatenamos y luego aplicamos las restricciones
          newValue = (currentValue + val).replace(/\D/g, "").slice(0, 10);
        }
      } else {
        // Para otros campos, mantenemos la lógica original
        newValue = val === "" ? currentValue.slice(0, -1) : currentValue + val;
      }

      console.log(
        `Input: ${activeInput}, Current Value: ${currentValue}, New Value: ${newValue}`
      );
      onChange({ ...data, [activeInput]: newValue });
    }
  };

  const handleClickOutside = (event) => {
    if (keyboardRef.current && !keyboardRef.current.contains(event.target)) {
      // setActiveInput(null); // Si decides ocultarlo
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    onChange({ ...data, phone: value });
  };


  return (
    <div className={` ${activeRecipient ? "" : "bg-gray-900 rounded-xl"}  `}>
      <div
        className={`bg-white  ${
          activeRecipient ? "" : "opacity-90"
        }  p-6 rounded-lg shadow-md`}
      >
        <h3 className="text-2xl font-semibold mb-4">{title}</h3>
        <div className="grid grid-cols-1 gap-4">
          {/* Campo "Dirección" ocupa el ancho completo */}
          <div className="w-full p-1">
            <InputField
              label="Dirección"
              value={data.address}
              onChange={(e) => onChange({ ...data, address: e.target.value })}
              disabled={disabled}
              onFocus={() => setActiveInput("address")}
              className="w-full" // Clase para ancho completo
            />
          </div>

          {/* Campos "Nombre" y "Correo Electrónico" en una fila */}
          <div className="grid grid-cols-2 gap-4 p-1">
            <InputField
              label="Nombre"
              value={data.name}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
              disabled={disabled}
              onFocus={() => setActiveInput("name")}
            />
         <InputField
              label="Teléfono"
              value={data.phone}
              onChange={handlePhoneChange}
              disabled={disabled}
              onFocus={() => setActiveInput("phone")}
              maxLength={10}
              type="tel"
            />
          </div>

          {/* Campo "Teléfono" ocupa el ancho completo */}
          <div className="w-full p-1">
          <InputField
              label="Correo Electrónico"
              value={data.email}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              disabled={disabled}
              onFocus={() => setActiveInput("email")}
              className="w-full"

            />
            
          </div>

          {/* Campos "País" y "Código Postal" en una fila */}
          <div className="grid grid-cols-2 gap-4 p-1">
            <InputField
              label="País"
              value={data.country}
              onChange={(e) => onChange({ ...data, country: e.target.value })}
              disabled={disabled}
              onFocus={() => setActiveInput("country")}
            />
            <InputField
              label="Código Postal"
              value={data.zipCode}
              onChange={(e) => onChange({ ...data, zipCode: e.target.value })}
              disabled={disabled}
              onFocus={() => setActiveInput("zipCode")}
            />
          </div>

          {/* Campos "Estado" y "Ciudad" en una fila */}
          <div className="grid grid-cols-2 gap-4 p-1">
            <InputField
              label="Estado"
              value={data.state}
              onChange={(e) => onChange({ ...data, state: e.target.value })}
              disabled={disabled}
              onFocus={() => setActiveInput("state")}
            />
            <InputField
              label="Ciudad"
              value={data.city}
              onChange={(e) => onChange({ ...data, city: e.target.value })}
              disabled={disabled}
              onFocus={() => setActiveInput("city")}
            />
          </div>

          {/* Campos "Colonia" y "Calle" en una fila */}
          <div className="grid grid-cols-2 gap-4 p-1">
            <InputField
              label="Colonia"
              value={data.colony}
              onChange={(e) => onChange({ ...data, colony: e.target.value })}
              disabled={disabled}
              onFocus={() => setActiveInput("colony")}
            />
            <InputField
              label="Calle"
              value={data.street}
              onChange={(e) => onChange({ ...data, street: e.target.value })}
              disabled={disabled}
              onFocus={() => setActiveInput("street")}
            />
          </div>

          {/* Campos "Número Exterior" y "Número Interior" en una fila */}
          <div className="grid grid-cols-2 gap-4 p-1">
            <InputField
              label="Número Exterior"
              value={data.externalNumber}
              onChange={(e) =>
                onChange({ ...data, externalNumber: e.target.value })
              }
              disabled={disabled}
              onFocus={() => setActiveInput("externalNumber")}
            />
            <InputField
              label="Número Interior"
              value={data.internalNumber}
              onChange={(e) =>
                onChange({ ...data, internalNumber: e.target.value })
              }
              disabled={disabled}
              onFocus={() => setActiveInput("internalNumber")}
            />
          </div>

          {/* Campo "Referencias" ocupa el ancho completo */}
          <div className="w-full p-1">
            <InputField
              label="Referencias"
              value={data.references}
              onChange={(e) =>
                onChange({ ...data, references: e.target.value })
              }
              disabled={disabled}
              onFocus={() => setActiveInput("references")}
              className="w-full" // Clase para ancho completo
            />
          </div>
        </div>

        {/* Teclado virtual siempre visible */}
        <div
          className={`absolute top-[40%] right-[50%] ${
            activeRecipient ? "" : "hidden"
          }`}
          ref={keyboardRef}
        >
          <VirtualKeyboardFull
            className=""
            onKeyPress={handleKeyPress} // Cambiar valor del input
            activeInput={activeInput}
            setActiveInput={setActiveInput}
          />
        </div>
      </div>
    </div>
  );
};
export const SenderFormSection = ({
  title,
  data,
  onChange,
  disabled,
  active,
}) => {
  const [activeInput, setActiveInput] = useState(null); // Estado del input activo
  const keyboardRef = useRef(null); // Referencia para el teclado virtual
  const handleKeyPress = (val) => {
    if (activeInput) {
      let currentValue = data[activeInput] || "";
      let newValue;

      if (activeInput === "phoneSender") {
        // Para el campo de teléfono, aplicamos la lógica especial
        if (val === "") {
          // Si es borrar, quitamos el último dígito
          newValue = currentValue.slice(0, -1);
        } else {
          // Si es añadir, concatenamos y luego aplicamos las restricciones
          newValue = (currentValue + val).replace(/\D/g, "").slice(0, 10);
        }
      } else {
        // Para otros campos, mantenemos la lógica original
        newValue = val === "" ? currentValue.slice(0, -1) : currentValue + val;
      }

      console.log(
        `Input: ${activeInput}, Current Value: ${currentValue}, New Value: ${newValue}`
      );
      onChange({ ...data, [activeInput]: newValue });
    }
  };



  const handleClickOutside = (event) => {
    if (keyboardRef.current && !keyboardRef.current.contains(event.target)) {
      // setActiveInput(null); // Si decides ocultarlo
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={` ${active ? "" : "bg-gray-900 h-[212px] rounded-xl"}  `}>
   

      <div
        className={`bg-white  ${
          active ? "" : "opacity-90"
        } p-6 rounded-lg shadow-md`}
      >
        <h3 className="text-2xl font-semibold mb-4">{title}</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-5 p-2">
            <InputField
              label={"Nombre completo"}
              value={data.nameSender}
              onChange={(e) =>
                onChange({ ...data, nameSender: e.target.value })
              } // Corregido para usar nameSender
              disabled={disabled}
              onFocus={() => setActiveInput("nameSender")} // Asegúrate de que el nombre coincida
            />
                <InputField
            label={"Teléfono"}
            value={data.phoneSender}
            onChange={(e) => onChange({ ...data, phoneSender: e.target.value })} // Corregido para usar phoneSender
            disabled={disabled}
            onFocus={() => setActiveInput("phoneSender")} // Asegúrate de que el nombre coincida
          />
         
          </div>
          <div className="flex w-full p-2" >
          <InputField
              className={"w-full"}
              label={"Correo Electrónico"}
              value={data.emailSender}
              onChange={(e) =>
                onChange({ ...data, emailSender: e.target.value })
              } // Corregido para usar emailSender
              disabled={disabled}
              onFocus={() => setActiveInput("emailSender")} // Asegúrate de que el nombre coincida
            />
          </div>
       
        </div>

        {/* Teclado virtual siempre visible */}
        <div
          className={`absolute ${
            active ? "" : "hidden"
          } top-[45%] right-[50%] `}
          ref={keyboardRef}
        >
          <VirtualKeyboardFull
            onKeyPress={handleKeyPress} // Cambiar valor del input
            activeInput={activeInput}
            setActiveInput={setActiveInput}
          />
        </div>
      </div>
    </div>
  );
};

export const PackageFormSection = ({
  title,
  data,
  onChange,
  disabled,
}) => {
  const [activeInput, setActiveInput] = useState(null); // Estado para el campo activo
  const keyboardRef = useRef(null); // Referencia para el teclado virtual
  const paquete = localStorage.getItem("tipo_paquete");
  const handleKeyPress = (val) => {
    if (activeInput) {
      const currentValue = data[activeInput] || "";
      const newValue =
        val === "" ? currentValue.slice(0, -1) : currentValue + val;
      onChange({ ...data, [activeInput]: newValue });
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 gap-5 w-[500px]">
        <InputField
          label="Descripción"
          value={data.description}
          onChange={(e) => {
            onChange({ ...data, description: e.target.value });
            setActiveInput("description"); // Activa el campo de descripción
          }}
          disabled={disabled}
          onFocus={() => setActiveInput("description")}
          className="w-full h-32 text-xl"
          type="textarea"
        />

        {paquete === "Paquete" && (
          <InputField
            label="Valor Declarado"
            value={data.value}
            onChange={(e) => onChange({ ...data, value: e.target.value })}
            disabled={disabled}
            onFocus={() => setActiveInput("value")}
            type="number"
          />
        )}

        <div className="gap-2 flex">
          <label htmlFor="" className="text-xl">
            Desea asegurar su paquete?
          </label>
          <InputField
            label="Seguro"
            type="checkbox"
            checked={data.insurance}
            onChange={(e) => onChange({ ...data, insurance: e.target.checked })}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Teclado virtual siempre visible */}
      <div
        className={`absolute top-[30%]  ${activeInput ? "" : "hidden"}`}
        ref={keyboardRef}
      >
        <VirtualKeyboardFull
          onKeyPress={handleKeyPress}
          activeInput={activeInput}
          setActiveInput={setActiveInput}
        />
      </div>
    </div>
  );
};

export const InputField = ({
  label,
  value,
  onChange,
  disabled,
  type,
  onFocus,
  className, // Agregar className para personalizar el ancho
  maxLength,
}) => {
  // Verificamos si el tipo es "textarea" para decidir qué tipo de elemento renderizar
  const isTextArea = type === "textarea";

  return isTextArea ? (
    <textarea
      {...(label && { id: label.toLowerCase().replace(" ", "-") })} // Generar id a partir del label
      placeholder={label}
      value={value || ""}
      onChange={onChange}
      onFocus={onFocus} // Ejecuta onFocus para activar el teclado
      disabled={disabled} // Deshabilitar si es Código Postal
      className={`border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${className} ${
        disabled ? "bg-gray-200 cursor-not-allowed" : ""
      }`}
    />
  ) : (
    <input
      {...(label && { id: label.toLowerCase().replace(" ", "-") })} // Generar id a partir del label
      type={type || "text"}
      placeholder={label}
      value={value || ""}
      onChange={onChange}
      onFocus={onFocus} // Ejecuta onFocus para activar el teclado
      disabled={disabled || label === "Código Postal"} // Deshabilitar si es Código Postal
      className={`border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${className} ${
        disabled ? "bg-gray-200 cursor-not-allowed" : ""
      }`}
      maxLength={maxLength} // Limita el número máximo de caracteres
    />
  );
};
