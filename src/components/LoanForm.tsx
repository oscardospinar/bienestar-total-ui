'use client';

import { useState, useEffect } from 'react';
import { createLoan } from '@/lib/loan';
import Notification from './Notification';
import { getAvailableEquipment } from '@/lib/equipment';

export default function LoanForm() {
  const [form, setForm] = useState({
    equipmentId: '',
    loanDateTime: '',
    returnDueDateTime: '',
  });
  const [message, setMessage] = useState('');
  const [equipmentList, setEquipmentList] = useState([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const equipment = await getAvailableEquipment();
        setEquipmentList(equipment);
      } catch (error) {
        console.error('Error al obtener equipos:', error);
      }
    };

    fetchEquipment();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loanDurationHours =
        (new Date(form.returnDueDateTime).getTime() - new Date(form.loanDateTime).getTime()) /
        (1000 * 60 * 60);
      const userIdToken = localStorage.getItem('token') || '';
      const [, payloadBase64] = userIdToken.split('.');
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const id = decodedPayload.id;
      const loanData = {
        ...form,
        userId: id,
        loanDurationHours,
      };
      await createLoan(loanData);
      setMessage('Préstamo creado exitosamente');
    } catch (err: any) {
      setMessage(err.response?.data || 'Error al crear el préstamo');
    }
  };

  const isDisabled = !form.equipmentId || !form.loanDateTime || !form.returnDueDateTime;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-300 rounded shadow-sm space-y-4"
    >
      <h2 className="text-xl font-bold text-[#990000] mb-2">Registrar Préstamo</h2>

      <div>
        <label htmlFor="equipment" className="text-sm font-medium text-[#990000]">Equipo</label>
        <select
          id="equipment"
          value={form.equipmentId}
          onChange={(e) => setForm({ ...form, equipmentId: e.target.value })}
          required
          className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none text-gray-600"
        >
          <option value="">Seleccione un equipo</option>
          {equipmentList.map((eq: any) => (
            <option key={eq.id} value={eq.id}>
              {eq.name} (ID: {eq.id})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="loanDateTime" className="text-sm font-medium text-[#990000]">Fecha y hora de préstamo</label>
        <input
          type="datetime-local"
          id="loanDateTime"
          value={form.loanDateTime}
          onChange={(e) => setForm({ ...form, loanDateTime: e.target.value })}
          required
          className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none text-gray-600"
        />
      </div>

      <div>
        <label htmlFor="returnDueDateTime" className="text-sm font-medium text-[#990000]">Fecha y hora de devolución</label>
        <input
          type="datetime-local"
          id="returnDueDateTime"
          value={form.returnDueDateTime}
          onChange={(e) => setForm({ ...form, returnDueDateTime: e.target.value })}
          required
          className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none text-gray-600"
        />
      </div>

      <button
        type="submit"
        disabled={isDisabled}
        className={`w-full py-2 rounded-md font-semibold transition ${
          isDisabled
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-[#990000] text-white hover:bg-red-600 hover:text-black'
        }`}
      >
        Registrar Préstamo
      </button>

      {message && <Notification message={message} />}
    </form>
  );
}
