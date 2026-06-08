/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Activity, Plus, Search, Thermometer, Droplets, Percent, Flame, Layers, PlusCircle, Check, X } from 'lucide-react';
import { SensorData, Field, ThresholdSettings } from '../types';

interface SensorViewProps {
  sensors: SensorData[];
  fields: Field[];
  thresholds: ThresholdSettings;
  onAddSensorRecord: (record: Omit<SensorData, 'id' | 'dateTime'>) => void;
}

export default function SensorView({
  sensors,
  fields,
  thresholds,
  onAddSensorRecord,
}: SensorViewProps) {
  const [selectedFieldId, setSelectedFieldId] = useState<string>(fields[0]?.id || '');
  const [showAddLogModal, setShowAddLogModal] = useState(false);

  // Form states for manual telemetry recording
  const [tempInput, setTempInput] = useState<number>(27);
  const [humidityInput, setHumidityInput] = useState<number>(60);
  const [moistureInput, setMoistureInput] = useState<number>(35);
  const [phInput, setPhInput] = useState<number>(6.5);

  const getFieldName = (fieldId: string) => {
    const f = fields.find((item) => item.id === fieldId);
    return f ? f.name : 'Unknown Field';
  };

  // Filter sensor readings for the selected field, sorted by newest
  const activeReadings = sensors
    .filter((s) => s.fieldId === selectedFieldId)
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  const currentStatus = activeReadings[0] || null;

  const submitLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFieldId) return;
    onAddSensorRecord({
      fieldId: selectedFieldId,
      temperature: tempInput,
      humidity: humidityInput,
      soilMoisture: moistureInput,
      soilPH: phInput,
    });
    setShowAddLogModal(false);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Live Telemetry Terminal</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Realtime IoT soil hygrometer feeds, thermometric metrics, pH sensor nodes, and manual logging diaries.
          </p>
        </div>
        <button
          id="log_sensor_btn"
          onClick={() => {
            setShowAddLogModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          Log Manual Telementry
        </button>
      </div>

      {/* Select Field Hub Selector */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Select Monitored Field Parcel
        </label>
        <div className="flex flex-wrap gap-2">
          {fields.map((field) => (
            <button
              key={field.id}
              onClick={() => setSelectedFieldId(field.id)}
              className={`rounded-xl border px-4 py-2 text-xs font-bold transition-all duration-150 ${
                selectedFieldId === field.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-55/40'
              }`}
            >
              {field.name}
              <span
                className={`ml-2 rounded px-1 text-[9px] font-mono font-black ${
                  selectedFieldId === field.id ? 'bg-emerald-55/20 text-white' : 'bg-gray-100 text-gray-550'
                }`}
              >
                {field.id}
              </span>
            </button>
          ))}
        </div>
      </div>

      {currentStatus ? (
        <div className="space-y-6">
          {/* Main 4 Environmental Metric Gauges */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* TEMPERATURE METRIC */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">AMB. Temperature</span>
                <div
                  className={`rounded-xl p-2.5 ${
                    currentStatus.temperature > thresholds.maxTemperature
                      ? 'bg-red-50 text-red-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  <Thermometer className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4">
                <span className="text-3xl font-black text-gray-900">{currentStatus.temperature}°C</span>
                <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
                  <span>MAX TOLERANCE:</span>
                  <span>{thresholds.maxTemperature}°C</span>
                </div>
                {/* Visual Progress Bar */}
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      currentStatus.temperature > thresholds.maxTemperature ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min((currentStatus.temperature / 50) * 100, 100)}%` }}
                  />
                </div>
                <div className="mt-2 text-[10px] font-bold">
                  {currentStatus.temperature > thresholds.maxTemperature ? (
                    <span className="text-red-600 animate-pulse">● OVERHEAT WARNING ACTIVATED</span>
                  ) : (
                    <span className="text-emerald-600">● STABLE OPERATING TEMPERATURE</span>
                  )}
                </div>
              </div>
            </div>

            {/* RELATIVE HUMIDITY METRIC */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">Air Humidity</span>
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                  <Droplets className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4">
                <span className="text-3xl font-black text-gray-900">{currentStatus.humidity}%</span>
                <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
                  <span>Target Range:</span>
                  <span>40% - 80%</span>
                </div>
                {/* Visual Progress Bar */}
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${currentStatus.humidity}%` }}
                  />
                </div>
                <div className="mt-2 text-[10px] font-bold text-emerald-600">
                  <span>● REASONABLE AIR SATURATION</span>
                </div>
              </div>
            </div>

            {/* SOIL MOISTURE METRIC */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">Soil Moisture</span>
                <div
                  className={`rounded-xl p-2.5 ${
                    currentStatus.soilMoisture < thresholds.minSoilMoisture
                      ? 'bg-red-100 text-red-600 animate-pulse'
                      : 'bg-teal-50 text-teal-600'
                  }`}
                >
                  <Percent className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4">
                <span className="text-3xl font-black text-gray-900">{currentStatus.soilMoisture}%</span>
                <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
                  <span>CRITICAL ALARM:</span>
                  <span>&lt; {thresholds.minSoilMoisture}%</span>
                </div>
                {/* Visual Progress Bar */}
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      currentStatus.soilMoisture < thresholds.minSoilMoisture ? 'bg-red-500' : 'bg-teal-500'
                    }`}
                    style={{ width: `${currentStatus.soilMoisture}%` }}
                  />
                </div>
                <div className="mt-2 text-[10px] font-bold">
                  {currentStatus.soilMoisture < thresholds.minSoilMoisture ? (
                    <span className="text-red-600 font-extrabold animate-pulse">● CRITICAL DEHYDRATION - IRRIGATE</span>
                  ) : (
                    <span className="text-emerald-600">● SATISFACTORY SOIL MOISTURE</span>
                  )}
                </div>
              </div>
            </div>

            {/* SOIL PH LEVEL METRIC */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">Soil pH Index</span>
                <div
                  className={`rounded-xl p-2.5 ${
                    currentStatus.soilPH < thresholds.minSoilPH || currentStatus.soilPH > thresholds.maxSoilPH
                      ? 'bg-yellow-50 text-yellow-600'
                      : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  <Flame className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4">
                <span className="text-3xl font-black text-gray-900">{currentStatus.soilPH}</span>
                <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
                  <span>SAFE BOUNDS:</span>
                  <span>
                    {thresholds.minSoilPH} - {thresholds.maxSoilPH}
                  </span>
                </div>
                {/* PH Bar representation (0-14 pH scale) */}
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      currentStatus.soilPH < thresholds.minSoilPH
                        ? 'bg-red-400'
                        : currentStatus.soilPH > thresholds.maxSoilPH
                        ? 'bg-purple-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(currentStatus.soilPH / 14) * 100}%` }}
                  />
                </div>
                <div className="mt-2 text-[10px] font-bold">
                  {currentStatus.soilPH < thresholds.minSoilPH ? (
                    <span className="text-red-500">● ACIDIC CONDITION (Requires Lime)</span>
                  ) : currentStatus.soilPH > thresholds.maxSoilPH ? (
                    <span className="text-purple-600">● ALKALINE CONDITION (Requires Sulfur)</span>
                  ) : (
                    <span className="text-emerald-600">● OPTIMAL pH BALANCED NOMINAL</span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Historical Logs Listing for selected Field */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3">
              Historian Database Stream • {getFieldName(selectedFieldId)}
            </h3>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left font-semibold">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    <th className="py-2.5">Date & Time logged</th>
                    <th className="py-2.5">Temperature</th>
                    <th className="py-2.5">Humidity</th>
                    <th className="py-2.5">Soil Moisture</th>
                    <th className="py-2.5">Soil pH</th>
                    <th className="py-2.5 text-right">Alert state</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                  {activeReadings.map((reading) => {
                    const isMoistureAlert = reading.soilMoisture < thresholds.minSoilMoisture;
                    const isTempAlert = reading.temperature > thresholds.maxTemperature;
                    const isPhAlert = reading.soilPH < thresholds.minSoilPH || reading.soilPH > thresholds.maxSoilPH;

                    return (
                      <tr key={reading.id} className="hover:bg-gray-55/20 transition">
                        <td className="py-3 font-mono font-bold text-gray-500">
                          {new Date(reading.dateTime).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className={`py-3 font-mono ${isTempAlert ? 'text-red-650 font-black' : ''}`}>
                          {reading.temperature}°C
                        </td>
                        <td className="py-3 font-mono">{reading.humidity}%</td>
                        <td className={`py-3 font-mono ${isMoistureAlert ? 'text-red-650 font-black' : ''}`}>
                          {reading.soilMoisture}%
                        </td>
                        <td className={`py-3 font-mono ${isPhAlert ? 'text-purple-650 font-black' : ''}`}>
                          {reading.soilPH}
                        </td>
                        <td className="py-3 text-right">
                          {isMoistureAlert || isTempAlert || isPhAlert ? (
                            <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-extrabold text-rose-700">
                              TRIGGERED ALARM
                            </span>
                          ) : (
                            <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-700">
                              NOMINAL
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-55/35 py-12 text-center text-gray-400">
          <Activity className="mx-auto h-12 w-12 text-gray-300 stroke-[1.2] mb-3" />
          <p className="text-xs font-extrabold text-gray-600">Telemetry Offline</p>
          <p className="text-[11px] text-gray-400 max-w-sm mx-auto mt-1">
            No sensor telemetry inputs logged yet for this field. Use the "Log Manual Telemetry" button to input initial observations.
          </p>
        </div>
      )}

      {/* Manual Telemetry Entry modal form */}
      {showAddLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Plus className="h-4.5 w-4.5 text-emerald-600" />
                Log Manual Soil / Air Inspection
              </h3>
              <button
                onClick={() => setShowAddLogModal(false)}
                className="rounded p-1 text-gray-400 hover:bg-gray-50"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={submitLog} className="mt-4 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-gray-600 mb-1.5 font-bold">Host Field Parcel To Logs</label>
                <select
                  value={selectedFieldId}
                  onChange={(e) => setSelectedFieldId(e.target.value)}
                  className="w-full rounded-xl border border-gray-255 bg-white px-3 py-2 text-xs font-black text-gray-700/80"
                >
                  {fields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.name} ({field.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1.5">Ambient Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={tempInput}
                    onChange={(e) => setTempInput(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5">Relative Humidity (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={100}
                    required
                    value={humidityInput}
                    onChange={(e) => setHumidityInput(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1.5">Soil Moisture (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={100}
                    required
                    value={moistureInput}
                    onChange={(e) => setMoistureInput(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5">Measured Soil pH</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={14}
                    required
                    value={phInput}
                    onChange={(e) => setPhInput(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLogModal(false)}
                  className="rounded-lg border border-gray-100 px-4 py-2.5 text-xs font-bold text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                >
                  Confirm & Commit to Log Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
