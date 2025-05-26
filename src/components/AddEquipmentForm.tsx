'use client';

import { useState } from 'react';
import { addEquipment } from '@/lib/equipment';

export default function AddEquipmentForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [observations, setObservations] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      setError('Nombre y descripción son obligatorios');
      return;
    }

    try {
      await addEquipment({ name, description, observations });
      setSuccess(true);
      setError('');
      setName('');
      setDescription('');
      setObservations('');
    } catch (err: any) {
      setError(err.response?.data || 'Error al agregar el equipo');
      setSuccess(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-300 rounded shadow-sm space-y-4">
      <h2 className="text-xl font-bold text-[#990000] mb-2">Agregar Nuevo Equipo</h2>

      <input
        type="text"
        placeholder="Nombre del equipo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none text-gray-600 placeholder-gray-600"
        required
      />

      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none text-gray-600 placeholder-gray-600"
        required
      />

      <input
        type="text"
        placeholder="Observaciones (opcional)"
        value={observations}
        onChange={(e) => setObservations(e.target.value)}
        className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none text-gray-600 placeholder-gray-600"
      />

      {success && <p className="text-green-600 text-sm">¡Equipo registrado exitosamente!</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        className="w-full py-2 rounded-md font-semibold transition bg-[#990000] text-white hover:bg-red-600 hover:text-black"
      >
        Registrar Equipo
      </button>
    </div>
  );
}
