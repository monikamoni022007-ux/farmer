/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Farmer, Field, Crop, SensorData, SystemLog, ThresholdSettings } from './types';

export const INITIAL_FARMERS: Farmer[] = [
  { id: 'FMR-101', name: 'James Thompson', phone: '+1 (555) 019-2834', location: 'Salinas, CA', createdAt: '2026-01-15T08:30:00Z' },
  { id: 'FMR-102', name: 'Maria Rodriguez', phone: '+1 (555) 014-9912', location: 'Yakima, WA', createdAt: '2026-02-10T11:15:00Z' },
  { id: 'FMR-103', name: 'David Vance', phone: '+1 (555) 017-4481', location: 'Ames, IA', createdAt: '2026-03-05T09:00:00Z' },
  { id: 'FMR-104', name: 'Sarah Jenkins', phone: '+1 (555) 012-7065', location: 'Fresno, CA', createdAt: '2026-03-24T14:45:00Z' },
  { id: 'FMR-105', name: 'Robert Chen', phone: '+1 (555) 015-3329', location: 'Willamette Valley, OR', createdAt: '2026-04-02T10:00:00Z' },
];

export const INITIAL_FIELDS: Field[] = [
  { id: 'FLD-201', farmerId: 'FMR-101', name: 'North Ridge Valley', area: 120, location: 'Zone A - Upper Slope', createdAt: '2026-01-16T10:00:00Z' },
  { id: 'FLD-202', farmerId: 'FMR-101', name: 'South Spring Meadow', area: 85, location: 'Zone B - Basin', createdAt: '2026-01-16T11:30:00Z' },
  { id: 'FLD-203', farmerId: 'FMR-102', name: 'East Orchard Flat', area: 150, location: 'Sector 4 - Alluvial', createdAt: '2026-02-12T09:15:00Z' },
  { id: 'FLD-204', farmerId: 'FMR-103', name: 'West Corn Plain', area: 240, location: 'Grid Prairie - Section 2', createdAt: '2026-03-06T08:00:00Z' },
  { id: 'FLD-205', farmerId: 'FMR-104', name: 'Central Vine Patch', area: 45, location: 'Terrace Hill - South', createdAt: '2026-03-25T13:20:00Z' },
  { id: 'FLD-206', farmerId: 'FMR-105', name: 'River Alfalfa Plot', area: 95, location: 'Low Riverbed Reach', createdAt: '2026-04-03T11:00:00Z' },
];

export const INITIAL_CROPS: Crop[] = [
  { id: 'CRP-301', fieldId: 'FLD-201', name: 'Organic Almonds', plantingDate: '2025-11-20', status: 'Growing', expectedYield: 42.5 },
  { id: 'CRP-302', fieldId: 'FLD-202', name: 'Baby Leaf Spinach', plantingDate: '2026-04-10', status: 'Planting', expectedYield: 15.0 },
  { id: 'CRP-303', fieldId: 'FLD-203', name: 'Honeycrisp Apples', plantingDate: '2024-03-12', status: 'Growing', expectedYield: 110.0 },
  { id: 'CRP-304', fieldId: 'FLD-204', name: 'Sweet Feed Corn', plantingDate: '2026-03-15', status: 'Growing', expectedYield: 480.0 },
  { id: 'CRP-305', fieldId: 'FLD-205', name: 'Chardonnay Grapes', plantingDate: '2024-04-10', status: 'Growing', expectedYield: 32.0 },
  { id: 'CRP-306', fieldId: 'FLD-206', name: 'Premium Alfalfa', plantingDate: '2026-04-05', status: 'Growing', expectedYield: 75.0 },
];

