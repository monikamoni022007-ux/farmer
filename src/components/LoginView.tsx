/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, Mail, Lock, Shield, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (email: string, name: string) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [emailInput, setEmailInput] = useState('operator@farmsense.com');
  const [passwordInput, setPasswordInput] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // States
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'login' | 'forgot'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg('Please specify an email address.');
      return;
    }
    if (passwordInput.length < 5) {
      setErrorMsg('Incorrect Password. Please input at least 5 character credentials.');
      return;
    }
    // Success: Login trigger
    onLoginSuccess(emailInput, 'James Operator');
  };

  const handleBypass = () => {
    onLoginSuccess('operator@farmsense.com', 'David Vance (Guest)');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSuccess(true);
    setTimeout(() => {
      setStep('login');
      setResetSuccess(false);
      setResetEmail('');
    }, 4000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-radial from-emerald-900 to-slate-950 p-4">
      {/* Visual glowing elements */}
      <div className="absolute top-[20%] left-[20%] h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]" />
      <div className="absolute bottom-[20%] right-[20%] h-64 w-64 rounded-full bg-teal-500/10 blur-[80px]" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl md:p-8">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20">
            <Compass className="h-6 w-6 text-emerald-950 stroke-[2.5]" />
          </div>
          <h2 className="mt-4 text-xl font-black tracking-wider text-slate-950">FARMSENSE</h2>
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 font-mono mt-0.5">
            Precision Ag DBMS Service
          </span>
        </div>

        {step === 'login' ? (
          <div className="mt-6 space-y-5">
            <div className="text-center">
              <p className="text-sm font-bold text-gray-800">Identify Operator Profile</p>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                Sign in to sync sensor relays and review crops schedules.
              </p>
            </div>

            {errorMsg && (
              <div className="rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs font-bold text-gray-600">
              <div>
                <label className="block mb-1.5 uppercase font-extrabold tracking-wide text-[9px] text-gray-400">
                  Relay Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setErrorMsg(null);
                    }}
                    placeholder="operator@farmsense.com"
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="uppercase font-extrabold tracking-wide text-[9px] text-gray-400">
                    Access Pass Credentials
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('forgot')}
                    className="text-[10px] text-emerald-600 hover:underline font-bold"
                  >
                    Forgot Password Code?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setErrorMsg(null);
                    }}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-11 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-400 hover:text-gray-800"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-extrabold text-white transition hover:bg-emerald-700 shadow-lg shadow-emerald-600/10"
                >
                  Confirm Authentication
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-100" />
              <span className="flex-shrink mx-4 text-[9px] text-gray-400 uppercase tracking-wider font-extrabold">
                Developer Fast Bypass
              </span>
              <div className="flex-grow border-t border-gray-100" />
            </div>

            <button
              onClick={handleBypass}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 text-xs font-bold transition"
            >
              <Shield className="h-4 w-4 text-emerald-600" />
              Bypass Password (Demo Sandbox Mode)
            </button>
          </div>
        ) : (
          /* Forgot Password form screen */
          <div className="mt-6 space-y-4 text-xs font-semibold">
            <div className="text-center">
              <h3 className="text-sm font-bold text-gray-800">Password Recovery Routine</h3>
              <p className="text-[11px] text-gray-400 font-medium max-w-xs mx-auto mt-0.5">
                We will simulate sending a password reset verification link to access your database credentials.
              </p>
            </div>

            {resetSuccess && (
              <div className="rounded-xl border border-emerald-500/10 bg-emerald-50 p-4 text-[11px] font-bold text-emerald-800">
                Reset instructions have been sent! Redirecting back to Operator login...
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-500 mb-1.5">Registered Operator Email</label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="e.g. user@farmsense.com"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 font-bold text-gray-500"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 text-white px-5 py-2.5 font-black transition hover:bg-emerald-700"
                >
                  Send Recovery Link
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
