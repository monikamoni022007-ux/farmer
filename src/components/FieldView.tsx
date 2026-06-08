/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit2, MapPin, Scale, User, Layout, Eye, X } from 'lucide-react';
import { Field, Farmer, Crop, SensorData } from '../types';

interface FieldViewProps {
  fields: Field[];
  farmers: Farmer[];
  crops: Crop[];
  sensors: SensorData[];
  onAddField: (field: Omit<Field, 'id' | 'createdAt'>) => void;
  onUpdateField: (field: Field) => void;
  onDeleteField: (fieldId: string) => void;
}

export default function FieldView({
  fields,
  farmers,
  crops,
  sensors,
  onAddField,
  onUpdateField,
  onDeleteField,
}: FieldViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<Field | null>(null);

  // Field Form states
  const [nameInput, setNameInput] = useState('');
  const [farmerIdInput, setFarmerIdInput] = useState('');
  const [areaInput, setAreaInput] = useState<number>(50);
  const [locationInput, setLocationInput] = useState('');

  // Selected field details view
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // Find linked data helpers
  const getFarmerName = (farmerId: string) => {
    const f = farmers.find((u) => u.id === farmerId);
    return f ? f.name : 'Unknown Farmer';
  };

  const getCropsOnField = (fieldId: string) => {
    return crops.filter((c) => c.fieldId === fieldId);
  };

  const getLatestTelemetry = (fieldId: string) => {
    const readings = sensors
      .filter((s) => s.fieldId === fieldId)
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    return readings[0] || null;
  };

  // Filtered Fields query
  const filteredFields = fields.filter((f) => {
    const q = searchTerm.toLowerCase();
    const farmerName = getFarmerName(f.farmerId).toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.location.toLowerCase().includes(q) ||
      f.id.toLowerCase().includes(q) ||
      farmerName.includes(q)
    );
  });

  const handleOpenAdd = () => {
    setNameInput('');
    setFarmerIdInput(farmers[0]?.id || '');
    setAreaInput(40);
    setLocationInput('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (field: Field, e: React.MouseEvent) => {
    e.stopPropagation();
    setNameInput(field.name);
    setFarmerIdInput(field.farmerId);
    setAreaInput(field.area);
    setLocationInput(field.location);
    setShowEditModal(field);
  };

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !farmerIdInput) return;
    onAddField({
      name: nameInput,
      farmerId: farmerIdInput,
      area: areaInput,
      location: locationInput || 'Plat Zone A',
    });
    setShowAddModal(false);
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal || !nameInput.trim() || !farmerIdInput) return;
    onUpdateField({
      ...showEditModal,
      name: nameInput,
      farmerId: farmerIdInput,
      area: areaInput,
      location: locationInput,
    });
    setShowEditModal(null);
  };

  return (
    <div className="space-y-6">
      {/* View Title Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Fields Topology</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Delineate custom acreages, assign owners, and track environmental coverage zones.
          </p>
        </div>
        <button
          id="add_field_btn"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Delineate New Field
        </button>
      </div>

      {/* Database Search Filter bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          id="field_search_input"
          type="text"
          placeholder="Search fields, locations or farmer owners..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-gray-150 py-2.5 pl-10 pr-4 text-xs font-medium focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* Grid of Fields Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredFields.map((field) => {
          const linkedFarmerName = getFarmerName(field.farmerId);
          const activeCrops = getCropsOnField(field.id);
          const telemetry = getLatestTelemetry(field.id);

          return (
            <div
              key={field.id}
              onClick={() => setSelectedFieldId(field.id)}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[220px] ${
                selectedFieldId === field.id ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-gray-100'
              }`}
            >
              <div>
                {/* Field Title Block */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{field.name}</h3>
                    <p className="mt-0.5 text-[10px] font-mono text-gray-400 font-semibold">{field.id}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800 shrink-0">
                    {field.area} ACRES
                  </span>
                </div>

                {/* Landowner Relation */}
                <p className="mt-3.5 flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  <span>Landowner:</span>
                  <span className="font-bold text-gray-800">{linkedFarmerName}</span>
                </p>

                {/* Subzone */}
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  <span>Scope:</span>
                  <span className="font-bold text-gray-700">{field.location}</span>
                </p>

                {/* Linked Crops status */}
                <div className="mt-3.5 border-t border-gray-50 pt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Planted Cultivars</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {activeCrops.length === 0 ? (
                      <span className="text-[11px] font-semibold text-gray-400 italic">No crops planted currently</span>
                    ) : (
                      activeCrops.map((c) => (
                        <span
                          key={c.id}
                          className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-900/10"
                        >
                          {c.name} ({c.status})
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Card Actions Strip \& sensor metrics preview */}
              <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex items-center gap-2">
                  {telemetry ? (
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[10px] font-mono font-medium text-gray-400">
                        {telemetry.soilMoisture}% moisture • {telemetry.temperature}°C
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-mono">Offline</span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleOpenEdit(field, e)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-emerald-700"
                    title="Update properties"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteField(field.id);
                    }}
                    className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    title="Liquidate field"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Field Modal Box */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Plus className="h-4.5 w-4.5 text-emerald-600" />
                Register New Farm Field
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded p-1 text-gray-400 hover:bg-gray-50"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={submitAdd} className="mt-4 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-gray-600 mb-1.5">Field / Sector Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Ridge Valley"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1.5">Assigned Farmer (Owner Relation)</label>
                <select
                  value={farmerIdInput}
                  onChange={(e) => setFarmerIdInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-255 bg-white px-3 py-2 text-xs font-bold text-gray-700 focus:border-emerald-500 focus:outline-none"
                >
                  {farmers.map((farmer) => (
                    <option key={farmer.id} value={farmer.id}>
                      {farmer.name} ({farmer.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1.5">Acreage Area (Acres)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={areaInput}
                    onChange={(e) => setAreaInput(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5">Operational Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Zone A"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-gray-100 px-4 py-2.5 text-xs font-bold text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                >
                  Register Field Coordinates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Field Modal Box */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Edit2 className="h-4.5 w-4.5 text-emerald-600" />
                Modify Field Properties ({showEditModal.id})
              </h3>
              <button
                onClick={() => setShowEditModal(null)}
                className="rounded p-1 text-gray-400 hover:bg-gray-50"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={submitEdit} className="mt-4 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-gray-600 mb-1.5">Field / Sector Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1.5">Assigned Farmer (Owner Relation)</label>
                <select
                  value={farmerIdInput}
                  onChange={(e) => setFarmerIdInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-255 bg-white px-3 py-2 text-xs font-bold text-gray-700 focus:border-emerald-500 focus:outline-none"
                >
                  {farmers.map((farmer) => (
                    <option key={farmer.id} value={farmer.id}>
                      {farmer.name} ({farmer.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1.5">Acreage Area (Acres)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={areaInput}
                    onChange={(e) => setAreaInput(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5">Operational Region</label>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(null)}
                  className="rounded-lg border border-gray-100 px-4 py-2.5 text-xs font-bold text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                >
                  Apply Field Boundary Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
