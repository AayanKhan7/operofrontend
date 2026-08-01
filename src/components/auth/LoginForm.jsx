// ═══════════════════════════════════════════════════════════
// LoginForm — Opero Brand Login
// Full-bleed gradient background, rounded card, Poppins typography
// ═══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useOpero } from '../../context/OperoContext';
import { authenticateUser } from '../../services/mockApi';
import { ArrowRight, AlertCircle } from 'lucide-react';

const ROLE_ROUTES = {
  Receptionist: '/receptionist',
  Nurse: '/nurse',
  Doctor: '/doctor',
};

// Two-tone blue flag/arrow icon mimicking the Opero logo mark
function OperoLogoMark({ className }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M14 0L28 14L14 28V0Z" fill="var(--deep-blue)"/>
      <path d="M0 14L14 0V28L0 14Z" fill="var(--sky)"/>
    </svg>
  );
}

export default function LoginForm() {
  const navigate = useNavigate();
  const { dispatch, ACTIONS } = useOpero();
  const [loginError, setLoginError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = (data) => {
    setLoginError('');
    const user = authenticateUser(data.email, data.password);
    if (!user) {
      setLoginError('Invalid email or password. Please try again.');
      return;
    }
    dispatch({ type: ACTIONS.LOGIN, payload: user });
    navigate(ROLE_ROUTES[user.role] || '/receptionist');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-periwinkle to-deep-blue flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        {/* Login card */}
        <div className="bg-panel rounded-[20px] shadow-2xl p-8">
          
          {/* Wordmark */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <OperoLogoMark />
              <h1 className="font-serif font-bold text-[32px] text-ink-black tracking-tight leading-none lowercase">
                opero
              </h1>
            </div>
            <p className="font-sans text-sm text-navy/60 font-medium">
              Every patient, tracked in real time.
            </p>
          </div>

          {/* Error */}
          {loginError && (
            <div className="flex items-start gap-2 bg-rust/10 border border-rust/20 rounded-md px-3 py-2 mb-5">
              <AlertCircle size={15} className="text-rust flex-shrink-0 mt-[2px]" />
              <span className="font-sans text-sm text-rust font-medium">{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label text-navy/70">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="doctor@opero.clinic"
                autoFocus
                autoComplete="email"
              />
              {errors.email && <div className="field-error">{errors.email.message}</div>}
            </div>

            <div>
              <label className="label text-navy/70">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className={`input ${errors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && <div className="field-error">{errors.password.message}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full py-3 text-base rounded-[10px] mt-2"
              disabled={isSubmitting}
            >
              Sign In
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-6 bg-panel/10 backdrop-blur-sm rounded-[16px] p-5 text-white shadow-sm border border-white/20">
          <div className="text-xs font-sans font-semibold text-white/80 uppercase tracking-wider mb-3">
            Demo Credentials
          </div>
          <div className="space-y-2">
            {[
              { role: 'Doctor', email: 'doctor@opero.clinic', pw: 'doctor123' },
              { role: 'Receptionist', email: 'reception@opero.clinic', pw: 'reception123' },
              { role: 'Nurse', email: 'nurse@opero.clinic', pw: 'nurse123' },
            ].map(c => (
              <div key={c.role} className="flex items-center justify-between text-sm">
                <span className="font-sans font-medium text-white/90">{c.role}</span>
                <span className="font-mono text-white/80">{c.email} / {c.pw}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center font-mono text-xs text-white/40 mt-8">
          v3.0 · Brand Restyle
        </p>
      </div>
    </div>
  );
}
