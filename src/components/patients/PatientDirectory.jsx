// ═══════════════════════════════════════════════════════════
// Patient Directory — Searchable table of all patients (v3 Brand Restyle)
// ═══════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { useOpero } from '../../context/OperoContext';
import StatusBadge from '../shared/StatusBadge';
import PatientProfile from './PatientProfile';
import PatientRecordForm from './PatientRecordForm';
import {
  Search,
  UserPlus,
  X,
  ChevronRight,
} from 'lucide-react';

export default function PatientDirectory() {
  const { patients } = useOpero();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchesSearch =
        searchTerm === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm);
      const matchesStatus =
        statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [patients, searchTerm, statusFilter]);

  if (selectedPatientId) {
    return (
      <PatientProfile
        patientId={selectedPatientId}
        onBack={() => setSelectedPatientId(null)}
      />
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-serif font-semibold text-2xl text-navy">Patients</h1>
          <p className="text-sm text-navy/50 font-sans mt-[2px]">
            <span className="font-mono font-medium text-navy">{patients.length}</span> registered patients
          </p>
        </div>
        <button
          className={`btn ${showAddForm ? 'btn-primary' : 'btn-secondary'} rounded-lg`}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? <><X size={16} /> Close</> : <><UserPlus size={16} /> Add Patient</>}
        </button>
      </div>

      {/* Add Patient Form */}
      {showAddForm && (
        <div className="card p-5 mb-5 border-none shadow-card">
          <h2 className="font-sans font-semibold text-lg text-navy mb-4">New Patient Registration</h2>
          <PatientRecordForm onComplete={() => setShowAddForm(false)} />
        </div>
      )}

      {/* Search & Filter */}
      <div className="card p-5 mb-5 border-none shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" />
            <input
              type="text"
              className="input pl-11 py-2.5 bg-paper/50 rounded-xl"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5 bg-paper p-1 rounded-lg">
            {['All', 'Active', 'Inactive'].map(s => (
              <button
                key={s}
                className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors ${statusFilter === s ? 'bg-panel text-navy shadow-sm' : 'text-navy/50 hover:text-navy hover:bg-panel/50'}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="card overflow-hidden border-none shadow-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-rule/50 bg-paper/30">
              <th className="text-left py-3 px-5 text-[11px] font-sans font-semibold uppercase tracking-wider text-navy/50">Name</th>
              <th className="text-left py-3 px-5 text-[11px] font-sans font-semibold uppercase tracking-wider text-navy/50">Age</th>
              <th className="text-left py-3 px-5 text-[11px] font-sans font-semibold uppercase tracking-wider text-navy/50">Gender</th>
              <th className="text-left py-3 px-5 text-[11px] font-sans font-semibold uppercase tracking-wider text-navy/50">Phone</th>
              <th className="text-left py-3 px-5 text-[11px] font-sans font-semibold uppercase tracking-wider text-navy/50">Last Visit</th>
              <th className="text-left py-3 px-5 text-[11px] font-sans font-semibold uppercase tracking-wider text-navy/50">Status</th>
              <th className="w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-[15px] text-navy/40">
                  No patients found.
                </td>
              </tr>
            ) : (
              filteredPatients.map(p => (
                <tr
                  key={p.id}
                  className="border-b border-rule/50 last:border-b-0 hover:bg-paper/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedPatientId(p.id)}
                >
                  <td className="py-3 px-5">
                    <span className="font-sans font-medium text-[15px] text-navy">{p.name}</span>
                    <span className="font-mono text-[11px] bg-paper px-1.5 py-0.5 rounded-md border border-rule/50 text-navy/40 ml-3">{p.id}</span>
                  </td>
                  <td className="py-3 px-5 font-mono text-[14px] text-navy/70 text-right">{p.age}</td>
                  <td className="py-3 px-5 font-sans text-[14px] text-navy/70">{p.gender}</td>
                  <td className="py-3 px-5 font-mono text-[14px] text-navy/70">{p.phone}</td>
                  <td className="py-3 px-5 font-mono text-[14px] text-navy/50">{p.lastVisitDate || '—'}</td>
                  <td className="py-3 px-5">
                    <StatusBadge status={p.status} size="xs" />
                  </td>
                  <td className="py-3 px-5">
                    <ChevronRight size={16} className="text-navy/20" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
