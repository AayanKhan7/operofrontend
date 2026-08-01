// ═══════════════════════════════════════════════════════════
// SettingsForm — Clinic configuration
// ═══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useOpero } from '../../context/OperoContext';
import PulseDivider from '../shared/PulseDivider';
import {
  Building2,
  Clock,
  DoorOpen,
  Timer,
  Users,
  Plus,
  X,
  Save,
  Check,
} from 'lucide-react';

export default function SettingsForm() {
  const { settings, dispatch, ACTIONS } = useOpero();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [newRoom, setNewRoom] = useState('');

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const updateHours = (field, value) => {
    setForm(prev => ({ ...prev, hours: { ...prev.hours, [field]: value } }));
    setSaved(false);
  };

  const addRoom = () => {
    if (!newRoom.trim() || form.rooms.includes(newRoom.trim())) return;
    setForm(prev => ({ ...prev, rooms: [...prev.rooms, newRoom.trim()] }));
    setNewRoom('');
    setSaved(false);
  };

  const removeRoom = (room) => {
    setForm(prev => ({ ...prev, rooms: prev.rooms.filter(r => r !== room) }));
    setSaved(false);
  };

  const handleSave = () => {
    dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-[800px] mx-auto px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-serif font-semibold text-2xl text-navy">Settings</h1>
          <p className="text-sm text-navy/50 font-sans mt-[2px]">Clinic configuration</p>
        </div>
        <button
          onClick={handleSave}
          className={`btn ${saved ? 'btn-sage' : 'btn-primary'}`}
        >
          {saved ? <><Check size={15} /> Saved</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>

      {/* ── Clinic Info ── */}
      <div className="card p-4 mb-4">
        <h2 className="font-sans font-semibold text-base mb-3 flex items-center gap-2">
          <Building2 size={16} className="text-deep-blue" />
          Clinic Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="label">Clinic Name</label>
            <input
              type="text"
              className="input"
              value={form.clinicName}
              onChange={(e) => update('clinicName', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Hours ── */}
      <div className="card p-4 mb-4">
        <h2 className="font-sans font-semibold text-base mb-3 flex items-center gap-2">
          <Clock size={16} className="text-deep-blue" />
          Operating Hours
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Open</label>
            <input
              type="time"
              className="input font-mono"
              value={form.hours.open}
              onChange={(e) => updateHours('open', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Close</label>
            <input
              type="time"
              className="input font-mono"
              value={form.hours.close}
              onChange={(e) => updateHours('close', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Rooms ── */}
      <div className="card p-4 mb-4">
        <h2 className="font-sans font-semibold text-base mb-3 flex items-center gap-2">
          <DoorOpen size={16} className="text-deep-blue" />
          Exam Rooms
        </h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.rooms.map(room => (
            <div
              key={room}
              className="flex items-center gap-1 font-mono text-sm bg-paper px-3 py-[6px] rounded border border-rule"
            >
              {room}
              <button
                onClick={() => removeRoom(room)}
                className="text-navy/30 hover:text-rust transition-colors ml-1"
                title="Remove room"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="input max-w-[200px]"
            placeholder="New room name"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRoom())}
          />
          <button className="btn btn-sm btn-secondary" onClick={addRoom}>
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* ── Appointment Duration ── */}
      <div className="card p-4 mb-4">
        <h2 className="font-sans font-semibold text-base mb-3 flex items-center gap-2">
          <Timer size={16} className="text-deep-blue" />
          Appointment Slot Duration
        </h2>
        <div className="flex items-center gap-3">
          <select
            className="input max-w-[160px] font-mono"
            value={form.appointmentSlotDurationMinutes}
            onChange={(e) => update('appointmentSlotDurationMinutes', parseInt(e.target.value, 10))}
          >
            {[15, 20, 30, 45, 60].map(d => (
              <option key={d} value={d}>{d} minutes</option>
            ))}
          </select>
        </div>
      </div>

      <PulseDivider className="my-4" />

      {/* ── Staff ── */}
      <div className="card p-4">
        <h2 className="font-sans font-semibold text-base mb-3 flex items-center gap-2">
          <Users size={16} className="text-deep-blue" />
          Staff
        </h2>
        <div className="space-y-0">
          {form.staff.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-rule last:border-b-0">
              <span className="font-sans text-sm font-medium text-navy">{s.name}</span>
              <span className="font-mono text-xs text-navy/40 uppercase">{s.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
