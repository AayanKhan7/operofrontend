// ═══════════════════════════════════════════════════════════
// PrescriptionsListView — Searchable table of all prescriptions
// Read-only — prescriptions created from Doctor dashboard
// ═══════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { useOpero } from '../../context/OperoContext';
import PulseDivider from '../shared/PulseDivider';
import { Search, FileText, Pill, ExternalLink } from 'lucide-react';

export default function PrescriptionsListView({ onNavigateToPatient }) {
  const { prescriptions, patients } = useOpero();
  const [search, setSearch] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  // Unique doctors
  const doctors = useMemo(() => {
    const set = new Set(prescriptions.map(rx => rx.prescribingDoctor));
    return ['All', ...Array.from(set)];
  }, [prescriptions]);

  const filtered = useMemo(() => {
    return prescriptions.filter(rx => {
      const matchSearch =
        search === '' ||
        rx.patientName.toLowerCase().includes(search.toLowerCase()) ||
        rx.medications.some(m => m.drugName.toLowerCase().includes(search.toLowerCase()));
      const matchDoctor = doctorFilter === 'All' || rx.prescribingDoctor === doctorFilter;
      return matchSearch && matchDoctor;
    });
  }, [prescriptions, search, doctorFilter]);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-serif font-semibold text-2xl text-navy">Prescriptions</h1>
          <p className="text-sm text-navy/50 font-sans mt-[2px]">
            <span className="font-mono font-medium text-navy">{prescriptions.length}</span> total prescriptions
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card p-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
            <input
              type="text"
              className="input pl-8"
              placeholder="Search by patient name or drug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1">
            {doctors.map(d => (
              <button
                key={d}
                className={`btn btn-xs ${doctorFilter === d ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setDoctorFilter(d)}
              >
                {d === 'All' ? 'All Doctors' : d.replace('Dr. ', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prescriptions table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-rule bg-paper/50">
              <th className="text-left py-2 px-4 text-xs font-sans font-semibold uppercase tracking-wider text-navy/50">Date</th>
              <th className="text-left py-2 px-4 text-xs font-sans font-semibold uppercase tracking-wider text-navy/50">Patient</th>
              <th className="text-left py-2 px-4 text-xs font-sans font-semibold uppercase tracking-wider text-navy/50">Medication(s)</th>
              <th className="text-left py-2 px-4 text-xs font-sans font-semibold uppercase tracking-wider text-navy/50">Doctor</th>
              <th className="w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-sm text-navy/40">
                  No prescriptions found.
                </td>
              </tr>
            ) : (
              filtered.map(rx => (
                <React.Fragment key={rx.id}>
                  <tr
                    className="border-b border-rule last:border-b-0 hover:bg-paper/50 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(expandedId === rx.id ? null : rx.id)}
                  >
                    <td className="py-2 px-4 font-mono text-sm text-navy/60 whitespace-nowrap">{rx.date}</td>
                    <td className="py-2 px-4">
                      <span className="font-sans font-medium text-sm text-navy">{rx.patientName}</span>
                      <span className="font-mono text-xs text-navy/30 ml-2">{rx.patientId}</span>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex flex-wrap gap-1">
                        {rx.medications.map((m, i) => (
                          <span key={i} className="inline-flex items-center gap-1 font-mono text-xs bg-paper px-2 py-[2px] rounded border border-rule">
                            <Pill size={10} className="text-deep-blue" />
                            {m.drugName} {m.dosage}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-4 font-sans text-sm text-navy/60">{rx.prescribingDoctor}</td>
                    <td className="py-2 px-4">
                      <ExternalLink size={13} className="text-navy/20" />
                    </td>
                  </tr>
                  {/* Expanded detail */}
                  {expandedId === rx.id && (
                    <tr>
                      <td colSpan={5} className="px-4 py-3 bg-paper/80 border-b border-rule">
                        <div className="space-y-2">
                          {rx.medications.map((m, i) => (
                            <div key={i} className="flex items-start gap-6">
                              <div>
                                <span className="label">Drug</span>
                                <div className="font-mono text-sm">{m.drugName}</div>
                              </div>
                              <div>
                                <span className="label">Dosage</span>
                                <div className="font-mono text-sm">{m.dosage}</div>
                              </div>
                              <div className="flex-1">
                                <span className="label">Instructions</span>
                                <div className="font-sans text-sm text-navy/70">{m.instructions}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
