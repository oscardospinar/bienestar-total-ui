'use client';

export default function NoAutorizado() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4 bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold text-[#990000]">Acceso denegado</h1>
        <p className="text-gray-700">No tienes permisos para ver esta página.</p>
      </div>
    </main>
  );
}

