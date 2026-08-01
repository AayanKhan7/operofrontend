// ═══════════════════════════════════════════════════════════
// Role Select Page — Entry point / instrument-style role picker
// ═══════════════════════════════════════════════════════════

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOpero } from '../context/OperoContext';
import { Activity, ClipboardList, Stethoscope, UserCog } from 'lucide-react';

const ROLES = [
  {
    key: 'receptionist',
    label: 'Receptionist',
    subtitle: 'Bookings, check-ins, billing',
    path: '/receptionist',
    icon: ClipboardList,
    railColor: 'border-l-slate-blue',
    hoverBg: 'hover:bg-slate-blue/5',
  },
  {
    key: 'nurse',
    label: 'Nurse',
    subtitle: 'Triage, vitals, room assignment',
    path: '/nurse',
    icon: Stethoscope,
    railColor: 'border-l-amber',
    hoverBg: 'hover:bg-amber/5',
  },
  {
    key: 'doctor',
    label: 'Doctor',
    subtitle: 'Consultation, notes, discharge',
    path: '/doctor',
    icon: UserCog,
    railColor: 'border-l-plum',
    hoverBg: 'hover:bg-plum/5',
  },
];

export default function RoleSelectPage() {
  const navigate = useNavigate();
  const { dispatch, ACTIONS } = useOpero();

  const handleSelect = (role) => {
    dispatch({ type: ACTIONS.SET_ROLE, payload: role.key });
    navigate(role.path);
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-[540px]">
        {/* Wordmark */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity size={24} className="text-brass" strokeWidth={2} />
            <h1 className="font-serif font-bold text-4xl text-ink tracking-tight">
              Opero Analyzer
            </h1>
          </div>
          <p className="font-sans text-sm text-ink/40 tracking-wide">
            Every patient, tracked in real time.
          </p>
        </div>

        {/* Role tiles */}
        <div className="space-y-3">
          {ROLES.map(role => {
            const Icon = role.icon;
            return (
              <button
                key={role.key}
                onClick={() => handleSelect(role)}
                className={`w-full text-left card border-l-4 ${role.railColor} px-5 py-4 transition-colors ${role.hoverBg} group`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded flex items-center justify-center bg-paper border border-rule group-hover:border-brass/30 transition-colors">
                    <Icon size={20} className="text-ink/60 group-hover:text-ink transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="font-serif font-semibold text-lg text-ink">{role.label}</div>
                    <div className="font-sans text-sm text-ink/40">{role.subtitle}</div>
                  </div>
                  <div className="text-ink/20 group-hover:text-brass transition-colors">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-center font-mono text-[0.6875rem] text-ink/25 mt-8">
          v1.0 · In-memory data · Role switching via top nav
        </p>
      </div>
    </div>
  );
}
