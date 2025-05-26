'use client';

import EquipmentStatusForm from '@/components/EquipmentStatusForm';
import Notification from '@/components/Notification';
import NotificationBadAndMaintenanceEquipment from '@/components/NotificationBadAndMaintenanceEquipment';
import withAuth from '@/lib/withAuth'

function generalServicesPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6 sm:p-10">
     <div className="w-full max-w-2xl bg-white border border-gray-300 rounded shadow-sm p-6 space-y-6">
     <h2 className="text-2xl font-bold text-[#990000] text-center">Panel de Servicios Generales</h2>
      <EquipmentStatusForm />
      <Notification />
      <NotificationBadAndMaintenanceEquipment />
     </div>
    </main>
  );
}

export default withAuth(generalServicesPage, { allowedRoles: ['GENERALSERVICES'] });