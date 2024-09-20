import { createContext, useState, useContext, useEffect } from "react";
import { loginLocker, verifyToken, fetchGabetasByLockerId } from "./auth";
import Swal from "sweetalert2";
import { set } from "react-hook-form";
export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deberia estar trabajando con AuthProvider");
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
      }

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
    try {
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
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    async function checkLogin() {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        console.log("No hay token en checklogin ");
        return;
      }

      setIsAuthenticated(true);
    }

    checkLogin();
  }, []);

  useEffect(() => {
    async function checkLocker() {
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
      // console.log(response);
      const locker_id = response.locker_info._id;
      setIsAuthenticated(true);

      if(!locker_id) {
        console.log("Locker id no encontrado");
        return;
      }

      const gabetas = await fetchGabetasByLockerId(locker_id);


      if (gabetas.error) {
        console.log("Error al obtener las gabetas");
        return;
      }
      console.log(gabetas);
      setGabetas(gabetas);
    }

    // Ejecutar checkLocker inmediatamente y luego en intervalos
    checkLocker();
    const intervalId = setInterval(checkLocker, 5000); // Verificar cada 5 segundos

    return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar
  }, []);

  return (
    <AuthContext.Provider
      value={{
        handleLocker,
        loginRequest,
        locker,
        isAuthenticated,
        user,
        gabetas,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