// Historical database readouts for dynamic sensor graph displays
export const INITIAL_SENSOR_DATA: SensorData[] = [
  // North Ridge Valley (FLD-201)
  { id: 'SNS-401', fieldId: 'FLD-201', temperature: 28.5, humidity: 62.4, soilMoisture: 38.2, soilPH: 6.8, dateTime: '2026-06-08T16:00:00Z' },
  { id: 'SNS-402', fieldId: 'FLD-201', temperature: 29.2, humidity: 60.1, soilMoisture: 36.8, soilPH: 6.8, dateTime: '2026-06-08T17:00:00Z' },
  { id: 'SNS-403', fieldId: 'FLD-201', temperature: 27.8, humidity: 65.5, soilMoisture: 35.1, soilPH: 6.7, dateTime: '2026-06-08T18:00:00Z' },
  
  // South Spring Meadow (FLD-202) -> Moisture Critical (<30%)
  { id: 'SNS-404', fieldId: 'FLD-202', temperature: 31.4, humidity: 55.2, soilMoisture: 28.4, soilPH: 6.1, dateTime: '2026-06-08T16:00:00Z' },
  { id: 'SNS-405', fieldId: 'FLD-202', temperature: 32.8, humidity: 52.0, soilMoisture: 26.1, soilPH: 6.1, dateTime: '2026-06-08T17:00:00Z' },
  { id: 'SNS-406', fieldId: 'FLD-202', temperature: 33.1, humidity: 49.8, soilMoisture: 24.5, soilPH: 6.0, dateTime: '2026-06-08T18:00:00Z' },

  // East Orchard Flat (FLD-203) -> High Alkalinity pH (>8.0)
  { id: 'SNS-407', fieldId: 'FLD-203', temperature: 24.1, humidity: 72.8, soilMoisture: 48.0, soilPH: 8.3, dateTime: '2026-06-08T16:00:00Z' },
  { id: 'SNS-408', fieldId: 'FLD-203', temperature: 24.5, humidity: 71.0, soilMoisture: 47.2, soilPH: 8.4, dateTime: '2026-06-08T17:00:00Z' },
  
  // West Corn Plain (FLD-204) -> Ideal Healthy Conditions
  { id: 'SNS-409', fieldId: 'FLD-204', temperature: 26.2, humidity: 68.0, soilMoisture: 44.5, soilPH: 7.0, dateTime: '2026-06-08T17:00:00Z' },
  
  // Central Vine Patch (FLD-205) -> Extremely High Temp (>35°C) & Low pH (<6.0)
  { id: 'SNS-410', fieldId: 'FLD-205', temperature: 37.2, humidity: 35.1, soilMoisture: 32.4, soilPH: 5.4, dateTime: '2026-06-08T16:00:00Z' },
  { id: 'SNS-411', fieldId: 'FLD-205', temperature: 38.5, humidity: 32.0, soilMoisture: 30.5, soilPH: 5.3, dateTime: '2026-06-08T17:00:00Z' },
  
  // River Alfalfa Plot (FLD-206)
  { id: 'SNS-412', fieldId: 'FLD-206', temperature: 25.8, humidity: 70.4, soilMoisture: 52.1, soilPH: 7.2, dateTime: '2026-06-08T17:00:00Z' },
];

export const INITIAL_LOGS: SystemLog[] = [
  { id: 'LOG-001', type: 'success', category: 'system', message: 'FarmSense online. Loaded 6 active telemetry sensors successfully.', timestamp: '2026-06-08T12:00:00Z' },
  { id: 'LOG-002', type: 'info', category: 'field', message: 'Field North Ridge Valley updated by Operator.', timestamp: '2026-06-08T14:35:00Z' },
  { id: 'LOG-003', type: 'warn', category: 'sensor', message: 'Low Soil Moisture (24.5%) alert activated for South Spring Meadow.', timestamp: '2026-06-08T15:10:00Z' },
  { id: 'LOG-004', type: 'warn', category: 'sensor', message: 'Acidic Soil pH (5.3) detected in Central Vine Patch sensor readings.', timestamp: '2026-06-08T16:30:00Z' },
  { id: 'LOG-005', type: 'error', category: 'sensor', message: 'Over-temperature flag (38.5°C) flagged on Central Vine Patch node CRF-05.', timestamp: '2026-06-08T17:00:00Z' },
];

export const DEFAULT_THRESHOLDS: ThresholdSettings = {
  minSoilMoisture: 30, // %
  minSoilPH: 6.0,
  maxSoilPH: 8.0,
  maxTemperature: 35, // °C
};

// Utilities to manage local storage
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const value = localStorage.getItem(`farmsense_${key}`);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error loading state from localStorage for farmsense_${key}`, error);
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`farmsense_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving state to localStorage for farmsense_${key}`, error);
  }
};
