import React from 'react';
import { SidebarLayout } from '../components/shared/Sidebar';
import DoctorDashboard from '../components/doctor/DoctorDashboard';

export default function DoctorPage() {
  return (
    <SidebarLayout>
      <DoctorDashboard />
    </SidebarLayout>
  );
}
