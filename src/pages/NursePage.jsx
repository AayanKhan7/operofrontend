import React from 'react';
import { SidebarLayout } from '../components/shared/Sidebar';
import NurseDashboard from '../components/nurse/NurseDashboard';

export default function NursePage() {
  return (
    <SidebarLayout>
      <NurseDashboard />
    </SidebarLayout>
  );
}
