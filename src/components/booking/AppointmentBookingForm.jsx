// ═══════════════════════════════════════════════════════════
// AppointmentBookingForm — Book a new appointment
// Reusable from Receptionist and Patient Profile
// ═══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOpero } from '../../context/OperoContext';
import { Search } from 'lucide-react';

export default function AppointmentBookingForm({ prefillPatientId, onComplete }) {
  const { patients, dispatch, ACTIONS } = useOpero();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      patientId: prefillPatientId || '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      type: 'Scheduled',
      chiefComplaint: '',
    },
  });
  const [patientSearch, setPatientSearch] = useState('');
  const [showSearch, setShowSearch] = useState(!prefillPatientId);
  const [selectedPatient, setSelectedPatient] = useState(
    prefillPatientId ? patients.find(p => p.id === prefillPatientId) : null
  );

  const filteredPatients = patientSearch.length > 0
    ? patients.filter(p =>
        p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.phone.includes(patientSearch)
      )
    : [];

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setValue('patientId', patient.id);
    setPatientSearch('');
    setShowSearch(false);
  };

  const onSubmit = (data) => {
    if (!selectedPatient) return;
    dispatch({
      type: ACTIONS.ADD_APPOINTMENT,
      payload: {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        date: data.date,
        time: data.time,
        type: data.type,
        chiefComplaint: data.chiefComplaint || null,
        amountDue: 75,
      },
    });
    onComplete?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Patient select */}
      <div>
        <label className="label">Patient *</label>
        {selectedPatient ? (
          <div className="flex items-center justify-between bg-paper px-3 py-2 rounded border border-rule">
            <div>
              <span className="font-sans font-medium text-sm">{selectedPatient.name}</span>
              <span className="font-mono text-xs text-navy/40 ml-2">{selectedPatient.phone}</span>
            </div>
            <button
              type="button"
              className="btn btn-xs btn-secondary"
              onClick={() => { setSelectedPatient(null); setShowSearch(true); }}
            >
              Change
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
            <input
              type="text"
              className="input pl-8"
              placeholder="Search by name or phone..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
            />
            {filteredPatients.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-panel border border-rule rounded mt-1 max-h-[160px] overflow-y-auto z-10">
                {filteredPatients.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-paper border-b border-rule last:border-b-0 transition-colors"
                    onClick={() => selectPatient(p)}
                  >
                    <span className="font-sans font-medium">{p.name}</span>
                    <span className="font-mono text-xs text-navy/40 ml-2">{p.phone}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {!selectedPatient && (
          <input type="hidden" {...register('patientId', { required: 'Select a patient' })} />
        )}
        {errors.patientId && <div className="field-error">{errors.patientId.message}</div>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="label">Date *</label>
          <input
            type="date"
            {...register('date', { required: 'Date is required' })}
            className={`input font-mono ${errors.date ? 'input-error' : ''}`}
          />
          {errors.date && <div className="field-error">{errors.date.message}</div>}
        </div>

        <div>
          <label className="label">Time *</label>
          <input
            type="time"
            {...register('time', { required: 'Time is required' })}
            className={`input font-mono ${errors.time ? 'input-error' : ''}`}
          />
          {errors.time && <div className="field-error">{errors.time.message}</div>}
        </div>

        <div>
          <label className="label">Type</label>
          <select {...register('type')} className="input">
            <option value="Scheduled">Scheduled</option>
            <option value="Walk-in">Walk-in</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Chief Complaint</label>
        <textarea
          {...register('chiefComplaint')}
          className="input"
          rows={2}
          placeholder="Reason for visit (optional)"
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={!selectedPatient}>
          Book Appointment
        </button>
      </div>
    </form>
  );
}
