'use client';

import { useEffect, useState } from 'react';
import { getActiveLoans } from '@/lib/loan';
import { getEquipmentById } from '@/lib/equipment';
import { getCorreoById } from '@/lib/user';

type Loan = {
  id: string;
  userId: string;
  equipmentId: string;
  returned: boolean;
};

type EnrichedLoan = Loan & {
  name: string;
  correo: string;
};

export default function AllActiveLoans() {
  const [loans, setLoans] = useState<EnrichedLoan[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const loanList: Loan[] = await getActiveLoans();

        const enriched: EnrichedLoan[] = await Promise.all(
          loanList.map(async (loan) => {
            let name = loan.equipmentId;
            let correo = loan.userId;

            try {
              const equipment = await getEquipmentById(loan.equipmentId);
              name = equipment.name;
            } catch (e) {
                console.log(`Error al obtener el equipo`);
            }

            try {
              correo = await getCorreoById(loan.userId);
              console.log(`Correo para ${loan.userId}:`, correo);
            } catch (e) {
              console.log(`Error al obtener correo para ${loan.userId}:`, e);
            }

            return { ...loan, name, correo };
          })
        );

        setLoans(enriched);
        setError('');
      } catch (err: any) {
        setError(err.response?.data || 'Error al obtener los préstamos');
        setLoans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-300 rounded shadow-sm">
      <h2 className="text-xl font-bold text-[#990000] mb-4">Préstamos Activos</h2>

      {loading && <p className="text-gray-600">Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {loans.length === 0 && !loading ? (
        <p className="text-gray-600">No hay préstamos activos en este momento.</p>
      ) : (
        <ul className="space-y-3">
          {loans.map((loan) => (
            <li
              key={loan.id}
              className="p-4 border border-gray-200 rounded-md shadow-sm bg-gray-50"
            >
              <p className="text-gray-700"><strong>ID préstamo:</strong> {loan.id}</p>
              <p className="text-gray-700"><strong>Correo usuario:</strong> {loan.correo}</p>
              <p className="text-gray-700"><strong>Equipo:</strong> {loan.name}</p>
              <p className="text-gray-700"><strong>Devuelto:</strong> {loan.returned ? 'Sí' : 'No'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
