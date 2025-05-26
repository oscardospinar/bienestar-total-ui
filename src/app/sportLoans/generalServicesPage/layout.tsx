'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

export default function GeneralServicesLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/');
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="bg-[#990000] text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="pt-20 px-6">{children}</div>
    </div>
  );
}
