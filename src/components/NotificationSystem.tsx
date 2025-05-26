'use client';

import { useEffect, useState } from 'react';
import { getUserNotifications } from '@/lib/loan';

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const [, payloadBase64] = token.split('.');
        const decodedPayload = JSON.parse(atob(payloadBase64));
        const userId = decodedPayload.id;

        const data = await getUserNotifications(userId);
        setNotifications(data);
        setError('');
      } catch (err: any) {
        setError('No se pudieron cargar las notificaciones');
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-300 rounded shadow-sm space-y-4">
      <h2 className="text-xl font-bold text-[#990000]">Notificaciones</h2>

      {error && <p className="text-red-500">{error}</p>}

      {notifications.length > 0 ? (
        <ul className="list-disc list-inside space-y-1">
          {notifications.map((msg, index) => (
            <li key={index} className="text-gray-800">
              {msg}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No hay notificaciones en este momento.</p>
      )}
    </div>
  );
}
