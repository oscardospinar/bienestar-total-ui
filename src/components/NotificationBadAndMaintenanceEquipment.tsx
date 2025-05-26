'use client';

import { useEffect, useState } from 'react';
import { getBadAndMaintenanceEquipment } from '@/lib/equipment';

export default function NotificationBadAndMaintenanceEquipment() {
  const [equipments, setEquipments] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBadAndMaintenanceEquipment();
        setEquipments(data);
        setError('');
      } catch (err: any) {
        setError('Error al obtener equipos dañados o en mantenimiento');
      }
    };

    fetchData();
  }, []);

  // Si no hay equipos ni error, no renderizar nada
  if (equipments.length === 0 && !error) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-300 rounded shadow-sm">
      <h2 className="text-xl font-bold text-[#990000] mb-4">
        Equipos en mal estado o mantenimiento
      </h2>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="space-y-3">
          {equipments.map((e) => (
            <li
              key={e.id}
              className="p-4 border border-gray-200 rounded-md shadow-sm bg-gray-50"
            >
              <p className="text-gray-700"><strong>ID:</strong> {e.id}</p>
              <p className="text-gray-700"><strong>Nombre:</strong> {e.name}</p>
              <p className="text-gray-700"><strong>Estado:</strong> {e.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
