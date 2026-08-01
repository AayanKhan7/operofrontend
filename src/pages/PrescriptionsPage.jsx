import React from 'react';
import { SidebarLayout } from '../components/shared/Sidebar';
import PrescriptionsListView from '../components/prescriptions/PrescriptionsListView';

export default function PrescriptionsPage() {
  return (
    <SidebarLayout>
      <PrescriptionsListView />
    </SidebarLayout>
  );
}
