import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../context/AuthContext";
export default function Login() {
  const { loginRequest, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Inicialización de useForm
  const { register, handleSubmit } = useForm();

  // Función para manejar el envío del formulario
  const onSubmit = async (data) => {
    try {
      await loginRequest(data);

      if (isAuthenticated) {
        navigate("/home");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate("/home");
  //   }
  // }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#383838] ">
      <div className="bg-[#2C2C2C] p-10 rounded-lg w-1/3 ">
        <h1 className="text-4xl text-white text-center mb-8">Inicia sesión</h1>
        <form
          onSubmit={handleSubmit(onSubmit)} // Maneja el envío con react-hook-form
          className="flex flex-col items-center space-y-4 gap-5">
          <input
            type="text"
            placeholder="Usuario"
            {...register("username")} // Registrando el input
            className="border-2 border-gray-300 p-2 rounded-lg"
          />
          <input
            type="password"
            placeholder="Contraseña"
            {...register("password")} // Registrando el input
            className="border-2 border-gray-300 p-2 rounded-lg"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white p-2 rounded-lg">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
