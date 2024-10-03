import { createContext, useState, useContext, useEffect } from "react";

import {
  loginLocker,
  verifyToken,
  fetchGabetasByLockerId,
  fetchGabetasAviable,
} from "./auth";
import Swal from "sweetalert2";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debería estar trabajando con AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [locker, setLocker] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gabetas, setGabetas] = useState([]);
  const [locker_id, setLockerId] = useState(null);

  const loginRequest = async (data) => {
    try {
      const response = await loginLocker(data);
      console.log(response);
      if (!response.token) {
        console.log("No hay token");
        return;
      }
      localStorage.setItem('zipCode', response.user.locker_info.cp);
      localStorage.setItem("locker_id", response.user.locker_info.id_locker);
      localStorage.setItem('user_id', response.user.user_id);
      localStorage.setItem("token", response.token);
      setUser(response.user);
      setLockerId(response.user.locker_info._id);
      console.log(response.user.locker_info._id);
      setIsAuthenticated(true);

    } catch (e) {
      console.log(e);
    }
  };

  const handleLocker = (locker) => {
    if (!locker) {
      Swal.fire({
        title: "Error",
        text: "Por favor selecciona un locker",
        icon: "error",
        confirmButtonText: "Aceptar",
        input: "text",
        inputPlaceholder: "Ingresa el locker",
        inputValue: locker,
        preConfirm: (value) => {
          setLocker(value);
          localStorage.setItem("locker", value);
        },
      });
      console.log(locker);
      return;
    }
  };

  useEffect(() => {
    // Solo se ejecutará al recargar la página o montar el componente
    const checkLogin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        console.log("No hay token en checklogin");
        return;
      }

      setIsAuthenticated(true);
    };

    checkLogin();
  }, []); // Se ejecuta solo una vez al montar el componente

  const getGabetas = async () => {
    try {
      // Obtén el id_locker desde el estado del usuario o desde localStorage
      const lockerId = locker_id; // Asumiendo que locker_id es el ID del locker actual
  
      // Llama a la función para obtener las gabetas disponibles, pasando el id_locker
      const response = await fetchGabetasAviable(lockerId);
      console.log(response);
  
      if (response.error) {
        console.log("Error al obtener las gabetas");
        return;
      }
  
      if (response.success && response.message.length > 0) {
        const idGabeta = response.message[0].id_gabeta;
        const _idgabeta = response.message[0]._id;
  
        localStorage.setItem("_idgabeta", _idgabeta);
        localStorage.setItem("idGabeta", idGabeta);
  
        console.log(`_idgabeta almacenado: ${_idgabeta}`);
        console.log(`idGabeta almacenado: ${idGabeta}`);
        setGabetas(response.message); // Asegúrate de que `setGabetas` reciba solo el array de gabetas
      } else {
        Swal.fire({
          title: "Error",
          text: "No hay gabetas disponibles",
          icon: "error",
          confirmButtonText: "Aceptar",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/";
          }
        });
        console.log("No hay gabetas disponibles");
      }
    } catch (e) {
      console.log(e);
    }
  };
  


  useEffect(() => {
    // Solo se ejecutará al recargar la página o montar el componente
    
    const checkLocker = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        console.log("No hay token en checkLocker");
        return;
      }
  
      const response = await verifyToken(token);
      if (response.error) {
        setIsAuthenticated(false);
        setUser(null);
        console.log("Error en checkLocker");
        return;
      }
  
      setUser(response);
      const locker_id = response.locker_info._id;
      setIsAuthenticated(true);
  
      if (!locker_id) {
        console.log("Locker id no encontrado");
        return;
      }
  
      const gabetas = await fetchGabetasByLockerId(locker_id);
  
      if (gabetas.error) {
        console.log("Error al obtener las gabetas");
        return;
      }
  
      console.log("Gabetas obtenidas", gabetas);
  
      // Buscar la gaveta que tenga el atributo type: "weighing scale"
      const weighingScaleGabeta = gabetas.find((gabeta) => gabeta.type === "Pesa");
  
      if (weighingScaleGabeta) {
        // Almacenar su id en el localStorage
        localStorage.setItem("Pesa", weighingScaleGabeta.id_gabeta);
        // console.log("Gaveta con weighing scale encontrada, ID almacenado:", weighingScaleGabeta.id_gabeta);
      } else {
        console.log("No se encontró una gaveta con tipo 'Pesa'");
      }
  
      setGabetas(gabetas);
    };
  
    checkLocker(); // Solo se ejecutará una vez al montar el componente
  }, [
    locker_id
  ]); // Se ejecuta solo una vez al montar el componente
  


  
  return (
    <AuthContext.Provider
      value={{
        handleLocker,
        loginRequest,
        getGabetas,
        locker,
        isAuthenticated,
        user,
        gabetas,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
