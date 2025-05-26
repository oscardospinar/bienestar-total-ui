import axios from 'axios';

const API_URL = 'https://shootingstars-hyaxc5g5dnd2f7bz.brazilsouth-01.azurewebsites.net//api/loans';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getAllLoans = async () => {
  try {
    const res = await axios.get(`${API_URL}/loans`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data || 'Error al obtener los préstamos');
  }
};


export async function getUserNotifications(userId: string) {
  try {
    const res = await axios.get(`${API_URL}/notifications/${userId}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error: any) {
        throw new Error(error.response?.data || 'Error al obtener notificaciones');
  }
}

export const getActiveLoans = async () => {
  try {
    const res = await axios.get(`${API_URL}/ActiveLoans`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data || 'Error al obtener los préstamos');
  }
};



export const createLoan = async (loanRequest: any) => {
  const res = await axios.post(`${API_URL}/create`, loanRequest, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const returnLoan = async (returnDetails: any) => {
  const res = await axios.post(`${API_URL}/return`, returnDetails, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const getLoanById = async (loanId: string) => {
  const res = await axios.get(`${API_URL}/${loanId}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const listLoansByUser = async (userId: string) => {
  const res = await axios.get(`${API_URL}/user/${userId}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const listLoansByDateRange = async (from: string, to: string) => {
  const res = await axios.get(`${API_URL}/range`, {
    params: { from, to },
    headers: getAuthHeaders(),
  });
  return res.data;
};
