// ═══════════════════════════════════════════════════════════
// WalkInForm — Quick entry: creates Patient + Appointment
// ═══════════════════════════════════════════════════════════

import React from 'react';
import { useForm } from 'react-hook-form';
import { useOpero } from '../../context/OperoContext';

export default function WalkInForm({ onComplete }) {
  const { dispatch, ACTIONS, patients } = useOpero();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    // Check if patient already exists by phone
    const existing = patients.find(p => p.phone === data.phone);
    let patientId, patientName;

    if (existing) {
      patientId = existing.id;
      patientName = existing.name;
    } else {
      // Create new patient
      const newPatientData = {
        name: data.name,
        age: parseInt(data.age, 10),
        gender: data.gender || 'Other',
        phone: data.phone,
        address: '',
      };
      dispatch({ type: ACTIONS.ADD_PATIENT, payload: newPatientData });
      // Compute the ID that will be assigned
      const nums = patients.map(p => parseInt(p.id.replace('P', ''), 10));
      const nextNum = Math.max(0, ...nums) + 1;
      patientId = `P${String(nextNum).padStart(3, '0')}`;
      patientName = data.name;
    }

    // Create appointment as Checked-In
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    dispatch({
      type: ACTIONS.ADD_APPOINTMENT,
      payload: {
        patientId,
        patientName,
        date: now.toISOString().split('T')[0],
        time,
        type: 'Walk-in',
        status: 'Checked-In',
        chiefComplaint: data.chiefComplaint || null,
        amountDue: 75,
      },
    });

    onComplete?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="label">Patient Name *</label>
        <input
          {...register('name', { required: 'Name is required' })}
          className={`input ${errors.name ? 'input-error' : ''}`}
          placeholder="Full name"
        />
        {errors.name && <div className="field-error">{errors.name.message}</div>}
      </div>

      <div>
        <label className="label">Phone *</label>
        <input
          {...register('phone', { required: 'Phone is required' })}
          className={`input ${errors.phone ? 'input-error' : ''}`}
          placeholder="(555) 000-0000"
        />
        {errors.phone && <div className="field-error">{errors.phone.message}</div>}
      </div>

      <div>
        <label className="label">Age *</label>
        <input
          type="number"
          {...register('age', { required: 'Age is required', min: { value: 0, message: 'Invalid age' } })}
          className={`input ${errors.age ? 'input-error' : ''}`}
          placeholder="Age"
        />
        {errors.age && <div className="field-error">{errors.age.message}</div>}
      </div>

      <div>
        <label className="label">Gender</label>
        <select {...register('gender')} className="input">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className="label">Chief Complaint</label>
        <textarea
          {...register('chiefComplaint')}
          className="input"
          rows={2}
          placeholder="Brief description of reason for visit"
        />
      </div>

      <div className="sm:col-span-2 flex justify-end">
        <button type="submit" className="btn btn-primary">
          Check In Walk-In
        </button>
      </div>
    </form>
  );
}
