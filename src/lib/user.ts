import axios from 'axios';

const API_URL = 'https://moduloadmin-b8e8a8c9apcfcyb3.brazilsouth-01.azurewebsites.net//api/usuarios';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

export async function loginUser(correo: string, contraseña: string): Promise<string> {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      correo,
      contraseña
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
}

export async function getCorreoById(id: string): Promise<string> {
  try {
    const response = await axios.get(`${API_URL}/correo/${id}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || 'Error al obtener el correo del usuario');
  }

}

