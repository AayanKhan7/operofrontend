// ═══════════════════════════════════════════════════════════
// OPERO ANALYZER v2 — Shared State Context
// Auth + patients + appointments + prescriptions + settings
// ═══════════════════════════════════════════════════════════

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  loadInitialData,
  persistPatients,
  persistAppointments,
  persistPrescriptions,
  persistSettings,
  persistAuth,
  clearAuth,
  generatePatientId,
  generateAppointmentId,
  generatePrescriptionId,
  resetData,
} from '../services/mockApi';

const OperoContext = createContext(null);

// ─── Action types ────────────────────────────────────────
const ACTIONS = {
  // Auth
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  // Patient
  ADD_PATIENT: 'ADD_PATIENT',
  UPDATE_PATIENT: 'UPDATE_PATIENT',
  // Appointment
  ADD_APPOINTMENT: 'ADD_APPOINTMENT',
  UPDATE_APPOINTMENT: 'UPDATE_APPOINTMENT',
  ADVANCE_STATUS: 'ADVANCE_STATUS',
  CANCEL_APPOINTMENT: 'CANCEL_APPOINTMENT',
  MARK_NO_SHOW: 'MARK_NO_SHOW',
  MARK_PAID: 'MARK_PAID',
  // Nurse
  SAVE_VITALS: 'SAVE_VITALS',
  ASSIGN_ROOM: 'ASSIGN_ROOM',
  READY_FOR_DOCTOR: 'READY_FOR_DOCTOR',
  // Doctor
  DISCHARGE_PATIENT: 'DISCHARGE_PATIENT',
  // Prescriptions
  ADD_PRESCRIPTION: 'ADD_PRESCRIPTION',
  // Settings
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  // System
  RESET_DATA: 'RESET_DATA',
};

// ─── Helpers ─────────────────────────────────────────────
const ts = () => new Date().toISOString();

function appendStatusLog(appointment, newStatus) {
  const log = appointment.statusLog || [];
  return [...log, { status: newStatus, timestamp: ts() }];
}

// ─── Initial state ───────────────────────────────────────
const initialData = loadInitialData();
const initialState = {
  auth: initialData.auth, // { id, name, email, role } | null
  patients: initialData.patients,
  appointments: initialData.appointments,
  prescriptions: initialData.prescriptions,
  settings: initialData.settings,
};

