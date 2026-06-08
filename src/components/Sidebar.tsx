/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Layers,
  Sprout,
  Activity,
  Lightbulb,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Compass
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeView, onNavigate, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'farmers', name: 'Farmers List', icon: Users },
    { id: 'fields', name: 'Field Management', icon: Layers },
    { id: 'crops', name: 'Crop Tracking', icon: Sprout },
    { id: 'sensor', name: 'Sensor Monitoring', icon: Activity },
    { id: 'recommendations', name: 'Actionable Rules', icon: Lightbulb },
    { id: 'reports', name: 'Data Reports', icon: FileText },
    { id: 'settings', name: 'Threshold Adjust', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex h-screen flex-col border-r border-emerald-900/15 bg-emerald-950 text-emerald-100 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-2.5 px-6 border-b border-emerald-900/30">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md shadow-emerald-450/20">
          <Compass className="h-5 w-5 text-emerald-950 stroke-[2.5]" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-wider text-white">FARMSENSE</span>
            <span className="text-[9px] font-bold text-emerald-400/80 uppercase">Precision Ag DBMS</span>
          </div>
        )}
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-3 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group flex w-full items-center gap-3.5 rounded-xl px-3.5 py-3 text-xs font-bold transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                  : 'text-emerald-300/80 hover:bg-emerald-900/40 hover:text-white'
              }`}
            >
              <Icon
                className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-slate-950 stroke-[2.5]' : 'text-emerald-400/70'
                }`}
              />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapsed Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-20 right-[-14px] flex h-7 w-7 items-center justify-center rounded-full border border-emerald-800 bg-emerald-900 text-emerald-300 hover:bg-emerald-800 hover:text-white"
        title={isCollapsed ? 'Expand menu' : 'Collapse menu'}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Bottom Footer block representing user profile quickly */}
      <div className="border-t border-emerald-900/30 p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3.5 rounded-xl px-3.5 py-3 text-xs font-bold text-red-300 transition hover:bg-red-950/40 hover:text-red-200"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0 text-red-400" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
