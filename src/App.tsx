/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_FARMERS,
  INITIAL_FIELDS,
  INITIAL_CROPS,
  INITIAL_SENSOR_DATA,
  INITIAL_LOGS,
  DEFAULT_THRESHOLDS,
  loadFromStorage,
  saveToStorage,
} from './mockData';
import { calculateDynamicRecommendations } from './utils';

// Common sub-components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// View modules
import DashboardView from './components/DashboardView';
import FarmerView from './components/FarmerView';
import FieldView from './components/FieldView';
import CropView from './components/CropView';
import SensorView from './components/SensorView';
import RecommendationsView from './components/RecommendationsView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import LoginView from './components/LoginView';

import { Farmer, Field, Crop, SensorData, SystemLog, ThresholdSettings, User, Recommendation } from './types';
import { Sparkles, Info, X } from 'lucide-react';

export default function App() {
  // Authentication status state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return loadFromStorage<User | null>('session_user', null);
  });

  // Base relational lists stored in localStorage
  const [farmers, setFarmers] = useState<Farmer[]>(() => {
    return loadFromStorage<Farmer[]>('farmers', INITIAL_FARMERS);
  });

  const [fields, setFields] = useState<Field[]>(() => {
    return loadFromStorage<Field[]>('fields', INITIAL_FIELDS);
  });

  const [crops, setCrops] = useState<Crop[]>(() => {
    return loadFromStorage<Crop[]>('crops', INITIAL_CROPS);
  });

  const [sensors, setSensors] = useState<SensorData[]>(() => {
    return loadFromStorage<SensorData[]>('sensors', INITIAL_SENSOR_DATA);
  });

  const [logs, setLogs] = useState<SystemLog[]>(() => {
    return loadFromStorage<SystemLog[]>('logs', INITIAL_LOGS);
  });

  const [thresholds, setThresholds] = useState<ThresholdSettings>(() => {
    return loadFromStorage<ThresholdSettings>('thresholds', DEFAULT_THRESHOLDS);
  });

  const [resolvedRecommendations, setResolvedRecommendations] = useState<string[]>(() => {
    return loadFromStorage<string[]>('resolved_recs', []);
  });

  // Navigation state
  const [activeView, setActiveView] = useState<string>('dashboard');

  // Slide-in Toast notifications state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warn' | 'error' } | null>(null);

  // Sync state changes triggers to localStorage automatically
  useEffect(() => {
    saveToStorage('farmers', farmers);
  }, [farmers]);

  useEffect(() => {
    saveToStorage('fields', fields);
  }, [fields]);

  useEffect(() => {
    saveToStorage('crops', crops);
  }, [crops]);

  useEffect(() => {
    saveToStorage('sensors', sensors);
  }, [sensors]);

  useEffect(() => {
    saveToStorage('logs', logs);
  }, [logs]);

  useEffect(() => {
    saveToStorage('thresholds', thresholds);
  }, [thresholds]);

  useEffect(() => {
    saveToStorage('resolved_recs', resolvedRecommendations);
  }, [resolvedRecommendations]);

  // Helper trigger dynamic toasts
  const triggerToast = (message: string, type: 'success' | 'warn' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Log automated system audits
  const registerLog = (message: string, category: SystemLog['category'], type: SystemLog['type'] = 'info') => {
    const newLog: SystemLog = {
      id: `LOG-0${100 + logs.length + 1}`,
      type,
      category,
      message,
      timestamp: new Date().toISOString(),
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Auth controllers
  const handleLoginSuccess = (email: string, name: string) => {
    const session: User = {
      email,
      name,
      role: email.includes('admin') ? 'Administrator' : 'Field Operator',
      avatarUrl: '',
    };
    setCurrentUser(session);
    saveToStorage('session_user', session);
    registerLog(`Operator ${name} authenticated and synced cache relays.`, 'system', 'success');
    triggerToast(`Welcome back, ${name}! Database loaded.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('farmsense_session_user');
    triggerToast('Signed out of FarmSense Cloud securely.');
  };

  // CRUD — FARMERS
  const handleAddFarmer = (farmerData: Omit<Farmer, 'id' | 'createdAt'>) => {
    const newId = `FMR-${100 + farmers.length + 1}`;
    const newFarmer: Farmer = {
      ...farmerData,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    setFarmers((prev) => [newFarmer, ...prev]);
    registerLog(`Added new farmer record: ${farmerData.name}`, 'farmer', 'success');
    triggerToast(`Farmer ${farmerData.name} successfully registered.`);
  };

  const handleUpdateFarmer = (updated: Farmer) => {
    setFarmers((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    registerLog(`Updated farmer file coordinates for: ${updated.name}`, 'farmer', 'info');
    triggerToast(`Farmer ${updated.name} updated.`);
  };

  const handleDeleteFarmer = (id: string) => {
    const target = farmers.find((f) => f.id === id);
    if (!target) return;
    setFarmers((prev) => prev.filter((f) => f.id !== id));
    registerLog(`Liquidated farmer contact record: ${target.name}`, 'farmer', 'warn');
    triggerToast(`Farmer profile ${target.name} removed from database directory.`, 'warn');
  };

  // CRUD — FIELDS
  const handleAddField = (fieldData: Omit<Field, 'id' | 'createdAt'>) => {
    const newId = `FLD-${200 + fields.length + 1}`;
    const newField: Field = {
      ...fieldData,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    setFields((prev) => [newField, ...prev]);
    registerLog(`Delineated field parcel boundaries: ${fieldData.name}`, 'field', 'success');
    triggerToast(`Field ${fieldData.name} registered.`);
  };

  const handleUpdateField = (updated: Field) => {
    setFields((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    registerLog(`Modified topography bounds for field parcel: ${updated.name}`, 'field', 'info');
    triggerToast(`Field parcel ${updated.name} updated.`);
  };

  const handleDeleteField = (id: string) => {
    const target = fields.find((f) => f.id === id);
    if (!target) return;
    setFields((prev) => prev.filter((f) => f.id !== id));
    registerLog(`Removed field boundary deeds: ${target.name}`, 'field', 'warn');
    triggerToast(`Field parcel ${target.name} deleted.`, 'warn');
  };

  // CRUD — CROPS
  const handleAddCrop = (cropData: Omit<Crop, 'id'>) => {
    const newId = `CRP-${300 + crops.length + 1}`;
    const newCrop: Crop = {
      ...cropData,
      id: newId,
    };
    setCrops((prev) => [newCrop, ...prev]);
    registerLog(`Sowed/Registered crop cultivar: ${cropData.name}`, 'crop', 'success');
    triggerToast(`Registered planting of cultivar: ${cropData.name}`);
  };

  const handleUpdateCrop = (updated: Crop) => {
    setCrops((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    registerLog(`Modified biological status coordinates for cultivar: ${updated.name}`, 'crop', 'info');
    triggerToast(`Cultivar state ${updated.name} updated.`);
  };

  const handleDeleteCrop = (id: string) => {
    const target = crops.find((c) => c.id === id);
    if (!target) return;
    setCrops((prev) => prev.filter((c) => c.id !== id));
    registerLog(`Removed cultivar planting records for: ${target.name}`, 'crop', 'warn');
    triggerToast(`Cultivar database records for ${target.name} deleted.`, 'warn');
  };

  // SENSOR RECORD ENTRY
  const handleAddSensorRecord = (recordData: Omit<SensorData, 'id' | 'dateTime'>) => {
    const newId = `SNS-${400 + sensors.length + 1}`;
    const newSensor: SensorData = {
      ...recordData,
      id: newId,
      dateTime: new Date().toISOString(),
    };
    setSensors((prev) => [newSensor, ...prev]);

    // Check if moisture status or other trigger warning activations
    const targetField = fields.find((item) => item.id === recordData.fieldId);
    const fieldLabel = targetField ? targetField.name : 'Unknown';

    registerLog(`Logged physical telementry readouts for parcel: ${fieldLabel}`, 'sensor', 'info');
    triggerToast(`Logged telemetry into Field Table successfully.`);

    // If variables trigger alarms, flash warnings
    if (recordData.soilMoisture < thresholds.minSoilMoisture) {
      registerLog(`Alarm limit exceeded! Soil Moisture ${recordData.soilMoisture}% in Field ${fieldLabel} is critical!`, 'sensor', 'error');
      triggerToast(`Moisture WARNING triggered for ${fieldLabel}!`, 'warn');
    }
  };

  // RECOMMENDATION TRIGGER SOLVER
  const handleSolveRecommendation = (recId: string) => {
    setResolvedRecommendations((prev) => [...prev, recId]);

    // Add success logging and user toast
    const originalId = recId.split('-')[1]; // E.g., 'REC-FLD-202-MOIST' -> fieldID is FLD-202
    const fieldName = fields.find((f) => f.id === originalId)?.name || 'Domain';
    const actionLabel = recId.includes('MOIST') ? 'Irrigation activated' : 'Soil chemical neutralizing applied';

    registerLog(`Operator manually resolved alert queue ${recId}. Condition safe.`, 'system', 'success');
    triggerToast(`Resolved recommendation: ${actionLabel} on ${fieldName}.`);
  };

  // Dynamic recommendations calculation
  const dynamicRecommendations = calculateDynamicRecommendations(fields, sensors, thresholds).map((rec) => {
    // If operator clicked solve, override the actionTaken flag to track persistence
    const wasResolved = resolvedRecommendations.includes(rec.id);
    return {
      ...rec,
      actionTaken: wasResolved,
    };
  });

  // REST RESET DATABASE TO RAW SEEDS
  const handleResetDatabase = () => {
    setFarmers(INITIAL_FARMERS);
    setFields(INITIAL_FIELDS);
    setCrops(INITIAL_CROPS);
    setSensors(INITIAL_SENSOR_DATA);
    setLogs(INITIAL_LOGS);
    setThresholds(DEFAULT_THRESHOLDS);
    setResolvedRecommendations([]);
    registerLog('System catalog restored successfully back to initial SQL seeds.', 'system', 'success');
    triggerToast('Database synchronized back to original mock schemas.', 'success');
  };

  const handleUpdateUserProfile = (updatedProps: Partial<User>) => {
    if (currentUser) {
      const merged = { ...currentUser, ...updatedProps };
      setCurrentUser(merged);
      saveToStorage('session_user', merged);
    }
  };

  // Render Gate Authentication check
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50/50 text-slate-800 antialiased font-sans">
      {/* Dynamic Slide-in Toast notifications */}
      {toast && (
        <div
          className={`fixed right-6 bottom-6 z-50 flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 shadow-2xl transition border animate-in slide-in-from-bottom-5 duration-150 ${
            toast.type === 'warn'
              ? 'bg-amber-500/10 border-amber-400 text-amber-900'
              : toast.type === 'error'
              ? 'bg-red-500/10 border-red-400 text-red-950'
              : 'bg-emerald-950/95 border-emerald-500/20 text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className={`h-4.5 w-4.5 ${toast.type === 'success' ? 'text-emerald-400' : 'text-amber-500'}`} />
            <span className="text-xs font-bold leading-tight">{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="rounded p-0.5 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Collapsible Navigation Sidebar */}
      <Sidebar activeView={activeView} onNavigate={setActiveView} onLogout={handleLogout} />

      {/* Primary Workspace Panels */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Controls Panel */}
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          recommendations={dynamicRecommendations}
          activeView={activeView}
          onNavigate={setActiveView}
        />

        {/* Content View Routing Frame */}
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
          {activeView === 'dashboard' && (
            <DashboardView
              farmers={farmers}
              fields={fields}
              crops={crops}
              sensors={sensors}
              logs={logs}
              recommendations={dynamicRecommendations}
              onNavigate={setActiveView}
              onSolveRecommendation={handleSolveRecommendation}
            />
          )}

          {activeView === 'farmers' && (
            <FarmerView
              farmers={farmers}
              fields={fields}
              onAddFarmer={handleAddFarmer}
              onUpdateFarmer={handleUpdateFarmer}
              onDeleteFarmer={handleDeleteFarmer}
            />
          )}

          {activeView === 'fields' && (
            <FieldView
              fields={fields}
              farmers={farmers}
              crops={crops}
              sensors={sensors}
              onAddField={handleAddField}
              onUpdateField={handleUpdateField}
              onDeleteField={handleDeleteField}
            />
          )}

          {activeView === 'crops' && (
            <CropView
              crops={crops}
              fields={fields}
              onAddCrop={handleAddCrop}
              onUpdateCrop={handleUpdateCrop}
              onDeleteCrop={handleDeleteCrop}
            />
          )}

          {activeView === 'sensor' && (
            <SensorView
              sensors={sensors}
              fields={fields}
              thresholds={thresholds}
              onAddSensorRecord={handleAddSensorRecord}
            />
          )}

          {activeView === 'recommendations' && (
            <RecommendationsView
              recommendations={dynamicRecommendations}
              onSolveRecommendation={handleSolveRecommendation}
            />
          )}

          {activeView === 'reports' && (
            <ReportsView
              farmers={farmers}
              fields={fields}
              crops={crops}
              sensors={sensors}
              onTriggerLog={registerLog}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              thresholds={thresholds}
              onUpdateThresholds={setThresholds}
              currentUser={currentUser}
              onUpdateUserProfile={handleUpdateUserProfile}
              onResetDatabase={handleResetDatabase}
            />
          )}
        </main>
      </div>
    </div>
  );
}
