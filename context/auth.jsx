import axios from "axios";

export const loginLocker = async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/locker/login",
      data
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/locker/verifyToken",
      { token } // Enviar el token en el cuerpo como un objeto
    );
    return response.data; // Asegúrate de devolver la respuesta completa
  } catch (e) {
    console.log(token);
    console.log(e);
    throw e; // Puedes lanzar el error para manejarlo en otra parte si es necesario
  }
};

export const fetchGabetasByLockerId = async (id_locker) => {
  try {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    const response = await axios.post(
      "http://localhost:3000/api/v1/gabeta/list-by-locker",
      { id_locker }, // Send the id_locker in the body as an object
      {
        headers: {
          Authorization: `Bearer ${token}` // Include the Bearer token in the headers
        }
      }
    );
    return response.data; // Make sure to return the complete response
  } catch (e) {
    console.log(e);
    throw e; // You can throw the error to handle it elsewhere if necessary
  }
};
