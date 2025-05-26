'use client';

import { useState, useEffect } from 'react';
import { getAllLoans } from '@/lib/loan';
import { getEquipmentById } from '@/lib/equipment';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function LoansReport() {
  const [loans, setLoans] = useState<any[]>([]);
  const [equipmentsCache, setEquipmentsCache] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [activeTab, setActiveTab] = useState<'student' | 'equipmentType' | 'status' | 'dateRange'>('student');

  // Cargar loans
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const loansData = await getAllLoans();
        setLoans(loansData);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Error al cargar préstamos');
      }
    };

    fetchLoans();
  }, []);

  // Cuando cambian los loans, o si hay loans nuevos sin equipos en cache, pedir equipos
  useEffect(() => {
    if (!loans.length) {
      setLoading(false);
      return;
    }

    const fetchMissingEquipments = async () => {
      const missingIds = loans
        .map((l) => l.equipmentId)
        .filter((id) => !equipmentsCache.has(id));

      if (!missingIds.length) {
        setLoading(false);
        return;
      }

      try {
        const newCache = new Map(equipmentsCache);

        // Pedimos equipos uno a uno (podrías paralelizar, pero cuidado con muchos requests)
        for (const id of missingIds) {
          try {
            const eq = await getEquipmentById(id);
            newCache.set(id, eq);
          } catch {
            newCache.set(id, { type: 'Desconocido' }); // fallback si falla fetch equipo
          }
        }

        setEquipmentsCache(newCache);
      } catch (err) {
        setError('Error al cargar equipos');
      } finally {
        setLoading(false);
      }
    };

    fetchMissingEquipments();
  }, [loans, equipmentsCache]);

  // Filtrar loans por fechas
  const filteredLoans = loans.filter((loan) => {
    if (!from && !to) return true;
    const loanDate = new Date(loan.loanDateTime);
    if (from && loanDate < new Date(from)) return false;
    if (to && loanDate > new Date(to)) return false;
    return true;
  });

  // === Datasets ===

  // Préstamos por estudiante
  const loansByUser = filteredLoans.reduce((acc, loan) => {
    acc[loan.userId] = (acc[loan.userId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const studentData = {
    labels: Object.keys(loansByUser),
    datasets: [
      {
        label: 'Préstamos por estudiante',
        data: Object.values(loansByUser),
        backgroundColor: 'rgba(153, 0, 0, 0.7)',
      },
    ],
  };

  // Préstamos por tipo de equipo (usamos cache para buscar tipo)
  const loansByType = filteredLoans.reduce((acc, loan) => {
    const eq = equipmentsCache.get(loan.equipmentId);
    const type = eq?.name || 'Desconocido';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const equipmentTypeData = {
    labels: Object.keys(loansByType),
    datasets: [
      {
        label: 'Préstamos por tipo de equipo',
        data: Object.values(loansByType),
        backgroundColor: [
          'rgba(153, 0, 0, 0.7)',
          'rgba(0, 102, 0, 0.7)',
          'rgba(204, 204, 0, 0.7)',
          'rgba(0, 51, 102, 0.7)',
          'rgba(102, 0, 153, 0.7)',
        ],
      },
    ],
  };

  // Préstamos por estado del equipo
  const loansByStatus = filteredLoans.reduce((acc, loan) => {
    const status = loan.initialEquipmentStatus?.toUpperCase?.() || 'Desconocido';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = {
    labels: Object.keys(loansByStatus),
    datasets: [
      {
        label: 'Préstamos por estado del equipo',
        data: Object.values(loansByStatus),
        backgroundColor: [
          'rgba(153, 0, 0, 0.7)',
          'rgba(0, 102, 0, 0.7)',
          'rgba(204, 204, 0, 0.7)',
          'rgba(0, 51, 102, 0.7)',
        ],
      },
    ],
  };

  // Préstamos por rango de fechas
  const loansCountByDate = filteredLoans.reduce((acc, loan) => {
    const dateStr = new Date(loan.loanDateTime).toISOString().slice(0, 10);
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedDates = Object.keys(loansCountByDate).sort();

  const dateRangeData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Préstamos por día',
        data: sortedDates.map((d) => loansCountByDate[d]),
        borderColor: 'rgba(153, 0, 0, 0.9)',
        backgroundColor: 'rgba(153, 0, 0, 0.4)',
        fill: true,
      },
    ],
  };

  if (loading) return <p className="text-center mt-10">Cargando datos...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-2xl font-bold text-[#990000] mb-4">Reporte de Préstamos</h1>

      {/* FILTRO FECHAS */}
      <div className="flex gap-4 items-center">
        <div>
          <label htmlFor="from" className="block text-gray-700 font-semibold">Desde:</label>
          <input
            id="from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1"
          />
        </div>

        <div>
          <label htmlFor="to" className="block text-gray-700 font-semibold">Hasta:</label>
          <input
            id="to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1"
          />
        </div>
      </div>

      {/* PESTAÑAS */}
      <div className="flex gap-4 border-b border-gray-300 mb-4">
        {['student', 'equipmentType', 'status', 'dateRange'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`py-2 px-4 font-semibold border-b-2 ${
              activeTab === tab ? 'border-[#990000] text-[#990000]' : 'border-transparent text-gray-600'
            }`}
          >
            {tab === 'student' && 'Por Estudiante'}
            {tab === 'equipmentType' && 'Por Tipo de Equipo'}
            {tab === 'status' && 'Por Estado del Equipo'}
            {tab === 'dateRange' && 'Por Rango de Fechas'}
          </button>
        ))}
      </div>

      {/* CONTENIDO GRÁFICOS */}
      <div>
        {activeTab === 'student' && (
          <Bar data={studentData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        )}

        {activeTab === 'equipmentType' && (
          <Pie data={equipmentTypeData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
        )}

        {activeTab === 'status' && (
          <Pie data={statusData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
        )}

      </div>
    </div>
  );
}
