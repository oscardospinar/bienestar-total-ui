'use client';

import React, { useState } from 'react';

import AddEquipmentForm from '@/components/AddEquipmentForm';
import ReturnForm from '@/components/ReturnForm';
import EquipmentStatusForm from '@/components/EquipmentStatusForm';
import Notification from '@/components/Notification';
import EquipmentList from '@/components/EquipmentList';
import AllActiveLoans from '@/components/AllActiveLoans';
import LoansReport from '@/components/LoansReport';
import EquipmentBadList from '@/components/EquipmentBadList';

import withAuth from '@/lib/withAuth';

function AdminPage() {
  const [showReport, setShowReport] = useState(false);
  const [showAvailable, setShowAvailable] = useState(true);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-6 sm:p-10">
      <div className="w-full max-w-7xl bg-white border border-gray-300 rounded shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold text-[#990000] text-center mb-6">Panel de Administrador</h2>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowReport((prev) => !prev)}
            className="bg-[#990000] text-white font-semibold px-6 py-2 rounded hover:bg-[#b30000] transition"
          >
            {showReport ? 'Ocultar Reporte' : 'Generar Reporte'}
          </button>
        </div>

        {showReport && (
          <div className="mb-8">
            <LoansReport />
          </div>
        )}

        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AddEquipmentForm />
          <ReturnForm />
          <EquipmentStatusForm />
          <AllActiveLoans />
          <Notification />

          {/* Selector y lista combinados */}
          <div className="bg-white border border-gray-300 rounded shadow-sm p-4 md:col-span-2">
            <h3 className="text-lg font-semibold text-[#990000] mb-3">Filtrar Equipos</h3>
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setShowAvailable(true)}
                className={`px-4 py-2 rounded font-semibold border w-full ${
                  showAvailable
                    ? 'bg-[#990000] text-white'
                    : 'bg-white text-[#990000] border-[#990000]'
                }`}
              >
                Disponibles
              </button>
              <button
                onClick={() => setShowAvailable(false)}
                className={`px-4 py-2 rounded font-semibold border w-full ${
                  !showAvailable
                    ? 'bg-[#990000] text-white'
                    : 'bg-white text-[#990000] border-[#990000]'
                }`}
              >
                Mal Estado
              </button>
            </div>

            {/* Lista según selección */}
            {showAvailable ? <EquipmentList /> : <EquipmentBadList />}
          </div>
        </div>
      </div>
    </main>
  );
}

export default withAuth(AdminPage, { allowedRoles: ['ADMIN'] });
