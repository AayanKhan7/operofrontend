// ═══════════════════════════════════════════════════════════
// ProtectedRoute — Redirects to /login if not authenticated
// ═══════════════════════════════════════════════════════════

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useOpero } from '../../context/OperoContext';

export default function ProtectedRoute({ children }) {
  const { auth } = useOpero();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
