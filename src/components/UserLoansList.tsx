'use client';

import { useEffect, useState } from 'react';
import { listLoansByUser } from '@/lib/loan';
import { getEquipmentById } from '@/lib/equipment';

type Loan = {
  id: string;
  equipmentId: string;
  returned: boolean;
};

type EnrichedLoan = Loan & { equipmentName: string };

export default function UserLoansList() {
  const [loans, setLoans] = useState<EnrichedLoan[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No hay token de autenticación');
          return;
        }
        const [, payloadBase64] = token.split('.');
        const { id: userId } = JSON.parse(atob(payloadBase64));

        const loanList: Loan[] = await listLoansByUser(userId);

        const enriched: EnrichedLoan[] = await Promise.all(
          loanList.map(async (loan) => {
            try {
              const equipment = await getEquipmentById(loan.equipmentId);
              return { ...loan, equipmentName: equipment.name };
            } catch {
              return { ...loan, equipmentName: loan.equipmentId }; // fallback
            }
          })
        );

        setLoans(enriched);
        setError('');
      } catch (err: any) {
        setError(err.response?.data || 'Error al obtener la lista préstamos');
        setLoans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-300 rounded shadow-sm">
      <h2 className="text-xl font-bold text-[#990000] mb-4">Tus Préstamos</h2>

      {loading && <p className="text-gray-600">Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-3">
        {loans.length > 0 ? (
          loans.map((e) => (
            <li
              key={e.id}
              className="p-4 border border-gray-200 rounded-md shadow-sm bg-gray-50"
            >
              <p className="text-gray-700"><strong>ID préstamo:</strong> {e.id}</p>
              <p className="text-gray-700"><strong>Equipo:</strong> {e.equipmentName}</p>
              <p className="text-gray-700"><strong>Devuelto:</strong> {e.returned ? 'Sí' : 'No'}</p>
            </li>
          ))
        ) : (
          !loading && <p className="text-gray-600">No hay préstamos para este usuario.</p>
        )}
      </ul>
    </div>
  );
}
