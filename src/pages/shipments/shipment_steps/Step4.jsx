export default function Step4({  handleStepChange }) {

  return (
    <div className="bg-white my-5 mx-5 p-10 rounded-md">
      <h1>Porfavor elige tu metodo de pago</h1>
      <button
        onClick={() => handleStepChange(5)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        Pagar
      </button>
    </div>
  );
}
