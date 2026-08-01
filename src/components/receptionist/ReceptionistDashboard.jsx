// ═══════════════════════════════════════════════════════════
// Receptionist Dashboard v3 (Brand Restyle)
// Live queue, booking, walk-in entry, billing
// ═══════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { useOpero } from '../../context/OperoContext';
import StatusBadge from '../shared/StatusBadge';
import PulseDivider from '../shared/PulseDivider';
import AppointmentBookingForm from '../booking/AppointmentBookingForm';
import WalkInForm from './WalkInForm';
import {
  CalendarPlus,
  UserPlus,
  DollarSign,
  ChevronRight,
  X,
  Clock,
  AlertCircle,
  Check,
} from 'lucide-react';

const STATUS_RAIL_CLASS = {
  'Scheduled':  'status-rail status-rail--scheduled',
  'Checked-In': 'status-rail status-rail--checked-in',
  'With Nurse':  'status-rail status-rail--with-nurse',
  'With Doctor': 'status-rail status-rail--with-doctor',
  'Completed':  'status-rail status-rail--completed',
  'No-Show':    'status-rail status-rail--no-show',
  'Cancelled':  'status-rail status-rail--cancelled',
};

// Queue column definitions
const QUEUE_COLUMNS = [
  { key: 'Scheduled',  label: 'Scheduled',  color: 'text-navy/50' },
  { key: 'Checked-In', label: 'Checked In', color: 'text-sky' },
  { key: 'With Nurse',  label: 'With Nurse', color: 'text-amber' },
  { key: 'With Doctor', label: 'With Doctor', color: 'text-plum' },
  { key: 'Completed',  label: 'Done',       color: 'text-whatsapp-green' },
];

