/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit2, MapPin, Phone, User, Calendar, X } from 'lucide-react';
import { Farmer, Field } from '../types';

interface FarmerViewProps {
  farmers: Farmer[];
  fields: Field[];
  onAddFarmer: (farmer: Omit<Farmer, 'id' | 'createdAt'>) => void;
  onUpdateFarmer: (farmer: Farmer) => void;
  onDeleteFarmer: (farmerId: string) => void;
}

export default function FarmerView({
  farmers,
  fields,
  onAddFarmer,
  onUpdateFarmer,
  onDeleteFarmer,
}: FarmerViewProps) {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected Farmer details view
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

  // Form Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<Farmer | null>(null);

  // Inputs state
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  // Filtered farmers
  const filteredFarmers = farmers.filter((f) => {
    const q = searchTerm.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.phone.toLowerCase().includes(q) ||
      f.location.toLowerCase().includes(q) ||
      f.id.toLowerCase().includes(q)
    );
  });

  // Paginated fields
  const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage) || 1;
  const paginatedFarmers = filteredFarmers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setNameInput('');
    setPhoneInput('');
    setLocationInput('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (farmer: Farmer) => {
    setNameInput(farmer.name);
    setPhoneInput(farmer.phone);
    setLocationInput(farmer.location);
    setShowEditModal(farmer);
  };

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onAddFarmer({
      name: nameInput,
      phone: phoneInput || 'N/A',
      location: locationInput || 'Unknown location',
    });
    setShowAddModal(false);
    resetForm();
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal || !nameInput.trim()) return;
    onUpdateFarmer({
      ...showEditModal,
      name: nameInput,
      phone: phoneInput,
      location: locationInput,
    });
    setShowEditModal(null);
    resetForm();
  };

  // Associated fields tracker
  const getAssociatedFields = (farmerId: string) => {
    return fields.filter((f) => f.farmerId === farmerId);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Farmers Directory</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Registered landowners, agricultural contract partners, and telemetry contacts.
          </p>
        </div>
        <button
          id="add_farmer_btn"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Add New Farmer
        </button>
      </div>

      {/* Database Search & Statistics Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="farmer_search_input"
            type="text"
            placeholder="Search farmer ID, name, region..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset page on query change
            }}
            className="w-full rounded-xl border border-gray-150 py-2.5 pl-10 pr-4 text-xs font-medium focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="text-xs font-medium text-gray-500">
          Showing <span className="font-bold text-gray-800">{filteredFarmers.length}</span> of{' '}
          <span className="font-bold text-gray-800">{farmers.length}</span> total farmer profiles
        </div>
      </div>

      {/* Main List Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Table/List - 8 cols */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden lg:col-span-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-55/35 bg-gray-50/50 text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  <th className="px-5 py-3">Farmer Details</th>
                  <th className="px-5 py-3">Location Location</th>
                  <th className="px-5 py-3">Phone Line</th>
                  <th className="px-5 py-3">Field Count</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {paginatedFarmers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      No matching records found in Farmers Database.
                    </td>
                  </tr>
                ) : (
                  paginatedFarmers.map((farmer) => {
                    const farmerFields = getAssociatedFields(farmer.id);
                    return (
                      <tr
                        key={farmer.id}
                        onClick={() => setSelectedFarmer(farmer)}
                        className={`cursor-pointer transition hover:bg-emerald-50/20 ${
                          selectedFarmer?.id === farmer.id ? 'bg-emerald-50/30' : ''
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 font-bold">
                              {farmer.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{farmer.name}</p>
                              <span className="font-mono text-[10px] text-gray-400 font-medium">
                                {farmer.id}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            <span>{farmer.location}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 font-mono text-gray-600">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            <span>{farmer.phone}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono font-bold text-slate-800">
                            {farmerFields.length} fields
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(farmer)}
                              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-emerald-700"
                              title="Edit Farmer"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteFarmer(farmer.id)}
                              className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                              title="Delete Farmer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Simple Pagination Footer */}
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-[11px] font-semibold text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Selected Farmer Mini Detail View - 4 cols */}
        <div className="lg:col-span-4">
          {selectedFarmer ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <User className="h-4 w-4 text-emerald-600" />
                  Farmer Profile Detailed File
                </h3>
                <button
                  onClick={() => setSelectedFarmer(null)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Farmer Profile */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Farmer Name</p>
                <p className="mt-0.5 text-base font-black text-gray-800">{selectedFarmer.name}</p>
                <p className="mt-0.5 font-mono text-[10px] text-gray-400 font-semibold">{selectedFarmer.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div>
                  <p className="font-bold text-gray-400">Phone</p>
                  <p className="mt-0.5 font-mono font-bold text-gray-800">{selectedFarmer.phone}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-400">Registered</p>
                  <p className="mt-0.5 font-mono font-bold text-gray-800">
                    {new Date(selectedFarmer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400">Regional Location</p>
                <p className="mt-0.5 text-xs font-bold text-gray-800 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  {selectedFarmer.location}
                </p>
              </div>

              {/* Fields assigned to farmer */}
              <div className="border-t border-gray-55/30 pt-4">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 mb-2.5">
                  Associated Farm Fields/Plots ({getAssociatedFields(selectedFarmer.id).length})
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {getAssociatedFields(selectedFarmer.id).length === 0 ? (
                    <p className="text-[11px] text-gray-400">No fields linked to this farmer yet.</p>
                  ) : (
                    getAssociatedFields(selectedFarmer.id).map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-[11px]"
                      >
                        <div>
                          <p className="font-bold text-gray-800">{field.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{field.id}</p>
                        </div>
                        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {field.area} Acres
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center text-gray-400">
              <User className="mx-auto h-12 w-12 text-gray-300 stroke-[1.2] mb-3" />
              <p className="text-xs font-extrabold text-gray-600">No Selection Made</p>
              <p className="text-[11px] text-gray-400 max-w-xs mx-auto mt-1">
                Select a farmer from the database table to view deep topological properties, telemetry histories, and linked deeds.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Farmer Modal Box */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Plus className="h-4.5 w-4.5 text-emerald-600" />
                Register New Landholder / Farmer
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
                <label className="block text-gray-600 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Miller"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1.5">Phone Line</label>
                <input
                  type="text"
                  placeholder="e.g. +1 (555) 012-3456"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1.5">Operations Base Region</label>
                <input
                  type="text"
                  placeholder="e.g. Salinas Valley, CA"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                />
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
                  Confirm & Write DB Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Farmer Modal Box */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Edit2 className="h-4.5 w-4.5 text-emerald-600" />
                Modify Farmer Details ({showEditModal.id})
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
                <label className="block text-gray-600 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1.5">Phone Line</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1.5">Operations Base Region</label>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                />
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
                  Save & Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
