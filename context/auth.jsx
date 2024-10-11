import axios from "axios";
const api = import.meta.env.VITE_REACT_API_URL; // Obtener la URL desde el .env
import Swal from "sweetalert2";

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

export const fetchGabetasAviable = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${api}/gabeta/gabeta-aviable/${id}`, // Usar la URL del .env
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

export const verifyLockerStatus = async (id) => {
  try {
    const locker_id = localStorage.getItem("id_locker");

    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${api}/locker/status`,
      {
        id: locker_id,
      }, // Usar la URL del .env
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Si el estado es false, muestra error y retorna false
    if (response.data.status !== true) {
      Swal.fire({
        title: "Error",
        text: `Locker no disponible.`,
        footer: "Por favor, intente con otro locker.",
        icon: "error",
        showConfirmButton: false,
        allowOutsideClick: false, // Deshabilita el clic fuera del modal
        allowEscapeKey: false, // Deshabilita la tecla ESC

      });
      return false; // Retorna false si no está disponible
    }

    return true; // Retorna true si está disponible
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export const logGaveta = async (data) => {
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
    console.log(response);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}


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

export const fetchGavetaInfoById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${api}/gabeta/info/${id}`, // Usar la URL del .env
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
}


export const phoneRecharge = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${api}/emida/recharge`, // Usar la URL del .env
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

if(response.data.result.PinDistSaleResponse.ResponseCode == '51'){
  Swal.fire({
    title: 'Error',
    text: `${response.data.result.PinDistSaleResponse.ResponseMessage}`,
    icon: 'error',
    confirmButtonText: 'Intentar de nuevo',
  })
}
    return response.data;
  } catch (e) {
   Swal.fire({
    title: 'Error',
    text: `${e.response.data.message}`,
    icon: 'error',
    confirmButtonText: 'Intentar de nuevo',
  })
    console.log(e);
    throw e;
  }
  // console.log(data);
}


export const getShipmentInfo = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${api}/shipments/details/${id}`, // Usar la URL del .env
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
}