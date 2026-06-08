/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Shield, RefreshCw, Save, UserCheck, AlertTriangle, CheckSquare } from 'lucide-react';
import { ThresholdSettings, User } from '../types';

interface SettingsViewProps {
  thresholds: ThresholdSettings;
  onUpdateThresholds: (settings: ThresholdSettings) => void;
  currentUser: User;
  onUpdateUserProfile: (user: Partial<User>) => void;
  onResetDatabase: () => void;
}

export default function SettingsView({
  thresholds,
  onUpdateThresholds,
  currentUser,
  onUpdateUserProfile,
  onResetDatabase,
}: SettingsViewProps) {
  // Threshold values local states
  const [minMoisture, setMinMoisture] = useState(thresholds.minSoilMoisture);
  const [minPH, setMinPH] = useState(thresholds.minSoilPH);
  const [maxPH, setMaxPH] = useState(thresholds.maxSoilPH);
  const [maxTemp, setMaxTemp] = useState(thresholds.maxTemperature);

  // Profile local states
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);

  const [notifMsg, setNotifMsg] = useState<string | null>(null);

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateThresholds({
      minSoilMoisture: minMoisture,
      minSoilPH: minPH,
      maxSoilPH: maxPH,
      maxTemperature: maxTemp,
    });
    triggerFeedback('Precision thresholds updated and alarm bounds recalculated!');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUserProfile({
      name: profileName,
      email: profileEmail,
    });
    triggerFeedback('Administrator profile updated successfully!');
  };

  const triggerFeedback = (msg: string) => {
    setNotifMsg(msg);
    setTimeout(() => {
      setNotifMsg(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900">System Preferences</h1>
        <p className="text-xs text-gray-500 font-medium mt-1">
          Administer alarm triggers, synchronize local buffer nodes, and manage operator authorization.
        </p>
      </div>

      {notifMsg && (
        <div className="rounded-xl border border-emerald-500/10 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckSquare className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
          <span>{notifMsg}</span>
        </div>
      )}

      {/* Grid of Settings Modules */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Module 1: Agricultural Decision Threshold Parameters */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600">
              <Settings className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
              Rule Engine Alarm Thresholds
            </h3>
          </div>

          <form onSubmit={handleSaveThresholds} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-gray-500 mb-1.5">
                Minimum Allowed Soil Moisture (%) — Trigger Watering
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={minMoisture}
                  onChange={(e) => setMinMoisture(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg bg-gray-100 appearance-none cursor-pointer accent-emerald-600"
                />
                <span className="font-mono bg-emerald-50 px-2 py-0.5 rounded text-emerald-800 font-extrabold w-12 text-center">
                  {minMoisture}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 mb-1.5">Min Safe Soil pH</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="14"
                  value={minPH}
                  onChange={(e) => setMinPH(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-semibold focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-500 mb-1.5">Max Safe Soil pH</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="14"
                  value={maxPH}
                  onChange={(e) => setMaxPH(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-semibold focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 mb-1.5">
                Maximum Safe Ambient Canopy Temp (°C) — Heat Alert
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="25"
                  max="45"
                  value={maxTemp}
                  onChange={(e) => setMaxTemp(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg bg-gray-100 appearance-none cursor-pointer accent-emerald-600"
                />
                <span className="font-mono bg-emerald-50 px-2 py-0.5 rounded text-emerald-800 font-extrabold w-12 text-center font-mono">
                  {maxTemp}°C
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4.5 py-2.5 font-bold text-white transition hover:bg-emerald-700"
              >
                <Save className="h-4 w-4" />
                Apply Rule Variables
              </button>
            </div>
          </form>
        </div>

        {/* Module 2: Profile Settings */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
              <UserCheck className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
              Operator Digital Identity File
            </h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-gray-500 mb-1.5">User Full Name</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-500 mb-1.5">Contact Email Address</label>
              <input
                type="email"
                required
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:border-emerald-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4.5 py-2.5 font-bold text-white transition hover:bg-emerald-700"
              >
                <Save className="h-4 w-4" />
                Commit Digital Identity
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Database Maintenance and Reset Controls */}
      <div className="rounded-2xl border border-amber-100 bg-amber-50/20 p-5 shadow-sm space-y-4 md:max-w-2xl">
        <div className="flex items-center gap-2 border-b border-amber-900/10 pb-3 text-amber-850">
          <AlertTriangle className="h-4.5 w-4.5 text-amber-700" />
          <h3 className="text-xs font-extrabold uppercase tracking-wide">DBMS Administrative Actions</h3>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800">Clear Cache Buffer & Seed Database</p>
            <p className="text-[11px] text-gray-400 font-medium max-w-md mt-0.5">
              Permanently overrides your browser's local state and seeds the MySQL relational database cache with prefilled, operational farmers, crop timelines, and telemetries.
            </p>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Do you want to restore the data back to seeds? Action will clear current registrations.')) {
                onResetDatabase();
              }
            }}
            className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-red-250 bg-white hover:bg-red-50 text-red-650 px-4 py-2.5 text-xs font-bold transition"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Seeds Database
          </button>
        </div>
      </div>
    </div>
  );
}
