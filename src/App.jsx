// ═══════════════════════════════════════════════════════════
// App.jsx — Root component with auth-gated routing
// ═══════════════════════════════════════════════════════════

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OperoProvider } from './context/OperoContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ReceptionistPage from './pages/ReceptionistPage';
import NursePage from './pages/NursePage';
import DoctorPage from './pages/DoctorPage';
import PatientDirectoryPage from './pages/PatientDirectoryPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <OperoProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected */}
          <Route path="/receptionist" element={<ProtectedRoute><ReceptionistPage /></ProtectedRoute>} />
          <Route path="/nurse" element={<ProtectedRoute><NursePage /></ProtectedRoute>} />
          <Route path="/doctor" element={<ProtectedRoute><DoctorPage /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><PatientDirectoryPage /></ProtectedRoute>} />
          <Route path="/prescriptions" element={<ProtectedRoute><PrescriptionsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </OperoProvider>
  );
}
