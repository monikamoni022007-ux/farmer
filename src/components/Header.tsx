/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, Sun, User, LogOut, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { Recommendation, User as UserType } from '../types';

interface HeaderProps {
  currentUser: UserType;
  onLogout: () => void;
  recommendations: Recommendation[];
  activeView: string;
  onNavigate: (view: string) => void;
}

export default function Header({
  currentUser,
  onLogout,
  recommendations,
  activeView,
  onNavigate,
}: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Active alerts that represent recommendations remaining un-dismissed
  const activeAlerts = recommendations.filter((r) => !r.actionTaken);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500 bg-red-50';
      case 'high':
        return 'text-amber-500 bg-amber-50';
      case 'medium':
        return 'text-blue-500 bg-blue-50';
      default:
        return 'text-green-500 bg-green-50';
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white/80 px-6 backdrop-blur-md">
      {/* Search Input / View Context Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          <Activity className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Farmsense Cloud Live Terminal</span>
        </div>
        <span className="text-sm font-medium text-gray-400">/</span>
        <span className="text-sm font-medium text-gray-700 capitalize">
          {activeView === 'dashboard' ? 'Overview' : activeView}
        </span>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* Real-time Status */}
        <div className="hidden items-center gap-2 text-xs text-gray-500 md:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="font-mono">Telemetry Synchronized (2026-06-08)</span>
        </div>

        {/* Dynamic Alerts Notification Bell */}
        <div className="relative">
          <button
            id="notification_bell_btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <Bell className="h-5 w-5" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5">
              <div className="flex items-center justify-between border-b border-gray-50 px-4 py-3">
                <span className="text-sm font-semibold text-gray-900">System Alerts</span>
                <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700">
                  {activeAlerts.length} Active
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {activeAlerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <CheckCircle className="h-8 w-8 text-emerald-400 stroke-[1.5] mb-2" />
                    <p className="text-xs font-semibold text-gray-800">All Systems Normal</p>
                    <p className="text-[11px] text-gray-400">Soil moisture and temperature within nominal bounds.</p>
                  </div>
                ) : (
                  activeAlerts.slice(0, 5).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate('recommendations');
                        setShowNotifications(false);
                      }}
                      className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
                    >
                      <div className={`mt-0.5 rounded p-1 ${getSeverityColor(item.severity)}`}>
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-900 line-clamp-1">{item.title}</p>
                        <p className="mt-0.5 text-[11px] text-gray-500 line-clamp-2">{item.description}</p>
                        <p className="mt-1 text-[10px] font-medium text-emerald-600 font-mono">
                          Field: {item.fieldName}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <div className="border-t border-gray-55/40 p-2">
                <button
                  onClick={() => {
                    onNavigate('recommendations');
                    setShowNotifications(false);
                  }}
                  className="block w-full rounded-lg bg-gray-50 py-2 text-center text-xs font-semibold text-gray-700 hover:bg-gray-100"
                >
                  View All Recommendations
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Trigger */}
        <div className="relative">
          <button
            id="profile_avatar_btn"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-full border border-gray-200 p-1 pr-3 hover:bg-gray-50 focus:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-bold text-gray-900 leading-3">{currentUser.name}</p>
              <span className="text-[10px] font-medium text-gray-400 capitalize">{currentUser.role}</span>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-gray-150 bg-white p-1 shadow-xl">
              <div className="border-b border-gray-50 px-3 py-2 text-[11px] font-medium text-gray-400">
                Logged in as <span className="font-semibold text-gray-700">{currentUser.email}</span>
              </div>
              <button
                onClick={() => {
                  onNavigate('settings');
                  setShowProfileMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <User className="h-4 w-4 stroke-[2]" />
                User Account Profile
              </button>
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-600 transition hover:bg-red-50/50"
              >
                <LogOut className="h-4 w-4 stroke-[2]" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
