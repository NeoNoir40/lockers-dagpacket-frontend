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
            <div className="bg-[#2C2C2C]">
              <h1 className=" text-2xl text-center pt-2 text-white font-semibold">
                Gabetas del locker {user.locker_info.ubication} -{" "}
                {user.locker_info.city}
              </h1>
              <div className=" h-fit grid p-10 rounded-lg grid-cols-4 gap-5 ">
                {currentGabetas.map((gabeta) => (
                  <div className="bg-[#383838] h-fit rounded-md p-5 text-white">
                    <p className="p-2">
                      <span className="">Tipo:</span> {gabeta.type}
                    </p>
                    <p className="p-2">Ubicación: {gabeta.ubication}</p>
                    <p className="p-2">
                      <span className="">Dimensiones:</span>{" "}
                      {gabeta.gabeta_dimension}
                    </p>
                    <p className="p-2">
                      <span className="">Tamaño:</span> {gabeta.size}
                    </p>
                    <p className="p-2">
                      <span>
                        <span className="">Disponibilidad:</span>{" "}
                        <span
                          className={
                            gabeta.staturation == true
                              ? "text-green-500"
                              : "text-red-500"
                          }>
                          {gabeta.staturation == true
                            ? "Disponible"
                            : "Ocupada"}
                        </span>
                      </span>
                    </p>
                    <p className="p-2">
                      <span>
                        <span className="">Estatus:</span>{" "}
                        <span
                          className={
                            gabeta.status == true
                              ? "text-green-500"
                              : "text-red-500"
                          }>
                          {gabeta.status == true ? "Disponible" : "Ocupada"}
                        </span>
                      </span>
                    </p>
                  </div>
                ))}
              </div>
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
