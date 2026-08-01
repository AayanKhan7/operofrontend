// ═══════════════════════════════════════════════════════════
// Doctor Dashboard v3 — Core / Distraction-Free (Brand Restyle)
// Active patient, history, prescription, discharge
// ═══════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { useOpero } from '../../context/OperoContext';
import StatusBadge from '../shared/StatusBadge';
import PulseDivider from '../shared/PulseDivider';
import {
  Users,
  FileText,
  Pill,
  ClipboardCheck,
  ChevronRight,
  Plus,
  Trash2,
  Clock,
  Activity,
  Heart,
  Thermometer,
  Weight,
  Printer,
} from 'lucide-react';

export default function DoctorDashboard() {
  const { todaysAppointments, patients, auth, dispatch, ACTIONS } = useOpero();
  const [selectedApptId, setSelectedApptId] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [prescriptions, setPrescriptions] = useState([{ drug: '', dosage: '', instructions: '' }]);
  const [confirmPulse, setConfirmPulse] = useState(false);

  const withDoctor = useMemo(() => {
    return todaysAppointments.filter(a => a.status === 'With Doctor');
  }, [todaysAppointments]);

  const waitingCount = useMemo(() => {
    return todaysAppointments.filter(a =>
      a.status === 'Checked-In' || a.status === 'With Nurse'
    ).length;
  }, [todaysAppointments]);

  const activeAppt = selectedApptId
    ? todaysAppointments.find(a => a.id === selectedApptId)
    : withDoctor[0] || null;

  const activePatient = activeAppt
    ? patients.find(p => p.id === activeAppt.patientId)
    : null;

  const handleSelectAppt = (id) => {
    setSelectedApptId(id);
    setActiveTab('notes');
    setDiagnosis('');
    setDoctorNotes('');
    setPrescriptions([{ drug: '', dosage: '', instructions: '' }]);
  };

  const addPrescriptionRow = () => {
    setPrescriptions([...prescriptions, { drug: '', dosage: '', instructions: '' }]);
  };

  const removePrescriptionRow = (idx) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== idx));
  };

  const updatePrescription = (idx, field, value) => {
    const updated = prescriptions.map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    );
    setPrescriptions(updated);
  };

  const handleDischarge = () => {
    if (!activeAppt) return;
    const validMeds = prescriptions.filter(p => p.drug.trim());
    const prescriptionText = validMeds
      .map(p => `${p.drug} ${p.dosage} — ${p.instructions}`)
      .join('; ');

    dispatch({
      type: ACTIONS.DISCHARGE_PATIENT,
      payload: {
        appointmentId: activeAppt.id,
        diagnosis,
        prescription: prescriptionText,
        doctorNotes,
      },
    });

    if (validMeds.length > 0) {
      dispatch({
        type: ACTIONS.ADD_PRESCRIPTION,
        payload: {
          patientId: activeAppt.patientId,
          patientName: activeAppt.patientName,
          prescribingDoctor: auth?.name || 'Dr. Unknown',
          date: new Date().toISOString().split('T')[0],
          medications: validMeds.map(m => ({
            drugName: m.drug,
            dosage: m.dosage,
            instructions: m.instructions,
          })),
        },
      });
    }

    setConfirmPulse(true);
    setTimeout(() => {
      setConfirmPulse(false);
      setSelectedApptId(null);
      setDiagnosis('');
      setDoctorNotes('');
      setPrescriptions([{ drug: '', dosage: '', instructions: '' }]);
    }, 600);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-serif font-semibold text-2xl text-navy">Doctor</h1>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-navy/50 bg-panel shadow-sm px-3 py-1 rounded-md border border-rule">
            <Users size={13} className="inline mr-1 -mt-[2px]" />
            <span className="font-semibold text-navy">{waitingCount}</span> waiting
          </span>
        </div>
      </div>

      {/* Patient selector tabs */}
      {withDoctor.length > 0 && (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          {withDoctor.map(appt => (
            <button
              key={appt.id}
              onClick={() => handleSelectAppt(appt.id)}
              className={`status-rail status-rail--with-doctor px-4 py-3 rounded-lg border text-left transition-colors flex-shrink-0 ${
                activeAppt?.id === appt.id
                  ? 'border-plum bg-plum/5 shadow-sm'
                  : 'border-rule bg-panel hover:bg-paper'
              }`}
            >
              <div className="font-sans font-semibold text-sm text-navy">{appt.patientName}</div>
              <div className="font-mono text-[11px] text-navy/50 mt-[2px]">{appt.time} · {appt.assignedRoom || 'No room'}</div>
            </button>
          ))}
        </div>
      )}

      {!activeAppt || activeAppt.status !== 'With Doctor' ? (
        <div className="card p-8 flex flex-col items-center justify-center min-h-[400px]">
          <ClipboardCheck size={40} className="text-rule mb-4" strokeWidth={1.5} />
          <p className="text-sm text-navy/50 font-sans text-center max-w-[320px] leading-relaxed">
            No active patient. Patients will appear here when marked &quot;Ready for Doctor&quot; by the nurse.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ═══ Left: Active Patient Panel ═══ */}
          <div className="lg:col-span-2">
            <div className="card p-6 mb-5 border-none">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-serif font-semibold text-[26px] text-navy leading-tight">{activeAppt.patientName}</h2>
                  {activePatient && (
                    <div className="font-sans text-sm text-navy/60 mt-1">
                      {activePatient.age}y · {activePatient.gender}
                      {activePatient.phone && <span className="font-mono text-[13px] ml-3 text-navy/50">{activePatient.phone}</span>}
                    </div>
                  )}
                </div>
                <StatusBadge status={activeAppt.status} />
              </div>

              {/* Vitals */}
              {activeAppt.vitals && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 p-4 bg-paper rounded-xl border border-rule/50">
                  <VitalDisplay icon={<Activity size={14} />} label="BP" value={activeAppt.vitals.bp} />
                  <VitalDisplay icon={<Weight size={14} />} label="Weight" value={activeAppt.vitals.weight} />
                  <VitalDisplay icon={<Thermometer size={14} />} label="Temp" value={activeAppt.vitals.temperature} />
                  <VitalDisplay icon={<Heart size={14} />} label="Pulse" value={activeAppt.vitals.pulse} />
                </div>
              )}

              {/* Chief complaint (Chat bubble echo) */}
              {activeAppt.chiefComplaint && (
                <div className="mt-4 p-4 bg-periwinkle/30 rounded-2xl rounded-tl-sm border border-periwinkle/50">
                  <div className="text-xs font-sans font-semibold text-deep-blue uppercase tracking-wider mb-1">Chief Complaint</div>
                  <p className="font-sans text-[15px] text-navy leading-relaxed">{activeAppt.chiefComplaint}</p>
                </div>
              )}

              {/* Current meds */}
              {activePatient?.currentMedications?.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-sans font-medium text-navy/50 uppercase tracking-wider mb-2">Current Medications</div>
                  <div className="flex flex-wrap gap-2">
                    {activePatient.currentMedications.map((med, i) => (
                      <span key={i} className="font-mono text-[13px] bg-paper px-2.5 py-1 rounded-md border border-rule text-navy/80">{med}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tab bar */}
            <div className="flex items-center gap-1 mb-4 border-b border-rule">
              <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} icon={<FileText size={16} />} label="Clinical Notes" />
              <TabButton active={activeTab === 'prescription'} onClick={() => setActiveTab('prescription')} icon={<Pill size={16} />} label="Prescription" />
              <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<Clock size={16} />} label="History" />
            </div>

            {/* Tab content */}
            {activeTab === 'notes' && (
              <div className="card p-6 border-none bg-paper/50">
                <div className="mb-4">
                  <label className="label text-navy/70">Diagnosis</label>
                  <input
                    type="text"
                    className="input bg-panel rounded-xl py-2.5 shadow-sm"
                    placeholder="Primary diagnosis"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label text-navy/70">Doctor Notes</label>
                  {/* Chat bubble styling for the notes input */}
                  <textarea
                    className="input bg-panel rounded-2xl rounded-tr-sm py-3 px-4 shadow-sm min-h-[120px] resize-y"
                    placeholder="Clinical observations, plan, follow-up instructions..."
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'prescription' && (
              <div className="card p-6 border-none bg-paper/50">
                <div className="space-y-3">
                  {prescriptions.map((rx, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-panel p-4 rounded-xl shadow-sm border border-rule/50">
                      <div className="md:col-span-4">
                        <label className="label text-navy/60">Drug Name</label>
                        <input
                          className="input font-mono bg-paper/50 rounded-lg"
                          placeholder="Medication"
                          value={rx.drug}
                          onChange={(e) => updatePrescription(idx, 'drug', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="label text-navy/60">Dosage</label>
                        <input
                          className="input font-mono bg-paper/50 rounded-lg"
                          placeholder="10mg"
                          value={rx.dosage}
                          onChange={(e) => updatePrescription(idx, 'dosage', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-4">
                        <label className="label text-navy/60">Instructions</label>
                        <input
                          className="input bg-paper/50 rounded-lg"
                          placeholder="Once daily"
                          value={rx.instructions}
                          onChange={(e) => updatePrescription(idx, 'instructions', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-1 flex justify-end md:justify-center pb-2">
                        {prescriptions.length > 1 && (
                          <button
                            className="text-rust/50 hover:text-rust transition-colors p-1"
                            onClick={() => removePrescriptionRow(idx)}
                            title="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-5">
                  <button className="btn btn-sm btn-secondary rounded-lg" onClick={addPrescriptionRow}>
                    <Plus size={14} /> Add Medication
                  </button>
                  <button className="btn btn-sm btn-secondary rounded-lg text-deep-blue mt-3 sm:mt-0" onClick={() => window.print()}>
                    <Printer size={14} /> <span className="hidden sm:inline">Print / Export</span><span className="sm:hidden">Print</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="card p-6 border-none bg-paper/50">
                {activePatient?.visitHistory?.length > 0 ? (
                  <div className="space-y-4">
                    {activePatient.visitHistory.slice(0, 3).map((visit, idx) => (
                      <div key={idx} className="bg-panel p-4 rounded-xl shadow-sm border border-rule/50 relative">
                        <div className="absolute -left-2 top-5 w-4 h-4 rounded-full bg-periwinkle border-2 border-paper" />
                        <div className="flex items-center justify-between mb-2 pl-3">
                          <span className="font-mono text-[13px] font-medium text-navy/50">{visit.date}</span>
                        </div>
                        <div className="pl-3">
                          <div className="font-sans text-[15px] font-semibold text-navy">{visit.diagnosis}</div>
                          <div className="text-[13px] text-navy/60 mt-1">{visit.chiefComplaint}</div>
                          {visit.prescription && (
                            <div className="flex items-start gap-2 mt-3 p-2.5 bg-paper rounded-lg">
                              <Pill size={14} className="text-deep-blue mt-[2px] flex-shrink-0" />
                              <div className="font-mono text-[13px] text-navy/80">{visit.prescription}</div>
                            </div>
                          )}
                          {visit.doctorNotes && (
                            <div className="text-[13px] text-navy/60 mt-3 italic border-l-2 border-rule pl-3 py-1">
                              "{visit.doctorNotes}"
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-navy/40 text-center py-6">No visit history on record.</p>
                )}
              </div>
            )}
          </div>

          {/* ═══ Right: Discharge ═══ */}
          <div>
            <div className="card p-5 sticky top-5 border-none shadow-card bg-panel">
              <h3 className="font-sans font-semibold text-lg text-navy mb-2">Discharge</h3>
              <p className="text-[13px] text-navy/60 mb-5 leading-relaxed">
                Marks the appointment as Completed, saves notes to patient history, creates a prescription record, and flags billing.
              </p>
              <button
                onClick={handleDischarge}
                className={`btn btn-sage w-full py-2.5 rounded-xl ${confirmPulse ? 'confirm-pulse' : ''}`}
                disabled={!diagnosis.trim()}
              >
                <ClipboardCheck size={18} />
                Discharge Patient
              </button>
              {!diagnosis.trim() && (
                <p className="text-[13px] text-navy/40 mt-3 text-center font-medium">Enter a diagnosis first.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────
function VitalDisplay({ icon, label, value }) {
  return (
    <div className="text-center bg-panel py-2 rounded-lg shadow-sm border border-rule/30">
      <div className="flex items-center justify-center gap-1.5 text-navy/50 mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-wider font-sans font-semibold">{label}</span>
      </div>
      <div className="font-mono font-medium text-[15px] text-navy">{value || '—'}</div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 text-sm font-sans font-semibold transition-all relative ${
        active
          ? 'text-deep-blue bg-paper/50 rounded-t-xl'
          : 'text-navy/50 hover:text-navy hover:bg-paper/30 rounded-t-xl'
      }`}
    >
      {icon}
      {label}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-deep-blue rounded-t-md" />
      )}
    </button>
  );
}
