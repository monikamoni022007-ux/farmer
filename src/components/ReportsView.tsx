/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Download, RefreshCw, Layers, Calendar, CheckSquare, Sparkles } from 'lucide-react';
import { Farmer, Field, Crop, SensorData } from '../types';
import { simulateDownloadFile } from '../utils';

interface ReportsViewProps {
  farmers: Farmer[];
  fields: Field[];
  crops: Crop[];
  sensors: SensorData[];
  onTriggerLog: (message: string, category: 'farmer' | 'field' | 'crop' | 'sensor' | 'system') => void;
}

export default function ReportsView({
  farmers,
  fields,
  crops,
  sensors,
  onTriggerLog,
}: ReportsViewProps) {
  const [activeReport, setActiveReport] = useState<'farmers' | 'fields' | 'crops' | 'sensors'>('farmers');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const getFarmerName = (farmerId: string) => {
    return farmers.find((f) => f.id === farmerId)?.name || 'N/A';
  };

  const getFieldName = (fieldId: string) => {
    return fields.find((f) => f.id === fieldId)?.name || 'N/A';
  };

  // Downloads CSV summaries based on active reports selected
  const triggerReportDownload = () => {
    onTriggerLog(`Compiled and exported ${activeReport} report dataset.`, 'system');

    if (activeReport === 'farmers') {
      const headers = ['FarmerID', 'Full Name', 'Phone Line', 'Regional Location', 'Date Registered'];
      const rows = farmers.map((f) => [
        f.id,
        f.name,
        f.phone,
        f.location,
        new Date(f.createdAt).toLocaleDateString(),
      ]);
      simulateDownloadFile('farmsense_farmers_report.csv', headers, rows);
    } else if (activeReport === 'fields') {
      const headers = ['FieldID', 'Field Name', 'Registered Owner', 'Effective Acreage', 'Operational Scope'];
      const rows = fields.map((f) => [
        f.id,
        f.name,
        getFarmerName(f.farmerId),
        String(f.area),
        f.location,
      ]);
      simulateDownloadFile('farmsense_fields_report.csv', headers, rows);
    } else if (activeReport === 'crops') {
      const headers = ['CropID', 'Cultivar Name', 'Assigned Field Parcel', 'Planting Date', 'Biological Lifecycle', 'Expected Yield (Tons)'];
      const rows = crops.map((c) => [
        c.id,
        c.name,
        getFieldName(c.fieldId),
        c.plantingDate,
        c.status,
        String(c.expectedYield || 0),
      ]);
      simulateDownloadFile('farmsense_crops_report.csv', headers, rows);
    } else if (activeReport === 'sensors') {
      const headers = ['SensorLogID', 'Field Location', 'Temperature (C)', 'Relative Humidity (%)', 'Soil Moisture (%)', 'Soil pH Levels', 'Logged DateTime'];
      const rows = sensors.map((s) => [
        s.id,
        getFieldName(s.fieldId),
        String(s.temperature),
        String(s.humidity),
        String(s.soilMoisture),
        String(s.soilPH),
        new Date(s.dateTime).toISOString(),
      ]);
      simulateDownloadFile('farmsense_iot_sensor_report.csv', headers, rows);
    }

    setStatusMsg(`Your ${activeReport} report has successfully compiled and is downloaded as a CSV.`);
    setTimeout(() => {
      setStatusMsg(null);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900">Agrosuite Reporting</h1>
        <p className="text-xs text-gray-500 font-medium mt-1">
          Compile relational tables in SQL format, download standard schema spreadsheets, and analyze historic performance audits.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Selection side layout - 4 cols */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4 lg:col-span-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Select Report Topic</h3>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveReport('farmers')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-bold transition ${
                activeReport === 'farmers'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="h-4.5 w-4.5" />
              <div>
                <p>Partners & Landowners Directory</p>
                <span className={`text-[10px] ${activeReport === 'farmers' ? 'text-emerald-250' : 'text-gray-400'}`}>
                  {farmers.length} active indexes
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveReport('fields')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-bold transition ${
                activeReport === 'fields'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Layers className="h-4.5 w-4.5" />
              <div>
                <p>Topology boundaries & deeds</p>
                <span className={`text-[10px] ${activeReport === 'fields' ? 'text-emerald-250' : 'text-gray-400'}`}>
                  {fields.length} active segments
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveReport('crops')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-bold transition ${
                activeReport === 'crops'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="h-4.5 w-4.5" />
              <div>
                <p>Cultivars Harvest Tracking</p>
                <span className={`text-[10px] ${activeReport === 'crops' ? 'text-emerald-250' : 'text-gray-400'}`}>
                  {crops.length} crops catalog
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveReport('sensors')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-bold transition ${
                activeReport === 'sensors'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <RefreshCw className="h-4.5 w-4.5 animate-spin-slow" />
              <div>
                <p>Sensor Telemery Logs Historian</p>
                <span className={`text-[10px] ${activeReport === 'sensors' ? 'text-emerald-250' : 'text-gray-400'}`}>
                  {sensors.length} inputs logged
                </span>
              </div>
            </button>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={triggerReportDownload}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              <Download className="h-4.5 w-4.5" />
              Download Active Spreadsheet
            </button>
          </div>

          {statusMsg && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-500/10 p-3.5 text-[11px] font-semibold text-emerald-800">
              {statusMsg}
            </div>
          )}
        </div>

        {/* Live Preview listing table - 8 cols */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden lg:col-span-8">
          <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/40 px-5 py-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">
              Preview Report Format Buffer
            </h3>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
              SQL RELATIONAL COMPLIANT
            </span>
          </div>

          <div className="overflow-x-auto max-h-[420px]">
            {activeReport === 'farmers' && (
              <table className="w-full text-left font-semibold">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] uppercase text-gray-400">
                    <th className="px-5 py-3">FarmerID (PK)</th>
                    <th className="px-5 py-3">FarmerName</th>
                    <th className="px-5 py-3">Phone</th>
                    <th className="px-5 py-3">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                  {farmers.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-mono font-bold text-gray-500">{item.id}</td>
                      <td className="px-5 py-3 font-extrabold text-gray-950">{item.name}</td>
                      <td className="px-5 py-3 font-mono">{item.phone}</td>
                      <td className="px-5 py-3">{item.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'fields' && (
              <table className="w-full text-left font-semibold">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] uppercase text-gray-400">
                    <th className="px-5 py-3">FieldID (PK)</th>
                    <th className="px-5 py-3">FarmerID (FK)</th>
                    <th className="px-5 py-3">FieldName</th>
                    <th className="px-5 py-3">Area (Acres)</th>
                    <th className="px-5 py-3">Location Block</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                  {fields.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-mono font-bold text-gray-500">{item.id}</td>
                      <td className="px-5 py-3 font-mono font-bold text-gray-400">{item.farmerId}</td>
                      <td className="px-5 py-3 font-black text-gray-900">{item.name}</td>
                      <td className="px-5 py-3 font-mono">{item.area}</td>
                      <td className="px-5 py-3">{item.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'crops' && (
              <table className="w-full text-left font-semibold">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] uppercase text-gray-400">
                    <th className="px-5 py-3">CropID (PK)</th>
                    <th className="px-5 py-3">FieldID (FK)</th>
                    <th className="px-5 py-3">CropName</th>
                    <th className="px-5 py-3">PlantingDate</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                  {crops.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-mono font-bold text-gray-500">{item.id}</td>
                      <td className="px-5 py-3 font-mono font-bold text-gray-400">{item.fieldId}</td>
                      <td className="px-5 py-3 font-black text-gray-900">{item.name}</td>
                      <td className="px-5 py-3 font-mono">{item.plantingDate}</td>
                      <td className="px-5 py-3">{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'sensors' && (
              <table className="w-full text-left font-semibold">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] uppercase text-gray-400">
                    <th className="px-5 py-3">SensorID (PK)</th>
                    <th className="px-5 py-3">FieldID (FK)</th>
                    <th className="px-5 py-3">Temp</th>
                    <th className="px-5 py-3">Humidity</th>
                    <th className="px-5 py-3">Moisture</th>
                    <th className="px-5 py-3">Soil pH</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                  {sensors.slice(0, 15).map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-mono font-bold text-gray-500">{item.id}</td>
                      <td className="px-5 py-3 font-mono font-bold text-gray-400">{item.fieldId}</td>
                      <td className="px-5 py-3 font-mono">{item.temperature}°C</td>
                      <td className="px-5 py-3 font-mono">{item.humidity}%</td>
                      <td className="px-5 py-3 font-mono">{item.soilMoisture}%</td>
                      <td className="px-5 py-3 font-mono">{item.soilPH}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
