import React from 'react';
import { SidebarLayout } from '../components/shared/Sidebar';
import ReceptionistDashboard from '../components/receptionist/ReceptionistDashboard';

export default function ReceptionistPage() {
  return (
    <SidebarLayout>
      <ReceptionistDashboard />
    </SidebarLayout>
  );
}
