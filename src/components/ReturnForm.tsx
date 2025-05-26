'use client';

import { useState } from 'react';
import { returnLoan } from '@/lib/loan';
import Notification from './Notification';

export default function ReturnForm() {
  const [loanId, setLoanId] = useState('');
  const [returnStatus, setReturnStatus] = useState('');
  const [observations, setObservations] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const confirmedReturnBy = localStorage.getItem('userId') || '';

  const handleSubmit = async () => {
    if (!loanId.trim() || !returnStatus.trim()) {
      setError('ID del préstamo y estado son obligatorios');
      setMessage('');
      return;
    }

    try {
      await returnLoan({ loanId, returnStatus, confirmedReturnBy, observations });
      setMessage('¡Devolución registrada exitosamente!');
      setError('');
      setLoanId('');
      setReturnStatus('');
      setObservations('');
    } catch (err: any) {
      const errorData = err.response?.data;

      if (typeof errorData === 'string') {
        setError(errorData);
      } else if (errorData?.error) {
        setError(errorData.error);
      } else {
        setError('Error en la devolución');
      }
      setMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-300 rounded shadow-sm space-y-4">
      <h2 className="text-xl font-bold text-[#990000] mb-2">Registrar Devolución</h2>

      <input
        placeholder="ID del préstamo"
        value={loanId}
        onChange={e => setLoanId(e.target.value)}
        className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none text-gray-600 placeholder-gray-600"
        required
      />

      <select
        value={returnStatus}
        onChange={e => setReturnStatus(e.target.value)}
        className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-600"
        required
      >
        <option value="">Selecciona un estado</option>
        <option value="GOODSTATUS">GOODSTATUS</option>
        <option value="DAMAGED">DAMAGED</option>
      </select>

      <textarea
        placeholder="Observaciones (opcional)"
        value={observations}
        onChange={e => setObservations(e.target.value)}
        className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none text-gray-600 placeholder-gray-600"
      />

      {message && <p className="text-green-600 text-sm">{message}</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        className="w-full py-2 rounded-md font-semibold transition bg-[#990000] text-white hover:bg-red-600 hover:text-black"
      >
        Registrar Devolución
      </button>
    </div>
  );
}
