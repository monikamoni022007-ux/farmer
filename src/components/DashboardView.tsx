/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Users,
  Grid,
  Sprout,
  Activity,
  AlertTriangle,
  Sun,
  Wind,
  Droplets,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Farmer, Field, Crop, SensorData, SystemLog, Recommendation } from '../types';
import { getMockWeather } from '../utils';

interface DashboardViewProps {
  farmers: Farmer[];
  fields: Field[];
  crops: Crop[];
  sensors: SensorData[];
  logs: SystemLog[];
  recommendations: Recommendation[];
  onNavigate: (view: string) => void;
  onSolveRecommendation: (recId: string) => void;
}

export default function DashboardView({
  farmers,
  fields,
  crops,
  sensors,
  logs,
  recommendations,
  onNavigate,
  onSolveRecommendation,
}: DashboardViewProps) {
  const weather = getMockWeather();
  const unhandledRecommendations = recommendations.filter((r) => !r.actionTaken);
  const totalWateringAlerts = unhandledRecommendations.filter((r) => r.type === 'watering').length;

  // Compute stats:
  const totalFarmers = farmers.length;
  const totalFields = fields.length;
  const totalCrops = crops.length;
  const totalSensors = sensors.length;

  // Retrieve highly critical messages:
  const criticalAlerts = unhandledRecommendations.filter((r) => r.severity === 'critical' || r.severity === 'high');

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 md:text-3xl">Precision Ag Dashboard</h1>
          <p className="mt-1 text-sm font-medium text-gray-500">
            Real-time telemetry diagnostics and automated recommendation engine.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('sensor')}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/15 transition hover:bg-emerald-700"
          >
            <Activity className="h-4 w-4" />
            Launch Live Sensors
          </button>
        </div>
      </div>

      {/* Grid of Key SaaS KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI: Total Farmers */}
        <div
          onClick={() => onNavigate('farmers')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Farmers</span>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 group-hover:bg-blue-100">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">{totalFarmers}</span>
            <span className="text-xs font-semibold text-emerald-600 font-mono">active partners</span>
          </div>
          <p className="mt-2 text-xs font-medium text-gray-400 flex items-center gap-1">
            Manage profile directory <ArrowRight className="h-3 w-3" />
          </p>
        </div>

        {/* KPI: Total Fields */}
        <div
          onClick={() => onNavigate('fields')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Fields</span>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 group-hover:bg-emerald-100">
              <Grid className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">{totalFields}</span>
            <span className="text-xs font-semibold text-emerald-600 font-mono">agricultural domains</span>
          </div>
          <p className="mt-2 text-xs font-medium text-gray-400 flex items-center gap-1">
            Analyze field boundaries <ArrowRight className="h-3 w-3" />
          </p>
        </div>

        {/* KPI: Total Crops */}
        <div
          onClick={() => onNavigate('crops')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Crops</span>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 group-hover:bg-amber-100">
              <Sprout className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">{totalCrops}</span>
            <span className="text-xs font-semibold text-emerald-600 font-mono">active cultivars</span>
          </div>
          <p className="mt-2 text-xs font-medium text-gray-400 flex items-center gap-1">
            Track biological states <ArrowRight className="h-3 w-3" />
          </p>
        </div>

        {/* KPI: Irrigation Alerts */}
        <div
          onClick={() => onNavigate('recommendations')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-red-50 bg-red-50/20 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700">Watering Alarms</span>
            <div className="rounded-xl bg-red-100 p-2.5 text-red-600 group-hover:bg-red-200">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-red-800">{totalWateringAlerts}</span>
            <span className="text-xs font-semibold text-red-600 font-mono">require irrigation</span>
          </div>
          <p className="mt-2 text-xs font-bold text-red-700 flex items-center gap-1">
            Respond to moisture stress <ArrowRight className="h-3 w-3 shrink-0" />
          </p>
        </div>
      </div>

      {/* Main Split Layout: Recommendations, Weather vs Telemetry & Stats */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Left Column (SaaS Alerts & Weather Section) - 7 cols */}
        <div className="space-y-6 lg:col-span-7">
          
          {/* Real-time Weather Information Widget */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-amber-400 animate-spin-slow" />
                <span className="text-sm font-bold text-gray-100">Regional Weather Forecast</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-white/15 px-2 py-0.5 rounded text-amber-300">
                STATION FRS-CAL
              </span>
            </div>

            <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{weather.temp}°C</span>
                  <span className="text-sm text-gray-300">Realfeel 28.5%</span>
                </div>
                <p className="mt-1 text-xs text-gray-300 font-semibold">{weather.condition}</p>
                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-gray-400 font-mono">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                  Salinas Agriscience Valley Zone CA
                </p>
              </div>

              <div className="flex gap-4 border-l border-white/5 pl-4 sm:pl-6">
                <div className="text-center">
                  <Droplets className="mx-auto h-4 w-4 text-sky-400" />
                  <p className="mt-1 text-xs font-extrabold">{weather.humidity}%</p>
                  <p className="text-[9px] text-gray-400">Humidity</p>
                </div>
                <div className="text-center md:border-l border-white/5 md:pl-4">
                  <Wind className="mx-auto h-4 w-4 text-teal-400" />
                  <p className="mt-1 text-xs font-extrabold">{weather.windSpeed} km/h</p>
                  <p className="text-[9px] text-gray-400">Wind</p>
                </div>
                <div className="text-center md:border-l border-white/5 md:pl-4">
                  <span className="block text-xs font-extrabold text-amber-400">UV 7.2</span>
                  <p className="mt-1.5 text-[9px] text-gray-400">UV Severity</p>
                </div>
              </div>
            </div>

            {/* Weather 5-Day Strip */}
            <div className="mt-6 grid grid-cols-5 gap-2 border-t border-white/10 pt-4">
              {weather.forecast.map((fc, idx) => (
                <div key={idx} className="rounded-xl bg-white/5 p-2 text-center transition hover:bg-white/10">
                  <p className="text-[10px] font-bold text-gray-300">{fc.day}</p>
                  {/* Forecast simplified render */}
                  <span className="mx-auto my-1 block text-xs font-black text-gray-100">{fc.temp}°C</span>
                  <p className="text-[8px] text-gray-400 truncate">{fc.condition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Recommendations Summary section */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-gray-900">Immediate AI/Rule Recommendations</h3>
              </div>
              <button
                onClick={() => onNavigate('recommendations')}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Inspect All ({unhandledRecommendations.length})
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {unhandledRecommendations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
                  <CheckCircle className="h-10 w-10 text-emerald-500 mb-2 stroke-[1.5]" />
                  <p className="text-xs font-bold text-gray-800">No Action Required Currently</p>
                  <p className="text-[11px] text-gray-400 max-w-xs">All soil moisture, heat loads, and pH statistics are stable.</p>
                </div>
              ) : (
                unhandledRecommendations.slice(0, 3).map((rec) => (
                  <div
                    key={rec.id}
                    className="flex flex-col justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                            rec.severity === 'critical'
                              ? 'bg-red-100 text-red-700'
                              : rec.severity === 'high'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {rec.severity}
                        </span>
                        <span className="text-xs font-mono text-gray-400">Field: {rec.fieldName}</span>
                      </div>
                      <p className="mt-1.5 text-xs font-extrabold text-gray-900">{rec.title}</p>
                      <p className="mt-0.5 text-[11px] text-gray-500">{rec.description}</p>
                    </div>

                    <button
                      onClick={() => onSolveRecommendation(rec.id)}
                      className="shrink-0 rounded-lg bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      Trigger Safe Solution
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Recent Activities & Overview Telemetry) - 5 cols */}
        <div className="space-y-6 lg:col-span-5">
          
          {/* Database & Telemetry Health Status Panel */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-55/30 pb-3">DBMS Table Metrics</h3>
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="font-semibold text-gray-500">Farmers Registry Table</span>
                <span className="font-mono font-bold text-gray-900">{farmers.length} records</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="font-semibold text-gray-500">Field Topology Table</span>
                <span className="font-mono font-bold text-gray-900">{fields.length} parcels</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="font-semibold text-gray-500">Cultivar (Crops) Table</span>
                <span className="font-mono font-bold text-gray-900">{crops.length} species</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="font-semibold text-gray-500">Sensor Telemetry Table</span>
                <span className="font-mono font-bold text-gray-900">{sensors.length} inputs log</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-semibold text-gray-500">Database Driver Engine</span>
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  MySQL Mock/Local v8.0
                </span>
              </div>
            </div>
          </div>

          {/* System Audit & Recent Logs Stream */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <h3 className="text-sm font-bold text-gray-900">Recent Action Log Stream</h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[9px] font-mono text-gray-500">
                Live Console
              </span>
            </div>

            <div className="mt-4 space-y-3.5 max-h-64 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 text-xs">
                  <div className="mt-0.5 shrink-0">{getLogIcon(log.type)}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{log.message}</p>
                    <span className="mt-0.5 block text-[10px] font-semibold text-gray-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
