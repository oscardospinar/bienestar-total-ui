'use client';

import { useState } from 'react';
import { getEquipmentById } from '@/lib/equipment';

export default function EquipmentById() {
  const [equipmentId, setEquipmentId] = useState('');
  const [equipment, setEquipment] = useState<any | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!equipmentId.trim()) {
      setError('Por favor ingrese un ID de equipo');
      return;
    }

    try {
      const data = await getEquipmentById(equipmentId);
      setEquipment(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data || 'Error al obtener el equipo');
      setEquipment(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-300 rounded shadow-sm space-y-4">
      <h2 className="text-xl font-bold text-[#990000] mb-2">Buscar Equipo por ID</h2>
      <p className="text-sm text-gray-600">Ingrese el ID del equipo que desea consultar</p>

      <input
        type="text"
        placeholder="ID del equipo"
        value={equipmentId}
        onChange={(e) => setEquipmentId(e.target.value)}
        className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none text-gray-600 placeholder-gray-600"
      />

      <button
        onClick={handleSearch}
        className="w-full py-2 rounded-md font-semibold bg-[#990000] text-white hover:bg-red-600 hover:text-black transition"
      >
        Buscar
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {equipment && (
        <div
          className={`mt-4 p-4 border rounded-md shadow-sm space-y-2 ${
            equipment.available ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'
          }`}
        >
          <p className="text-gray-700"><strong>ID:</strong> {equipment.id}</p>
          <p className="text-gray-700"><strong>Nombre:</strong> {equipment.name}</p>
          <p className="text-gray-700"><strong>Descripción:</strong> {equipment.description}</p>
          <p className="text-gray-700"><strong>Estado:</strong> {equipment.status}</p>
          <p className="text-gray-700"><strong>Observaciones:</strong> {equipment.observations}</p>
          <p className="font-bold text-gray-700">
            <strong>Disponible:</strong>{' '}
            <span className={equipment.available ? 'text-green-700' : 'text-red-700'}>
              {equipment.available ? 'Sí' : 'No'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
