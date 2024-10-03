import { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import animtaionTerminal from '../../../assets/lotties/js/payment_terminal.json'
import Lottie from "lottie-react";
export default function Step4({ handleStepChange }) {
  const navigate = useNavigate();
  const handlePayment = () => {
    // Mostrar modal de carga mientras se efectúa el pago
    Swal.fire({
      title: "Procesando el pago...",
      text: "Por favor espera mientras procesamos tu pago.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Muestra un spinner mientras se realiza el pago simulado
      },
    });

    // Simular el tiempo de procesamiento del pago (3 segundos en este caso)
    setTimeout(() => {
      // Cerrar el modal de carga y mostrar la confirmación del pago
      Swal.fire({
        title: "Pago Exitoso",
        text: "Tu pago ha sido procesado correctamente.",
        icon: "success",
      }).then(() => {
        // Cambiar al siguiente paso después de que se confirme el pago
        handleStepChange(5);
      });
    }, 3000); // 3 segundos de espera para simular el proceso de pago
  };

  useEffect(() => {
    setTimeout(() => {
      Swal.fire({
        title: "No se pudo procesar el pago correctamente",
        text: "Por favor contacte al soporte técnico o intente de nuevo",
        icon: "error",
        showCancelButton: true, // Mostrar el segundo botón
        confirmButtonText: "Volver al inicio", // Texto del botón principal
        cancelButtonText: "Intentar de nuevo", // Texto del botón secundario
      }).then((result) => {
        if (result.isConfirmed) {
          // Acción para "Volver al inicio"
          navigate("/");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Acción para "Intentar de nuevo"
          // Aquí puedes hacer que el usuario intente el pago otra vez o refrescar la página
          handleStepChange(4);
        }
      });
    }, 2000);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center bg-white my-5 mx-5 p-10 rounded-md ">
      <h1 className=" text-2xl font-semibold">
        Por favor realize su pago mediante la terminal de pago
      </h1>
      <Lottie
              animationData={animtaionTerminal}
              loop
              autoplay
              background="transparent"
              speed={1.5}
              style={{ width: 500, height: 500 }}
            />

      {/* <button
        onClick={handlePayment}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        Pagar
      </button> */}
    </div>
  );
}