// ─── Reducer ─────────────────────────────────────────────
function operoReducer(state, action) {
  switch (action.type) {
    // ── Auth ──
    case ACTIONS.LOGIN:
      return { ...state, auth: action.payload };

    case ACTIONS.LOGOUT:
      return { ...state, auth: null };

    // ── Patients ──
    case ACTIONS.ADD_PATIENT: {
      const newPatient = {
        ...action.payload,
        id: generatePatientId(state.patients),
        registeredDate: new Date().toISOString().split('T')[0],
        lastVisitDate: null,
        currentMedications: action.payload.currentMedications || [],
        visitHistory: [],
        status: 'Active',
      };
      return { ...state, patients: [...state.patients, newPatient] };
    }

    case ACTIONS.UPDATE_PATIENT: {
      const patients = state.patients.map(p =>
        p.id === action.payload.id ? { ...p, ...action.payload } : p
      );
      return { ...state, patients };
    }

    // ── Appointments ──
    case ACTIONS.ADD_APPOINTMENT: {
      const newStatus = action.payload.status || 'Scheduled';
      const newAppt = {
        ...action.payload,
        id: generateAppointmentId(state.appointments),
        assignedRoom: action.payload.assignedRoom || null,
        vitals: null,
        paymentStatus: 'Pending',
        amountDue: action.payload.amountDue || 75,
        statusLog: [{ status: newStatus, timestamp: ts() }],
      };
      return { ...state, appointments: [...state.appointments, newAppt] };
    }

    case ACTIONS.UPDATE_APPOINTMENT: {
      const appointments = state.appointments.map(a =>
        a.id === action.payload.id ? { ...a, ...action.payload } : a
      );
      return { ...state, appointments };
    }

    case ACTIONS.ADVANCE_STATUS: {
      const statusFlow = ['Scheduled', 'Checked-In', 'With Nurse', 'With Doctor', 'Completed'];
      const appointments = state.appointments.map(a => {
        if (a.id !== action.payload) return a;
        const idx = statusFlow.indexOf(a.status);
        if (idx < 0 || idx >= statusFlow.length - 1) return a;
        const next = statusFlow[idx + 1];
        return { ...a, status: next, statusLog: appendStatusLog(a, next) };
      });
      return { ...state, appointments };
    }

    case ACTIONS.CANCEL_APPOINTMENT: {
      const appointments = state.appointments.map(a =>
        a.id === action.payload
          ? { ...a, status: 'Cancelled', statusLog: appendStatusLog(a, 'Cancelled') }
          : a
      );
      return { ...state, appointments };
    }

    case ACTIONS.MARK_NO_SHOW: {
      const appointments = state.appointments.map(a =>
        a.id === action.payload
          ? { ...a, status: 'No-Show', statusLog: appendStatusLog(a, 'No-Show') }
          : a
      );
      return { ...state, appointments };
    }

    case ACTIONS.MARK_PAID: {
      const appointments = state.appointments.map(a =>
        a.id === action.payload ? { ...a, paymentStatus: 'Paid' } : a
      );
      return { ...state, appointments };
    }

    case ACTIONS.SAVE_VITALS: {
      const { appointmentId, vitals, chiefComplaint } = action.payload;
      const appointments = state.appointments.map(a =>
        a.id === appointmentId
          ? { ...a, vitals, chiefComplaint: chiefComplaint || a.chiefComplaint }
          : a
      );
      return { ...state, appointments };
    }

    case ACTIONS.ASSIGN_ROOM: {
      const appointments = state.appointments.map(a =>
        a.id === action.payload.appointmentId
          ? { ...a, assignedRoom: action.payload.room }
          : a
      );
      return { ...state, appointments };
    }

    case ACTIONS.READY_FOR_DOCTOR: {
      const { appointmentId, vitals, chiefComplaint } = action.payload;
      const appointments = state.appointments.map(a =>
        a.id === appointmentId
          ? {
              ...a,
              status: 'With Doctor',
              vitals: vitals || a.vitals,
              chiefComplaint: chiefComplaint || a.chiefComplaint,
              statusLog: appendStatusLog(a, 'With Doctor'),
            }
          : a
      );
      return { ...state, appointments };
    }

    case ACTIONS.DISCHARGE_PATIENT: {
      const { appointmentId, diagnosis, prescription, doctorNotes } = action.payload;
      const appt = state.appointments.find(a => a.id === appointmentId);
      if (!appt) return state;

      const appointments = state.appointments.map(a =>
        a.id === appointmentId
          ? { ...a, status: 'Completed', statusLog: appendStatusLog(a, 'Completed') }
          : a
      );

      const visitEntry = {
        date: new Date().toISOString().split('T')[0],
        chiefComplaint: appt.chiefComplaint || '',
        vitals: appt.vitals || {},
        diagnosis: diagnosis || '',
        prescription: prescription || '',
        doctorNotes: doctorNotes || '',
      };

      const patients = state.patients.map(p => {
        if (p.id !== appt.patientId) return p;
        return {
          ...p,
          lastVisitDate: visitEntry.date,
          visitHistory: [visitEntry, ...p.visitHistory],
        };
      });

      return { ...state, appointments, patients };
    }

    // ── Prescriptions ──
    case ACTIONS.ADD_PRESCRIPTION: {
      const newRx = {
        ...action.payload,
        id: generatePrescriptionId(state.prescriptions),
      };
      return { ...state, prescriptions: [newRx, ...state.prescriptions] };
    }

    // ── Settings ──
    case ACTIONS.UPDATE_SETTINGS: {
      return { ...state, settings: { ...state.settings, ...action.payload } };
    }

    // ── System ──
    case ACTIONS.RESET_DATA: {
      const fresh = resetData();
      return {
        ...state,
        patients: fresh.patients,
        appointments: fresh.appointments,
        prescriptions: fresh.prescriptions,
        settings: fresh.settings,
      };
    }

    default:
      return state;
  }
}

// ─── Provider ────────────────────────────────────────────
export function OperoProvider({ children }) {
  const [state, dispatch] = useReducer(operoReducer, initialState);

  useEffect(() => { persistPatients(state.patients); }, [state.patients]);
  useEffect(() => { persistAppointments(state.appointments); }, [state.appointments]);
  useEffect(() => { persistPrescriptions(state.prescriptions); }, [state.prescriptions]);
  useEffect(() => { persistSettings(state.settings); }, [state.settings]);
  useEffect(() => {
    if (state.auth) persistAuth(state.auth);
    else clearAuth();
  }, [state.auth]);

  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = state.appointments.filter(a => a.date === today);

  const value = {
    ...state,
    todaysAppointments,
    dispatch,
    ACTIONS,
  };

  return (
    <OperoContext.Provider value={value}>
      {children}
    </OperoContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────
export function useOpero() {
  const ctx = useContext(OperoContext);
  if (!ctx) throw new Error('useOpero must be used within <OperoProvider>');
  return ctx;
}

export { ACTIONS };
