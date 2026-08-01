import React from 'react';
import { SidebarLayout } from '../components/shared/Sidebar';
import PatientDirectory from '../components/patients/PatientDirectory';

export default function PatientDirectoryPage() {
  return (
    <SidebarLayout>
      <PatientDirectory />
    </SidebarLayout>
  );
}
