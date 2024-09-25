import axios from "axios";
const api = import.meta.env.VITE_REACT_API_URL; // Obtener la URL desde el .env

export const loginLocker = async (data) => {
  try {
    const response = await axios.post(
      `${api}/locker/login`, // Usar la URL del .env
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
      `${api}/locker/verifyToken`, // Usar la URL del .env
      { token }
    );
    return response.data;
  } catch (e) {
    console.log(token);
    console.log(e);
    throw e;
  }
};

export const fetchGabetasByLockerId = async (id_locker) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${api}/gabeta/list-by-locker`, // Usar la URL del .env
      { id_locker },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const fetchGabetasAviable = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${api}/gabeta/gabeta-aviable`, // Usar la URL del .env
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const recolectGabeta = async (pin) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${api}/gabeta/recolect-package`, // Usar la URL del .env
      pin,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(pin);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const generateLogGaveta = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${api}/gaveta-log/gaveta-log`, // Usar la URL del .env
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const updateSaturation = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const gabeta_id = localStorage.getItem("_idgabeta");

    const response = await axios.patch(
      `${api}/gabeta/update-saturation`, // Usar la URL del .env
      {
        _id: gabeta_id,
        saturation: data,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
