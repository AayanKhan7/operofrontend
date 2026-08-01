// ═══════════════════════════════════════════════════════════
// Patient Profile v3 (Brand Restyle)
// Demographics, visit history, medications, booking
// ═══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useOpero } from '../../context/OperoContext';
import StatusBadge from '../shared/StatusBadge';
import PulseDivider from '../shared/PulseDivider';
import AppointmentBookingForm from '../booking/AppointmentBookingForm';
import PatientRecordForm from './PatientRecordForm';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  Pill,
  CalendarPlus,
  Edit3,
  X,
} from 'lucide-react';

export default function PatientProfile({ patientId, onBack }) {
  const { patients, appointments, dispatch, ACTIONS } = useOpero();
  const patient = patients.find(p => p.id === patientId);
  const [showBooking, setShowBooking] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  if (!patient) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-5">
        <button className="btn btn-secondary rounded-lg mb-5" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </button>
        <p className="text-sm text-navy/40">Patient not found.</p>
      </div>
    );
  }

  const patientAppointments = appointments.filter(a => a.patientId === patientId);
  const toggleStatus = () => {
    dispatch({
      type: ACTIONS.UPDATE_PATIENT,
      payload: {
        id: patientId,
        status: patient.status === 'Active' ? 'Inactive' : 'Active',
      },
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-5">
      {/* Back button */}
      <button className="btn btn-secondary btn-sm rounded-md mb-5" onClick={onBack}>
        <ArrowLeft size={14} /> Back to Directory
      </button>

      {/* Header card */}
      <div className="card p-6 mb-5 border-none shadow-card bg-panel relative overflow-hidden">
        {/* Soft gradient wash in background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-periwinkle/20 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="flex items-start justify-between relative">
          <div>
            <h1 className="font-serif font-semibold text-[26px] text-navy">{patient.name}</h1>
            <div className="flex items-center gap-5 mt-2 text-[14px] text-navy/60 font-sans">
              <span className="font-mono bg-paper px-2 py-0.5 rounded-md border border-rule/50">{patient.age}y</span>
              <span className="font-medium">{patient.gender}</span>
              <span className="font-mono flex items-center gap-1.5 bg-paper px-2 py-0.5 rounded-md border border-rule/50">
                <Phone size={12} className="text-navy/40" /> {patient.phone}
              </span>
            </div>
            {patient.address && (
              <div className="flex items-center gap-2 text-[13px] text-navy/50 mt-3">
                <MapPin size={12} className="text-navy/40" /> {patient.address}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={patient.status} />
            <button className="btn btn-xs btn-secondary rounded-md" onClick={toggleStatus}>
              {patient.status === 'Active' ? 'Deactivate' : 'Activate'}
            </button>
            <button
              className={`btn btn-xs ${showEdit ? 'btn-primary' : 'btn-secondary'} rounded-md`}
              onClick={() => setShowEdit(!showEdit)}
            >
              {showEdit ? <><X size={12} /> Close</> : <><Edit3 size={12} /> Edit</>}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-5 mt-5 pt-4 border-t border-rule/50 text-[13px] font-sans text-navy/50 relative">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-navy/30" />
            Registered: <span className="font-mono font-medium text-navy/70">{patient.registeredDate}</span>
          </span>
          <span className="flex items-center gap-1.5">
            Last visit: <span className="font-mono font-medium text-navy/70">{patient.lastVisitDate || 'Never'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            Visits: <span className="font-mono font-medium text-navy/70">{patient.visitHistory.length}</span>
          </span>
        </div>
      </div>

      {/* Edit form */}
      {showEdit && (
        <div className="card p-5 mb-5 border-none shadow-sm">
          <h2 className="font-sans font-semibold text-lg text-navy mb-4">Edit Patient</h2>
          <PatientRecordForm
            existingPatient={patient}
            onComplete={() => setShowEdit(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ═══ Left: Visit History ═══ */}
        <div className="lg:col-span-2">
          <div className="card p-6 border-none shadow-card bg-panel">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-sans font-semibold text-[17px] text-navy">Visit History</h2>
              <button
                className={`btn btn-sm ${showBooking ? 'btn-primary' : 'btn-secondary'} rounded-lg`}
                onClick={() => setShowBooking(!showBooking)}
              >
                {showBooking ? <><X size={14} /> Close</> : <><CalendarPlus size={14} /> Book Follow-up</>}
              </button>
            </div>

            {showBooking && (
              <div className="mb-5 pb-5 border-b border-rule/50">
                <AppointmentBookingForm
                  prefillPatientId={patientId}
                  onComplete={() => setShowBooking(false)}
                />
              </div>
            )}

            {patient.visitHistory.length === 0 ? (
              <p className="text-[14px] text-navy/40 text-center py-8 bg-paper/30 rounded-xl border-2 border-dashed border-rule/50">No visit history yet.</p>
            ) : (
              <div className="space-y-4">
                {patient.visitHistory.map((visit, idx) => (
                  <div key={idx} className="bg-paper/30 rounded-xl p-4 border border-rule/50 hover:bg-paper/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[13px] font-medium text-navy/50 bg-panel px-2 py-0.5 rounded border border-rule/30 shadow-sm">{visit.date}</span>
                    </div>
                    <div className="font-sans font-semibold text-[15px] text-navy">{visit.diagnosis}</div>
                    {visit.chiefComplaint && (
                      <div className="text-[13px] text-navy/60 mt-1">CC: {visit.chiefComplaint}</div>
                    )}
                    {visit.vitals && (
                      <div className="flex items-center gap-3 mt-3 font-mono text-[11px] text-navy/50 bg-panel p-2 rounded-lg border border-rule/30">
                        {visit.vitals.bp && <span><span className="text-navy/30">BP</span> {visit.vitals.bp}</span>}
                        {visit.vitals.pulse && <span><span className="text-navy/30">P</span> {visit.vitals.pulse}</span>}
                        {visit.vitals.temperature && <span><span className="text-navy/30">T</span> {visit.vitals.temperature}</span>}
                        {visit.vitals.weight && <span><span className="text-navy/30">W</span> {visit.vitals.weight}</span>}
                      </div>
                    )}
                    {visit.prescription && (
                      <div className="flex items-start gap-2 mt-3 p-2.5 bg-paper rounded-lg">
                        <Pill size={14} className="text-deep-blue mt-[2px] flex-shrink-0" />
                        <div className="font-mono text-[13px] text-navy/80">{visit.prescription}</div>
                      </div>
                    )}
                    {visit.doctorNotes && (
                      <div className="text-[13px] text-navy/60 mt-3 italic border-l-2 border-rule/80 pl-3 py-0.5">
                        &quot;{visit.doctorNotes}&quot;
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ═══ Right: Sidebar info ═══ */}
        <div>
          {/* Current Medications */}
          <div className="card p-5 mb-5 border-none shadow-card bg-panel">
            <h3 className="font-sans font-semibold text-[15px] text-navy mb-4 flex items-center gap-2">
              <Pill size={16} className="text-deep-blue" />
              Current Medications
            </h3>
            {patient.currentMedications.length === 0 ? (
              <p className="text-[13px] text-navy/40">None on record.</p>
            ) : (
              <div className="space-y-2">
                {patient.currentMedications.map((med, i) => (
                  <div key={i} className="font-mono text-[13px] bg-paper px-3 py-2 rounded-lg border border-rule/50 text-navy/80">
                    {med}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointments */}
          <div className="card p-5 border-none shadow-card bg-panel">
            <h3 className="font-sans font-semibold text-[15px] text-navy mb-4">Upcoming Appointments</h3>
            {patientAppointments.length === 0 ? (
              <p className="text-[13px] text-navy/40">No appointments.</p>
            ) : (
              <div className="space-y-2">
                {patientAppointments.slice(0, 5).map(appt => (
                  <div key={appt.id} className="flex items-center justify-between py-2.5 px-3 bg-paper/30 rounded-lg hover:bg-paper transition-colors">
                    <div>
                      <span className="font-mono text-[13px] font-medium text-navy/60 block">{appt.date}</span>
                      <span className="font-mono text-[11px] text-navy/40">{appt.time}</span>
                    </div>
                    <StatusBadge status={appt.status} size="xs" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
