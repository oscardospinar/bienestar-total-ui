import axios from 'axios';

const API_URL = 'https://shootingstars-hyaxc5g5dnd2f7bz.brazilsouth-01.azurewebsites.net//api/equipment';

// Función para obtener headers con token de autorización
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const addEquipment = async (equipment: {
  name: string;
  description: string;
  observations: string;
}) => {
  const res = await axios.post(`${API_URL}`, equipment, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const getAvailableEquipment = async () => {
  const res = await axios.get(`${API_URL}/available`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const getEquipmentById = async (id: string) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateEquipmentStatus = async (payload: {
  equipmentId: string;
  newStatus: string;
}) => {
  const res = await axios.put(`${API_URL}/status`, payload, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const disableEquipment = async (id: string) => {
  await axios.put(`${API_URL}/disable/${id}`, null, {
    headers: getAuthHeaders(),
  });
};

export const enableEquipment = async (id: string) => {
  await axios.put(`${API_URL}/enable/${id}`, null, {
    headers: getAuthHeaders(),
  });
};

export const getBadAndMaintenanceEquipment = async () => {
  const res = await axios.get(`${API_URL}/getBadEquipment`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