export default function ReceptionistDashboard() {
  const { todaysAppointments, dispatch, ACTIONS, patients } = useOpero();
  const [activePanel, setActivePanel] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const queueGroups = useMemo(() => {
    const groups = {};
    QUEUE_COLUMNS.forEach(col => { groups[col.key] = []; });
    todaysAppointments.forEach(a => {
      if (groups[a.status]) groups[a.status].push(a);
    });
    return groups;
  }, [todaysAppointments]);

  const billingItems = useMemo(() => {
    return todaysAppointments.filter(a =>
      a.status !== 'Cancelled' && a.status !== 'No-Show' && a.amountDue > 0
    );
  }, [todaysAppointments]);

  const totalDue = billingItems.reduce((sum, a) => sum + (a.paymentStatus === 'Pending' ? a.amountDue : 0), 0);
  const totalPaid = billingItems.reduce((sum, a) => sum + (a.paymentStatus === 'Paid' ? a.amountDue : 0), 0);

  const filteredAppointments = useMemo(() => {
    if (statusFilter === 'All') return todaysAppointments;
    return todaysAppointments.filter(a => a.status === statusFilter);
  }, [todaysAppointments, statusFilter]);

  const handleCheckIn = (id) => {
    dispatch({ type: ACTIONS.ADVANCE_STATUS, payload: id });
  };

  const handleCancel = (id) => {
    dispatch({ type: ACTIONS.CANCEL_APPOINTMENT, payload: id });
  };

  const handleNoShow = (id) => {
    dispatch({ type: ACTIONS.MARK_NO_SHOW, payload: id });
  };

  const handleMarkPaid = (id) => {
    dispatch({ type: ACTIONS.MARK_PAID, payload: id });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="font-serif font-semibold text-2xl text-navy">Reception</h1>
          <p className="text-sm text-navy/50 font-sans mt-[2px]">
            Today&apos;s appointments: <span className="font-mono font-medium text-navy">{todaysAppointments.length}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            className={`btn flex-1 sm:flex-none ${activePanel === 'booking' ? 'btn-primary' : 'btn-secondary'} rounded-lg`}
            onClick={() => setActivePanel(activePanel === 'booking' ? null : 'booking')}
          >
            <CalendarPlus size={16} />
            Book
          </button>
          <button
            className={`btn flex-1 sm:flex-none ${activePanel === 'walkin' ? 'btn-primary' : 'btn-secondary'} rounded-lg`}
            onClick={() => setActivePanel(activePanel === 'walkin' ? null : 'walkin')}
          >
            <UserPlus size={16} />
            Walk-In
          </button>
        </div>
      </div>

      {/* Slide-down panels */}
      {activePanel === 'booking' && (
        <div className="card p-5 mb-5 border-none shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-lg text-navy">Book Appointment</h2>
            <button className="btn btn-secondary btn-xs rounded-md" onClick={() => setActivePanel(null)}>
              <X size={14} /> Close
            </button>
          </div>
          <AppointmentBookingForm onComplete={() => setActivePanel(null)} />
        </div>
      )}

      {activePanel === 'walkin' && (
        <div className="card p-5 mb-5 border-none shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-lg text-navy">Walk-In Quick Entry</h2>
            <button className="btn btn-secondary btn-xs rounded-md" onClick={() => setActivePanel(null)}>
              <X size={14} /> Close
            </button>
          </div>
          <WalkInForm onComplete={() => setActivePanel(null)} />
        </div>
      )}

      {/* ═══ Queue Board ═══ */}
      <div className="card p-5 mb-5 border-none shadow-card bg-panel">
        <h2 className="font-sans font-semibold text-[17px] text-navy mb-4">Live Queue</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 min-h-[200px]">
          {QUEUE_COLUMNS.map(col => (
            <div key={col.key} className="flex flex-col bg-paper/50 rounded-xl p-3 border border-rule/50">
              {/* Column header */}
              <div className={`text-[11px] font-sans font-semibold uppercase tracking-wider ${col.color} mb-3 pb-2 border-b border-rule/50`}>
                {col.label}
                <span className="font-mono ml-2 text-navy/30 bg-panel px-1.5 py-0.5 rounded-md border border-rule/30 shadow-sm">{queueGroups[col.key].length}</span>
              </div>
              {/* Cards */}
              <div className="flex flex-col gap-2.5">
                {queueGroups[col.key].map(appt => (
                  <QueueCard
                    key={appt.id}
                    appointment={appt}
                    onCheckIn={handleCheckIn}
                    onCancel={handleCancel}
                    onNoShow={handleNoShow}
                  />
                ))}
                {queueGroups[col.key].length === 0 && (
                  <div className="text-xs text-navy/30 font-sans text-center py-6 border-2 border-dashed border-rule/50 rounded-lg">—</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <PulseDivider className="my-5" />

      {/* ═══ Bottom row: Appointment list + Billing ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Appointment List */}
        <div className="lg:col-span-2 card p-5 border-none shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="font-sans font-semibold text-[17px] text-navy">Today&apos;s Appointments</h2>
            <div className="flex flex-wrap items-center gap-1.5 bg-paper p-1 rounded-lg">
              {['All', 'Scheduled', 'Checked-In', 'With Nurse', 'With Doctor', 'Completed'].map(f => (
                <button
                  key={f}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${statusFilter === f ? 'bg-panel text-navy shadow-sm' : 'text-navy/50 hover:text-navy hover:bg-panel/50'}`}
                  onClick={() => setStatusFilter(f)}
                >
                  {f === 'All' ? 'All' : f}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {filteredAppointments.length === 0 && (
              <p className="text-sm text-navy/40 py-6 text-center border-2 border-dashed border-rule/50 rounded-xl">No appointments match this filter.</p>
            )}
            {filteredAppointments.map(appt => (
              <div
                key={appt.id}
                className={`${STATUS_RAIL_CLASS[appt.status] || ''} flex flex-col sm:flex-row sm:items-center justify-between py-3 px-4 bg-paper/30 rounded-xl border border-rule/50 hover:bg-paper hover:border-rule transition-colors`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0 mb-3 sm:mb-0">
                  <span className="font-mono text-[13px] text-navy/60 w-[52px] flex-shrink-0">{appt.time}</span>
                  <div className="min-w-0">
                    <span className="font-sans font-semibold text-[15px] text-navy truncate block">{appt.patientName}</span>
                    {appt.chiefComplaint && (
                      <span className="text-[13px] text-navy/50 truncate block mt-0.5">{appt.chiefComplaint}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-auto">
                  {appt.assignedRoom && (
                    <span className="font-mono text-[11px] bg-panel px-2 py-0.5 rounded-md border border-rule/50 text-navy/50 shadow-sm">{appt.assignedRoom}</span>
                  )}
                  <StatusBadge status={appt.status} size="xs" />
                  {appt.status === 'Scheduled' && (
                    <button className="btn btn-sm btn-primary rounded-lg shadow-sm" onClick={() => handleCheckIn(appt.id)}>
                      Check In
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Panel */}
        <div className="card p-5 border-none shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={18} className="text-whatsapp-green" />
            <h2 className="font-sans font-semibold text-[17px] text-navy">Billing</h2>
          </div>
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-rule/50">
            <div className="flex-1 bg-rust/5 p-3 rounded-xl border border-rust/10">
              <div className="text-[10px] font-sans font-semibold text-rust/60 uppercase tracking-wider mb-1">Due</div>
              <div className="font-mono font-semibold text-[22px] text-rust leading-none">${totalDue.toFixed(2)}</div>
            </div>
            <div className="flex-1 bg-whatsapp-green/5 p-3 rounded-xl border border-whatsapp-green/10">
              <div className="text-[10px] font-sans font-semibold text-whatsapp-green/60 uppercase tracking-wider mb-1">Collected</div>
              <div className="font-mono font-semibold text-[22px] text-whatsapp-green leading-none">${totalPaid.toFixed(2)}</div>
            </div>
          </div>
          <div className="space-y-1">
            {billingItems.map(appt => (
              <div
                key={appt.id}
                className="flex items-center justify-between py-2.5 px-3 hover:bg-paper/50 rounded-lg transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-sans text-[14px] font-medium text-navy truncate block mb-1">{appt.patientName}</span>
                  <StatusBadge status={appt.paymentStatus} size="xs" />
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`font-mono text-[15px] font-semibold ${appt.paymentStatus === 'Paid' ? 'text-whatsapp-green' : 'text-navy'}`}>
                    ${appt.amountDue.toFixed(2)}
                  </span>
                  {appt.paymentStatus === 'Pending' && (
                    <button
                      className="btn btn-xs btn-sage rounded-md shadow-sm"
                      onClick={() => handleMarkPaid(appt.id)}
                    >
                      <Check size={12} /> Paid
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Queue Card sub-component ─────────────────────────
function QueueCard({ appointment, onCheckIn, onCancel, onNoShow }) {
  const appt = appointment;
  const railClass = STATUS_RAIL_CLASS[appt.status] || '';

  return (
    <div className={`${railClass} bg-panel rounded-xl shadow-sm border border-rule/50 p-3 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="font-sans font-semibold text-[14px] text-navy truncate">{appt.patientName}</div>
          <div className="font-mono text-[11px] text-navy/50 mt-[2px]">{appt.time}</div>
          {appt.type === 'Walk-in' && (
            <span className="inline-block mt-1 bg-deep-blue/10 text-deep-blue text-[9px] font-sans font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-sm">Walk-in</span>
          )}
        </div>
      </div>
      {appt.chiefComplaint && (
        <div className="text-[11px] text-navy/60 mt-2 truncate bg-paper px-2 py-1 rounded-md border border-rule/30">{appt.chiefComplaint}</div>
      )}
      {appt.assignedRoom && (
        <div className="font-mono text-[10px] text-navy/40 mt-1.5 inline-block">{appt.assignedRoom}</div>
      )}

      {/* Actions */}
      {appt.status === 'Scheduled' && (
        <div className="flex items-center gap-1 mt-3 pt-2 border-t border-rule/50">
          <button className="btn btn-xs btn-primary flex-1 rounded-md" onClick={() => onCheckIn(appt.id)}>
            <ChevronRight size={12} /> Check In
          </button>
          <button className="btn btn-xs btn-danger rounded-md px-2" onClick={() => onCancel(appt.id)} title="Cancel">
            <X size={12} />
          </button>
          <button className="btn btn-xs btn-secondary rounded-md px-2 text-rust" onClick={() => onNoShow(appt.id)} title="No-show">
            <AlertCircle size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
