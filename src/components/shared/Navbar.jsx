// ═══════════════════════════════════════════════════════════
// Navbar — Instrument-tab style top navigation
// ═══════════════════════════════════════════════════════════

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useOpero } from '../../context/OperoContext';
import { Activity, Users, RotateCcw } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/receptionist', label: 'Receptionist', shortLabel: 'REC' },
  { to: '/nurse', label: 'Nurse', shortLabel: 'NRS' },
  { to: '/doctor', label: 'Doctor', shortLabel: 'DOC' },
  { to: '/patients', label: 'Patients', shortLabel: 'PAT' },
];

export default function Navbar() {
  const { dispatch, ACTIONS } = useOpero();
  const navigate = useNavigate();

  const handleReset = () => {
    if (window.confirm('Reset all data to initial seed? This cannot be undone.')) {
      dispatch({ type: ACTIONS.RESET_DATA });
      window.location.reload();
    }
  };

  return (
    <nav className="bg-panel border-b border-rule sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between h-[48px]">
        {/* Logo / Wordmark */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer p-0"
        >
          <Activity size={18} className="text-brass" strokeWidth={2} />
          <span className="font-serif font-semibold text-lg text-ink tracking-tight">
            Opero
          </span>
        </button>

        {/* Nav tabs */}
        <div className="flex items-center gap-0">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 h-[48px] flex items-center text-sm font-sans font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-brass text-ink'
                    : 'border-transparent text-ink/50 hover:text-ink hover:border-rule'
                }`
              }
            >
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.shortLabel}</span>
            </NavLink>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="btn btn-secondary btn-xs gap-1"
            title="Reset to seed data"
          >
            <RotateCcw size={12} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
