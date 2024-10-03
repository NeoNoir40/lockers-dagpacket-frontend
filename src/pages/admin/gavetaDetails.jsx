import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchGavetaInfoById, logGaveta } from "../../../context/auth";
import axios from "axios";
import Swal from "sweetalert2";

const api = import.meta.env.VITE_REACT_API_URL; // Obtener la URL desde el .env
const id_locker = localStorage.getItem("id_locker");

export default function GavetaDetails() {
  const { id, gabeta_id } = useParams();
  const [gaveta, setGaveta] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const TOKEN = localStorage.getItem("token");
  const locker_id = localStorage.getItem("locker_id");

  const handleLogGaveta = async (action, delivery) => {
    const logData = {
      gabeta_id: gabeta_id,
      locker_id: id_locker,
      action: action,
      delivery: delivery ? delivery : '', // Solo añade delivery si existe
    };
  
    try {
      const logResponse = await logGaveta(logData);
      if (logResponse.success) {
        Swal.fire({
          title: "Registro Exitoso",
          text: "La acción de la gaveta se ha registrado correctamente.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        console.error("Data:", logData);

        Swal.fire({
          title: "Error",
          text: "No se pudo registrar la acción de la gaveta.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error registrando la acción de la gaveta:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al registrar la acción de la gaveta.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleOpenDoor = async () => {
    try {
      const openDoorResponse = await axios.post(
        `${api}/mqtt/`,
        {
          locker_id: locker_id,
          action: "sendLocker",
          gabeta: gabeta_id,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!openDoorResponse.data.error) {
        Swal.fire({
          title: "Locker Abierto",
          text: `El locker se ha abierto correctamente.`,
          icon: "success",
          confirmButtonText: "OK",
        });
        // Llama a la función de log al abrir la gaveta
        await handleLogGaveta("Abrir Gaveta", gaveta.delivery);
      } else {
        Swal.fire({
          title: "Error",
          text: `No se pudo abrir el Locker.`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: `No se pudo abrir el Locker.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.patch(`${api}/gabeta/update-status/${id}`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
  
      if (response.data.success) {
        Swal.fire({
          title: "Éxito",
          text: "Se ha cambiado el estatus de la gaveta",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        // Llama a la función de log al cambiar el estatus
        const action = newStatus ? "Activar Gaveta" : "Desactivar Gaveta";
        await handleLogGaveta(action);
        // Volver a obtener la información de la gaveta
        fetchData();
      } else {
        Swal.fire({
          title: "Error",
          text: "No se ha podido cambiar el estatus de la gaveta",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      console.error("Error cambiando el estatus de la gaveta:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al cambiar el estatus de la gaveta",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetchGavetaInfoById(id, gabeta_id);
      setGaveta(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching gaveta info:", error);
    } finally {
      setLoading(false); // Cambia el estado de carga al finalizar
    }
  };

  useEffect(() => {
    fetchData(); // Llamar a la función al montar el componente
  }, [id, gabeta_id]);

  // Si está cargando, mostrar un mensaje de carga
  if (loading) {
    return <div className="text-white">Cargando...</div>;
  }

  // Si no hay gaveta, mostrar un mensaje alternativo
  if (!gaveta) {
    return (
      <div className="text-white">No se encontró información de la gaveta.</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#383838]">
      <div className="text-2xl text-white p-5 flex flex-col w-full">
        <Link
          className="text-white bg-orange-500 p-2 rounded-lg w-fit text-center"
          to={"/home"}
        >
          Regresar
        </Link>
      </div>
      <div className="flex flex-row justify-center gap-10 w-full p-5">
        {/* Información de la Gaveta */}
        <div className="text-white bg-[#2C2C2C] p-10 rounded-lg shadow-lg w-1/2">
          <h1 className="text-2xl text-center mb-5">
            Detalles de la Gaveta {gabeta_id}
          </h1>
          <p className="text-lg p-1 font-normal">Nombre: {gabeta_id}</p>
          <p className="text-lg p-1 font-normal">
            Ubicación: {gaveta.ubication}
          </p>
          <p className="text-lg p-1 font-normal">País: {gaveta.country}</p>
          <p className="text-lg p-1 font-normal">Estado: {gaveta.state}</p>
          <p className="text-lg p-1 font-normal">Ciudad: {gaveta.city}</p>
          <p className="text-lg p-1 font-normal">Código postal: {gaveta.cp}</p>
          <p className={`text-lg p-1 font-normal`}>
            Estatus de la gaveta:{" "}
            <span
              className={`${gaveta.status ? "text-green-500" : "text-red-500"}`}
            >
              {gaveta.status ? "Disponible" : "No disponible"}
            </span>
          </p>
          <p className={`text-lg p-1 font-normal`}>
            Disponibilidad de la gaveta:{" "}
            <span
              className={`${
                gaveta.saturation ? "text-red-500" : "text-green-500"
              }`}
            >
              {gaveta.saturation ? "No disponible" : "Disponible"}
            </span>
          </p>
          <p className="text-lg p-1 font-normal">
            Tipo de gaveta: {gaveta.type}
          </p>
          <p className="text-lg p-1 font-normal">Tamaño: {gaveta.size}</p>
          <p className="text-lg p-1 font-normal">
            Dimensiones: {gaveta.gabeta_dimension}
          </p>
        </div>

        {/* Acciones de Gavetas */}
        <div className="bg-[#2C2C2C] text-white p-10 rounded-lg shadow-lg w-1/2">
          <h1 className="text-2xl text-center mb-5">Acciones de la Gaveta</h1>
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleOpenDoor}
              className="bg-emerald-500 p-2 rounded-md text-center"
            >
              Abrir Gaveta
            </button>
            <button className="bg-orange-500 p-2 rounded-md text-center">
              Imprimir Guia
            </button>
            {gaveta.status ? (
              <button 
                onClick={() => handleStatusChange(false)}
                className="bg-red-500 p-2 rounded-md text-center">
                Desactivar Gaveta
              </button>
            ) : (
              <button 
                onClick={() => handleStatusChange(true)} // Cambiar el estatus a activo
                className="bg-green-500 p-2 rounded-md text-center">
                Activar Gaveta
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
