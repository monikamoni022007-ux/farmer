/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit2, Calendar, Sprout, Milestone, Scale, X } from 'lucide-react';
import { Crop, Field } from '../types';

interface CropViewProps {
  crops: Crop[];
  fields: Field[];
  onAddCrop: (crop: Omit<Crop, 'id'>) => void;
  onUpdateCrop: (crop: Crop) => void;
  onDeleteCrop: (cropId: string) => void;
}

export default function CropView({
  crops,
  fields,
  onAddCrop,
  onUpdateCrop,
  onDeleteCrop,
}: CropViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<Crop | null>(null);

  // Form states
  const [nameInput, setNameInput] = useState('');
  const [fieldIdInput, setFieldIdInput] = useState('');
  const [plantingDateInput, setPlantingDateInput] = useState('2026-06-08');
  const [statusInput, setStatusInput] = useState<'Planting' | 'Growing' | 'Harvesting' | 'Harvested'>('Growing');
  const [expectedYieldInput, setExpectedYieldInput] = useState<number>(25);

  const getFieldName = (fieldId: string) => {
    const f = fields.find((item) => item.id === fieldId);
    return f ? f.name : 'Unknown Field';
  };

  const getFieldArea = (fieldId: string) => {
    const f = fields.find((item) => item.id === fieldId);
    return f ? f.area : 0;
  };

  const filteredCrops = crops.filter((c) => {
    const q = searchTerm.toLowerCase();
    const fieldName = getFieldName(c.fieldId).toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      fieldName.includes(q)
    );
  });

  const getStatusColor = (status: Crop['status']) => {
    switch (status) {
      case 'Planting':
        return 'text-blue-700 bg-blue-50 border-blue-250';
      case 'Growing':
        return 'text-emerald-700 bg-emerald-55/10 border-emerald-500/20';
      case 'Harvesting':
        return 'text-amber-800 bg-amber-50 border-amber-500/10';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Simulating crop progress based on planting date and status
  const getSimulatedProgress = (status: Crop['status']) => {
    switch (status) {
      case 'Planting':
        return 10;
      case 'Growing':
        return 55;
      case 'Harvesting':
        return 90;
      default:
        return 100;
    }
  };

  const handleOpenAdd = () => {
    setNameInput('');
    setFieldIdInput(fields[0]?.id || '');
    setPlantingDateInput('2026-06-08');
    setStatusInput('Growing');
    setExpectedYieldInput(35);
    setShowAddModal(true);
  };

  const handleOpenEdit = (crop: Crop) => {
    setNameInput(crop.name);
    setFieldIdInput(crop.fieldId);
    setPlantingDateInput(crop.plantingDate);
    setStatusInput(crop.status);
    setExpectedYieldInput(crop.expectedYield || 20);
    setShowEditModal(crop);
  };

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !fieldIdInput) return;
    onAddCrop({
      name: nameInput,
      fieldId: fieldIdInput,
      plantingDate: plantingDateInput,
      status: statusInput,
      expectedYield: expectedYieldInput,
    });
    setShowAddModal(false);
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal || !nameInput.trim() || !fieldIdInput) return;
    onUpdateCrop({
      ...showEditModal,
      name: nameInput,
      fieldId: fieldIdInput,
      plantingDate: plantingDateInput,
      status: statusInput,
      expectedYield: expectedYieldInput,
    });
    setShowEditModal(null);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Crop Tracking</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Track biological life stage progress, planting timelines, and dynamic crop distributions.
          </p>
        </div>
        <button
          id="add_crop_btn"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Plant New Crop
        </button>
      </div>

      {/* Actions Toolbar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          id="crop_search_input"
          type="text"
          placeholder="Search crop name, status or plot field..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-gray-150 py-2.5 pl-10 pr-4 text-xs font-medium focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* Cultivar Grids */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredCrops.map((crop) => {
          const fieldName = getFieldName(crop.fieldId);
          const acreage = getFieldArea(crop.fieldId);
          const progress = getSimulatedProgress(crop.status);

          return (
            <div
              key={crop.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Crop ID, Badge and Name */}
                <div className="flex items-start justify-between gap-2 border-b border-gray-50 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-xl bg-emerald-50 p-2 text-emerald-800">
                      <Sprout className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-gray-900">{crop.name}</h3>
                      <span className="font-mono text-[9px] text-gray-400 font-semibold">{crop.id}</span>
                    </div>
                  </div>

                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-bold ${getStatusColor(
                      crop.status
                    )}`}
                  >
                    {crop.status}
                  </span>
                </div>

                {/* Relational details lookup */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Planted In Field</span>
                    <span className="font-bold text-gray-800">{fieldName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Effective Area</span>
                    <span className="font-mono font-bold text-gray-850">{acreage} Acres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Planting Date</span>
                    <span className="font-mono font-semibold text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {crop.plantingDate}
                    </span>
                  </div>
                  {crop.expectedYield && (
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Est. Yield Forecast</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1 font-mono">
                        <Scale className="h-3.5 w-3.5" />
                        {crop.expectedYield} Tons
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress bar visualizer */}
                <div className="mt-4 border-t border-gray-50 pt-3">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold mb-1">
                    <span>GROWTH LIFECYCLE</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-300`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* CRUD triggers */}
              <div className="mt-5 flex items-center justify-end gap-1.5 border-t border-gray-50 pt-3">
                <button
                  onClick={() => handleOpenEdit(crop)}
                  className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-emerald-700"
                  title="Modify crop"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDeleteCrop(crop.id)}
                  className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  title="Remove crop record"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Crop modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Plus className="h-4.5 w-4.5 text-emerald-600" />
                Plant / Register New Crop Cultivar
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
                <label className="block text-gray-600 mb-1.5">Crop Cultivar Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Baby Spinach, Sweet Corn"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1.5">Host Field Plot</label>
                <select
                  value={fieldIdInput}
                  onChange={(e) => setFieldIdInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-255 bg-white px-3 py-2 text-xs font-bold text-gray-700/80 focus:border-emerald-500 focus:outline-none"
                >
                  {fields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.name} ({field.area} Acres)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1.5 font-bold">Planting Date</label>
                  <input
                    type="date"
                    required
                    value={plantingDateInput}
                    onChange={(e) => setPlantingDateInput(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-[11px] font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5 font-bold">Yield Projection (Tons)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={expectedYieldInput}
                    onChange={(e) => setExpectedYieldInput(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-[11px] font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 mb-1.5">Initial Growth State</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as Crop['status'])}
                  className="w-full rounded-xl border border-gray-255 bg-white px-3 py-2 text-xs font-bold text-gray-700/80 focus:border-emerald-500"
                >
                  <option value="Planting">Planting State</option>
                  <option value="Growing">Growing/Vegetative</option>
                  <option value="Harvesting">Harvesting Window</option>
                  <option value="Harvested">Harvest Completed</option>
                </select>
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
                  Commit Crop Seed Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Crop modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Edit2 className="h-4.5 w-4.5 text-emerald-600" />
                Modify Crop Cultivar ({showEditModal.id})
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
                <label className="block text-gray-600 mb-1.5">Crop Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1.5">Planted Field Area</label>
                <select
                  value={fieldIdInput}
                  onChange={(e) => setFieldIdInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-255 bg-white px-3 py-2 text-xs font-bold text-gray-700/80 focus:border-emerald-500 focus:outline-none"
                >
                  {fields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.name} ({field.area} Acres)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1.5">Planting Date</label>
                  <input
                    type="date"
                    required
                    value={plantingDateInput}
                    onChange={(e) => setPlantingDateInput(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-[11px] font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5">Projected Yield (Tons)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={expectedYieldInput}
                    onChange={(e) => setExpectedYieldInput(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-[11px] font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 mb-1.5">Growth Stage State</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as Crop['status'])}
                  className="w-full rounded-xl border border-gray-255 bg-white px-3 py-2 text-xs font-bold text-gray-700/80 focus:border-emerald-500"
                >
                  <option value="Planting">Planting State</option>
                  <option value="Growing">Growing/Vegetative</option>
                  <option value="Harvesting">Harvesting Window</option>
                  <option value="Harvested">Harvest Completed</option>
                </select>
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
                  Apply Crop Specifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
