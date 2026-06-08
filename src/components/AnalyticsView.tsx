/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, BarChart2, PieChart as PieIcon, Activity, Thermometer, Droplets } from 'lucide-react';
import { SensorData, Field, Crop } from '../types';

interface AnalyticsViewProps {
  sensors: SensorData[];
  fields: Field[];
  crops: Crop[];
}

export default function AnalyticsView({ sensors, fields, crops }: AnalyticsViewProps) {
  const [selectedFieldId, setSelectedFieldId] = useState<string>(fields[0]?.id || '');

  const activeField = fields.find((f) => f.id === selectedFieldId);

  // Group readings chronologically for Trend displays
  const fieldReadings = sensors
    .filter((s) => s.fieldId === selectedFieldId)
    // Sort chronological: oldest to newest for trend flow
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .map((s) => ({
      time: new Date(s.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      moisture: s.soilMoisture,
      temperature: s.temperature,
      humidity: s.humidity,
      ph: s.soilPH,
    }));

  // Pie chart: Crop representation distribution by Acreage
  const cropDistributionData = crops.map((crop) => {
    const field = fields.find((f) => f.id === crop.fieldId);
    return {
      name: crop.name,
      value: field ? field.area : 40,
    };
  });

  // Monthly compared historical stats
  const monthlyData = [
    { name: 'Jan', Moisture: 55, Temperature: 18, Humidity: 72 },
    { name: 'Feb', Moisture: 52, Temperature: 19, Humidity: 70 },
    { name: 'Mar', Moisture: 48, Temperature: 22, Humidity: 65 },
    { name: 'Apr', Moisture: 44, Temperature: 25, Humidity: 62 },
    { name: 'May', Moisture: 38, Temperature: 27, Humidity: 58 },
    { name: 'Jun', Moisture: 31, Temperature: 30, Humidity: 50 },
  ];

  const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Analytics view Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 font-sans">Agricultural Big Data</h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Analyze historical agronomic variables, moisture exhaustion curves, and harvest yields.
          </p>
        </div>

        {/* Dropdown Selector to swap visual trend scopes */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 font-mono">TREND SOURCE:</span>
          <select
            value={selectedFieldId}
            onChange={(e) => setSelectedFieldId(e.target.value)}
            className="rounded-xl border border-gray-150 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-800 focus:outline-none"
          >
            {fields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Custom Analytics Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* CHART 1: SOIL MOISTURE TRENDS */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="rounded-lg bg-teal-50 p-1.5 text-teal-600">
              <Droplets className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wide">Moisture Depletion Trend</h3>
              <p className="text-[10px] text-gray-400 font-medium">Telemetry reports for {activeField?.name || 'Field'}</p>
            </div>
          </div>

          <div className="h-64">
            {fieldReadings.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-gray-400 font-mono">
                Telemetry Log is Empty for this field.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fieldReadings} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} domain={[0, 100]} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #f3f4f6' }} />
                  <Line type="monotone" dataKey="moisture" name="Moisture (%)" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* CHART 2: TEMPERATURE TREND LINE */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="rounded-lg bg-red-50 p-1.5 text-red-650">
              <Thermometer className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wide">Ambient Canopy Temperature</h3>
              <p className="text-[10px] text-gray-400 font-medium">Chronological thermal variations</p>
            </div>
          </div>

          <div className="h-64">
            {fieldReadings.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-gray-400 font-mono">
                Telemetry Log is Empty for this field.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fieldReadings} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} domain={[0, 50]} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #f3f4f6' }} />
                  <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* CHART 3: CROP DISTRIBUTION PIE */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-850">
              <PieIcon className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wide">Cultivar Acreage Distribution</h3>
              <p className="text-[10px] text-gray-400 font-medium">Percentage split of agricultural space by crop</p>
            </div>
          </div>

          <div className="h-64 flex flex-col sm:flex-row items-center justify-around">
            <div className="w-full sm:w-[50%] h-full">
              {cropDistributionData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-gray-450 font-mono">
                  No crop statistics available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={cropDistributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                      {cropDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Legend breakdown for side */}
            <div className="space-y-1.5 w-[40%] text-xs max-h-48 overflow-y-auto">
              {cropDistributionData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <div className="truncate flex-1">
                    <p className="font-bold text-gray-800 leading-tight">{entry.name}</p>
                    <span className="text-[10px] text-gray-400 font-mono">{entry.value} Acres</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHART 4: MONTHLY COMPARISON DATA */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
              <BarChart2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wide">Seasonal Historical Average</h3>
              <p className="text-[10px] text-gray-400 font-medium">Comparison of monthly soil-air logs</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #f3f4f6' }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10, marginTop: 5 }} />
                <Bar dataKey="Moisture" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Temperature" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
