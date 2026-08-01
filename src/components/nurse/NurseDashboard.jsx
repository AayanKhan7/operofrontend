// ═══════════════════════════════════════════════════════════
// Nurse Dashboard v3 (Brand Restyle)
// ═══════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { useOpero } from '../../context/OperoContext';
import StatusBadge from '../shared/StatusBadge';
import PulseDivider from '../shared/PulseDivider';
import {
  Users,
  ClipboardList,
  Stethoscope,
  Activity,
  Thermometer,
  Weight,
  Heart,
  MessageSquare,
  Check,
} from 'lucide-react';

export default function NurseDashboard() {
  const { todaysAppointments, patients, settings, dispatch, ACTIONS } = useOpero();
  const [selectedApptId, setSelectedApptId] = useState(null);
  
  // Triage state
  const [vitals, setVitals] = useState({ bp: '', weight: '', temperature: '', pulse: '' });
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [confirmPulse, setConfirmPulse] = useState(false);

  const nextUpList = useMemo(() => {
    return todaysAppointments
      .filter(a => a.status === 'Checked-In' || a.status === 'With Nurse')
      .sort((a, b) => {
        if (a.status === 'With Nurse' && b.status !== 'With Nurse') return -1;
        if (b.status === 'With Nurse' && a.status !== 'With Nurse') return 1;
        return a.time.localeCompare(b.time);
      });
  }, [todaysAppointments]);

  const activeAppt = selectedApptId 
    ? todaysAppointments.find(a => a.id === selectedApptId) 
    : nextUpList[0] || null;

  const activePatient = activeAppt 
    ? patients.find(p => p.id === activeAppt.patientId) 
    : null;

  const handleSelectAppt = (appt) => {
    setSelectedApptId(appt.id);
    if (appt.status === 'Checked-In') {
      dispatch({ type: ACTIONS.ADVANCE_STATUS, payload: appt.id });
    }
    setVitals(appt.vitals || { bp: '', weight: '', temperature: '', pulse: '' });
    setChiefComplaint(appt.chiefComplaint || '');
    setSelectedRoom(appt.assignedRoom || '');
  };

  const handleVitalChange = (field, value) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  const handleReadyForDoctor = () => {
    if (!activeAppt) return;
    
    if (selectedRoom !== activeAppt.assignedRoom) {
      dispatch({ 
        type: ACTIONS.ASSIGN_ROOM, 
        payload: { appointmentId: activeAppt.id, room: selectedRoom } 
      });
    }

    dispatch({
      type: ACTIONS.READY_FOR_DOCTOR,
      payload: { appointmentId: activeAppt.id, vitals, chiefComplaint },
    });

    setConfirmPulse(true);
    setTimeout(() => {
      setConfirmPulse(false);
      setSelectedApptId(null);
      setVitals({ bp: '', weight: '', temperature: '', pulse: '' });
      setChiefComplaint('');
      setSelectedRoom('');
    }, 600);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-serif font-semibold text-2xl text-navy">Nurse Station</h1>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-navy/50 bg-panel shadow-sm px-3 py-1 rounded-md border border-rule">
            <Users size={13} className="inline mr-1 -mt-[2px]" />
            <span className="font-semibold text-navy">{nextUpList.length}</span> in queue
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ═══ Left: Next Up Queue ═══ */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <h2 className="font-sans font-semibold text-base text-navy flex items-center gap-2 mb-1">
            <ClipboardList size={18} className="text-deep-blue" />
            Next Up
          </h2>
          
          {nextUpList.length === 0 ? (
            <div className="card p-6 text-center text-navy/40 border-dashed border-2">
              <p className="text-sm font-sans">No patients waiting for triage.</p>
            </div>
          ) : (
            nextUpList.map(appt => (
              <button
                key={appt.id}
                onClick={() => handleSelectAppt(appt)}
                className={`card p-4 text-left transition-all ${
                  activeAppt?.id === appt.id 
                    ? 'border-deep-blue shadow-md ring-1 ring-deep-blue/20' 
                    : 'hover:border-deep-blue/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-sans font-semibold text-[15px] text-navy">{appt.patientName}</div>
                  <StatusBadge status={appt.status} size="xs" />
                </div>
                <div className="font-mono text-xs text-navy/50">
                  <Clock size={11} className="inline mr-1 -mt-[2px]" />
                  {appt.time} {appt.assignedRoom ? `· ${appt.assignedRoom}` : ''}
                </div>
              </button>
            ))
          )}
        </div>

        {/* ═══ Right: Triage Form ═══ */}
        <div className="lg:col-span-8">
          {!activeAppt ? (
            <div className="card p-10 flex flex-col items-center justify-center min-h-[400px] border-none bg-panel">
              <Stethoscope size={40} className="text-rule mb-4" strokeWidth={1.5} />
              <p className="text-sm text-navy/40 font-sans">Select a patient from the queue to begin triage.</p>
            </div>
          ) : (
            <div className="card border-none bg-panel shadow-card">
              {/* Header */}
              <div className="p-5 border-b border-rule bg-paper/30 rounded-t-xl">
                <div className="flex items-start justify-between mb-1">
                  <h2 className="font-serif font-semibold text-[22px] text-navy leading-tight">
                    {activeAppt.patientName}
                  </h2>
                  <StatusBadge status={activeAppt.status} />
                </div>
                {activePatient && (
                  <div className="font-sans text-[13px] text-navy/60">
                    ID: <span className="font-mono mr-3">{activePatient.id}</span>
                    DOB: <span className="font-mono">{activePatient.age}y</span>
                  </div>
                )}
              </div>

              {/* Form Body */}
              <div className="p-5 space-y-6">
                
                {/* Vitals Grid */}
                <div>
                  <h3 className="font-sans font-semibold text-[13px] uppercase tracking-wider text-navy/50 mb-3 flex items-center gap-2">
                    <Activity size={14} /> Vitals
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="label text-navy/70">Blood Pressure</label>
                      <div className="relative">
                        <Activity size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
                        <input
                          type="text"
                          className="input pl-9 font-mono bg-paper/50 rounded-lg"
                          placeholder="120/80"
                          value={vitals.bp}
                          onChange={e => handleVitalChange('bp', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label text-navy/70">Weight</label>
                      <div className="relative">
                        <Weight size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
                        <input
                          type="text"
                          className="input pl-9 font-mono bg-paper/50 rounded-lg"
                          placeholder="150 lbs"
                          value={vitals.weight}
                          onChange={e => handleVitalChange('weight', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label text-navy/70">Temp</label>
                      <div className="relative">
                        <Thermometer size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
                        <input
                          type="text"
                          className="input pl-9 font-mono bg-paper/50 rounded-lg"
                          placeholder="98.6 °F"
                          value={vitals.temperature}
                          onChange={e => handleVitalChange('temperature', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label text-navy/70">Pulse</label>
                      <div className="relative">
                        <Heart size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
                        <input
                          type="text"
                          className="input pl-9 font-mono bg-paper/50 rounded-lg"
                          placeholder="72 bpm"
                          value={vitals.pulse}
                          onChange={e => handleVitalChange('pulse', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <PulseDivider />

                {/* Complaint */}
                <div>
                  <h3 className="font-sans font-semibold text-[13px] uppercase tracking-wider text-navy/50 mb-3 flex items-center gap-2">
                    <MessageSquare size={14} /> Reason for Visit
                  </h3>
                  <textarea
                    className="input bg-periwinkle/10 border-periwinkle/30 rounded-xl p-3 min-h-[100px]"
                    placeholder="Patient's primary complaint or reason for visit..."
                    value={chiefComplaint}
                    onChange={e => setChiefComplaint(e.target.value)}
                  />
                </div>

                {/* Room Assignment & Action */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <div className="w-full sm:w-auto flex-1">
                    <label className="label text-navy/70">Assign Room</label>
                    <select
                      className="input bg-paper/50 rounded-lg"
                      value={selectedRoom}
                      onChange={e => setSelectedRoom(e.target.value)}
                    >
                      <option value="">-- Select Room --</option>
                      {settings.rooms.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="w-full sm:w-[220px] self-end">
                    <button
                      onClick={handleReadyForDoctor}
                      className={`btn btn-primary w-full py-2.5 rounded-lg text-[15px] ${confirmPulse ? 'confirm-pulse' : ''}`}
                    >
                      <Check size={18} />
                      Ready for Doctor
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
