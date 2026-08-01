// ═══════════════════════════════════════════════════════════
// Sidebar — Fixed collapsible navigation (v3 Brand Restyle)
// ═══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useOpero } from '../../context/OperoContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

const ROLE_ROUTES = {
  Receptionist: '/receptionist',
  Nurse: '/nurse',
  Doctor: '/doctor',
};

function OperoLogoMark({ className }) {
  return (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M14 0L28 14L14 28V0Z" fill="#FFFFFF"/>
      <path d="M0 14L14 0V28L0 14Z" fill="rgba(255,255,255,0.6)"/>
    </svg>
  );
}

export default function Sidebar() {
  const { auth, dispatch, ACTIONS } = useOpero();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const dashboardPath = ROLE_ROUTES[auth?.role] || '/receptionist';

  const navItems = [
    { to: dashboardPath, icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/patients', icon: Users, label: 'Patients' },
    { to: '/prescriptions', icon: FileText, label: 'Prescriptions' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    dispatch({ type: ACTIONS.LOGOUT });
    navigate('/login');
  };

  const handleReset = () => {
    if (window.confirm('Reset all data to initial seed? This cannot be undone.')) {
      dispatch({ type: ACTIONS.RESET_DATA });
      window.location.reload();
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-panel border-r border-rule z-50 flex flex-col transition-[width] duration-200 shadow-sm ${
        collapsed ? 'w-[64px]' : 'w-[240px]'
      }`}
    >
      {/* ── Brand Header Block (Gradient) ── */}
      <div className="bg-gradient-to-br from-periwinkle to-deep-blue flex flex-col justify-end flex-shrink-0 transition-all duration-200 overflow-hidden"
           style={{ height: collapsed ? '64px' : '110px' }}>
        <div className="px-4 pb-4 flex items-center gap-3">
          <OperoLogoMark className="flex-shrink-0" />
          {!collapsed && (
            <span className="font-serif font-bold text-xl text-white tracking-tight leading-none lowercase">
              opero
            </span>
          )}
        </div>
      </div>

      {/* ── User info ── */}
      {!collapsed && auth && (
        <div className="px-5 py-4 border-b border-rule bg-paper/30">
          <div className="font-sans text-sm font-semibold text-navy truncate">{auth.name}</div>
          <div className="font-sans text-xs font-medium text-navy/50 mt-[2px]">{auth.role}</div>
        </div>
      )}

      {/* ── Nav items ── */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-[12px] mx-2 mb-1 rounded-lg text-sm font-sans font-medium transition-colors relative ${
                  isActive
                    ? 'text-deep-blue bg-periwinkle/30'
                    : 'text-navy/60 hover:text-navy hover:bg-paper'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active rail indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-[8px] bottom-[8px] w-[4px] rounded-r bg-deep-blue" />
                  )}
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Bottom actions ── */}
      <div className="border-t border-rule py-3 flex-shrink-0">
        <button
          onClick={handleReset}
          className="flex items-center gap-3 px-4 py-[10px] mx-2 rounded-lg text-sm font-sans text-navy/40 hover:text-navy hover:bg-paper transition-colors w-full"
          title="Reset data"
        >
          <RotateCcw size={16} strokeWidth={2} className="flex-shrink-0" />
          {!collapsed && <span>Reset Data</span>}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-[10px] mx-2 rounded-lg text-sm font-sans text-rust/80 hover:text-rust hover:bg-rust/5 transition-colors w-full"
          title="Sign out"
        >
          <LogOut size={16} strokeWidth={2} className="flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[80px] flex items-center justify-center w-6 h-6 bg-panel border border-rule rounded-full text-navy/40 hover:text-navy shadow-sm transition-colors z-10"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}

// Layout wrapper that includes sidebar + content area
export function SidebarLayout({ children }) {
  return (
    <div className="min-h-screen bg-paper flex">
      <Sidebar />
      {/* Main content — uses flex-1 so it takes remaining space, margins handled by sidebar fixed position */}
      {/* Using pl-[240px] for default width */}
      <div className="flex-1 min-h-screen pl-[240px] transition-[padding] duration-200">
        {children}
      </div>
    </div>
  );
}
