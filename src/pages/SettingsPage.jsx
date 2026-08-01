import React from 'react';
import { SidebarLayout } from '../components/shared/Sidebar';
import SettingsForm from '../components/settings/SettingsForm';

export default function SettingsPage() {
  return (
    <SidebarLayout>
      <SettingsForm />
    </SidebarLayout>
  );
}
