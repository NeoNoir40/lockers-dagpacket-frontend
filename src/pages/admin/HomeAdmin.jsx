import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function HomePageAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const itemsPerPage = 8; // Número máximo de ítems por página
  const { user, gabetas } = useAuth();

  useEffect(() => {
    if (user && gabetas) {
      setIsLoading(false);
    }
  }, [user, gabetas]); // Dependencia en 'user'

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGabetas = gabetas.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(gabetas.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#383838]">
      {isLoading ? (
        <h1 className="text-black">Cargando..</h1>
      ) : (
        <>
          <div className="text-2xl text-white p-5 flex flex-col">
            <h1 className="text-3xl font-normal">
              Panel de administración del locker
            </h1>
            <p className="text-center p-2">{user.username}</p>
            <button></button>
          </div>
          <div className="flex w-full justify-center  gap-10">
            <div className="text-white bg-[#2C2C2C] p-10 rounded-lg shadow-lg gap-5">
              <h1 className="text-2xl">Datos del locker</h1>
              <p className="text-lg p-1 font-normal">Nombre: {user.username}</p>
              <p className="text-lg p-1 font-normal">
                Ubicación: {user.locker_info.ubication}
              </p>
              <p className="text-lg p-1 font-normal">
                País: {user.locker_info.country}
              </p>
              <p className="text-lg p-1 font-normal">
                Estado: {user.locker_info.state}
              </p>
              <p className="text-lg p-1 font-normal">
                Ciudad: {user.locker_info.city}
              </p>
              <p className="text-lg p-1 font-normal">
                Código postal: {user.locker_info.cp}
              </p>
              <p className={`text-lg p-1 font-normal`}>
                Estatus del locker:{" "}
                <span
                  className={`${
                    user.locker_info.status === "aviable"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}>
                  {user.locker_info.status === "aviable"
                    ? "Disponible"
                    : "No disponible"}
                </span>
              </p>

              <p className="text-lg p-1 font-normal">
                Cantidad de gabetas: {user.locker_info.quant_gabetas}
              </p>
            </div>
            <div className="bg-[#2C2C2C] text-white p-10 rounded-lg shadow-lg">
            <h1 className="text-2xl text-center mb-5">Gabetas del locker</h1>
            <table className="table-auto w-full text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2">Tipo</th>
                  <th className="px-4 py-2">Ubicación</th>
                  <th className="px-4 py-2">Disponibilidad</th>
                  <th className="px-4 py-2">Estatus</th>
                </tr>
              </thead>
              <tbody>
                {currentGabetas.map((gabeta, index) => (
                  <tr key={index} className="bg-[#383838]">
                    <td className="border px-4 py-2">{gabeta.type}</td>
                    <td className="border px-4 py-2">{gabeta.ubication}</td>
                    <td className="border px-4 py-2">
                      <span
                        className={
                          gabeta.saturation ? "text-red-500" : "text-green-500"
                        }>
                        {gabeta.saturation ? "Ocupada" : "Disponible"}
                      </span>
                    </td>
                    <td className="border px-4 py-2">
                      <span
                        className={
                          gabeta.status ? "text-green-500" : "text-red-500"
                        }>
                        {gabeta.status ? "Disponible" : "Ocupada"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>

          {/* Paginación */}
          <div className="flex justify-center mt-5">
            <button
              onClick={prevPage}
              className={`px-4 py-2 bg-gray-700 text-white rounded-md mx-2 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentPage === 1}>
              Anterior
            </button>
            <button
              onClick={nextPage}
              className={`px-4 py-2 bg-gray-700 text-white rounded-md mx-2 ${
                currentPage === Math.ceil(gabetas.length / itemsPerPage)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={
                currentPage === Math.ceil(gabetas.length / itemsPerPage)
              }>
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
