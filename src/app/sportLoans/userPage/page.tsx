'use client';

import LoanForm from '@/components/LoanForm';
import EquipmentList from '@/components/EquipmentList';
import Notification from '@/components/Notification';
import UserLoansList from '@/components/UserLoansList';
import NotificationSystem from '@/components/NotificationSystem';
import withAuth from '@/lib/withAuth';

function UserPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6 sm:p-10">
     <div className="w-full max-w-2xl bg-white border border-gray-300 rounded shadow-sm p-6 space-y-6">
     <h2 className="text-2xl font-bold text-[#990000] text-center">Panel de Usuario</h2>
          <EquipmentList />
          <LoanForm />
          <Notification />
          <UserLoansList />
          <NotificationSystem />
      </div>
    </main>
  );
}

export default withAuth(UserPage, { allowedRoles: ['STUDENT', 'TEACHER'] });