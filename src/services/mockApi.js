// ═══════════════════════════════════════════════════════════
// OPERO ANALYZER v2 — Mock API / Service Layer
// Auth, CRUD, localStorage persistence
// ═══════════════════════════════════════════════════════════

import { seedPatients, seedAppointments, seedUsers, seedPrescriptions, seedSettings } from '../data/seedData';

const KEYS = {
  PATIENTS: 'opero_patients',
  APPOINTMENTS: 'opero_appointments',
  PRESCRIPTIONS: 'opero_prescriptions',
  SETTINGS: 'opero_settings',
  AUTH: 'opero_auth',
};

// ─── Persistence helpers ─────────────────────────────────
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch { /* corrupted — fall through */ }
  return fallback;
}

function save(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* silent */ }
}

// ─── Initial load ────────────────────────────────────────
export function loadInitialData() {
  return {
    patients: load(KEYS.PATIENTS, seedPatients),
    appointments: load(KEYS.APPOINTMENTS, seedAppointments),
    prescriptions: load(KEYS.PRESCRIPTIONS, seedPrescriptions),
    settings: load(KEYS.SETTINGS, seedSettings),
    auth: load(KEYS.AUTH, null),
  };
}

// ─── Persist functions ───────────────────────────────────
export function persistPatients(d)      { save(KEYS.PATIENTS, d); }
export function persistAppointments(d)  { save(KEYS.APPOINTMENTS, d); }
export function persistPrescriptions(d) { save(KEYS.PRESCRIPTIONS, d); }
export function persistSettings(d)      { save(KEYS.SETTINGS, d); }
export function persistAuth(d)          { save(KEYS.AUTH, d); }
export function clearAuth()             { localStorage.removeItem(KEYS.AUTH); }

// ─── Auth ────────────────────────────────────────────────
export function authenticateUser(email, password) {
  const user = seedUsers.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password
  );
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

// ─── ID generators ───────────────────────────────────────
export function generatePatientId(patients) {
  const nums = patients.map(p => parseInt(p.id.replace('P', ''), 10));
  return `P${String(Math.max(0, ...nums) + 1).padStart(3, '0')}`;
}

export function generateAppointmentId(appointments) {
  const nums = appointments.map(a => parseInt(a.id.replace('A', ''), 10));
  return `A${String(Math.max(0, ...nums) + 1).padStart(3, '0')}`;
}

export function generatePrescriptionId(prescriptions) {
  const nums = prescriptions.map(r => parseInt(r.id.replace('RX', ''), 10));
  return `RX${String(Math.max(0, ...nums) + 1).padStart(3, '0')}`;
}

// ─── Reset ───────────────────────────────────────────────
export function resetData() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  return {
    patients: seedPatients,
    appointments: seedAppointments,
    prescriptions: seedPrescriptions,
    settings: seedSettings,
  };
}
