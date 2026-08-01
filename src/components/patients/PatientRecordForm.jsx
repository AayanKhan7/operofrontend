// ═══════════════════════════════════════════════════════════
// PatientRecordForm — Add or edit patient records
// ═══════════════════════════════════════════════════════════

import React from 'react';
import { useForm } from 'react-hook-form';
import { useOpero } from '../../context/OperoContext';

export default function PatientRecordForm({ existingPatient, onComplete }) {
  const { dispatch, ACTIONS } = useOpero();
  const isEditing = !!existingPatient;

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: isEditing
      ? {
          name: existingPatient.name,
          age: existingPatient.age,
          gender: existingPatient.gender,
          phone: existingPatient.phone,
          address: existingPatient.address,
          currentMedications: existingPatient.currentMedications?.join(', ') || '',
        }
      : {
          name: '',
          age: '',
          gender: 'Male',
          phone: '',
          address: '',
          currentMedications: '',
        },
  });

  const onSubmit = (data) => {
    const meds = data.currentMedications
      ? data.currentMedications.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    if (isEditing) {
      dispatch({
        type: ACTIONS.UPDATE_PATIENT,
        payload: {
          id: existingPatient.id,
          name: data.name,
          age: parseInt(data.age, 10),
          gender: data.gender,
          phone: data.phone,
          address: data.address,
          currentMedications: meds,
        },
      });
    } else {
      dispatch({
        type: ACTIONS.ADD_PATIENT,
        payload: {
          name: data.name,
          age: parseInt(data.age, 10),
          gender: data.gender,
          phone: data.phone,
          address: data.address,
          currentMedications: meds,
        },
      });
    }

    onComplete?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="label">Full Name *</label>
        <input
          {...register('name', { required: 'Name is required' })}
          className={`input ${errors.name ? 'input-error' : ''}`}
          placeholder="Patient name"
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
          {...register('age', { required: 'Age is required', min: { value: 0, message: 'Invalid' } })}
          className={`input font-mono ${errors.age ? 'input-error' : ''}`}
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
        <label className="label">Address</label>
        <input
          {...register('address')}
          className="input"
          placeholder="Street address"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="label">Current Medications</label>
        <input
          {...register('currentMedications')}
          className="input font-mono"
          placeholder="Comma-separated (e.g. Lisinopril 10mg, Metformin 500mg)"
        />
        <div className="text-xs text-navy/40 mt-1">Separate multiple medications with commas.</div>
      </div>

      <div className="sm:col-span-2 flex justify-end">
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Save Changes' : 'Register Patient'}
        </button>
      </div>
    </form>
  );
}
