/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  location: string;
  createdAt: string;
}

export interface Field {
  id: string;
  farmerId: string;
  name: string;
  area: number; // in acres
  location: string;
  createdAt: string;
}

export interface Crop {
  id: string;
  fieldId: string;
  name: string;
  plantingDate: string;
  status: 'Planting' | 'Growing' | 'Harvesting' | 'Harvested';
  expectedYield?: number; // in tons
}

export interface SensorData {
  id: string;
  fieldId: string;
  temperature: number; // °C
  humidity: number; // %
  soilMoisture: number; // %
  soilPH: number;
  dateTime: string;
}

export interface Recommendation {
  id: string;
  fieldId: string;
  fieldName: string;
  type: 'watering' | 'soil' | 'critical' | 'info';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  thresholdValue: string;
  actionTaken: boolean;
  createdAt: string;
}

export interface SystemLog {
  id: string;
  type: 'info' | 'success' | 'warn' | 'error';
  category: 'farmer' | 'field' | 'crop' | 'sensor' | 'system';
  message: string;
  timestamp: string;
}

export interface User {
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface ThresholdSettings {
  minSoilMoisture: number; // default: 30%
  minSoilPH: number;      // default: 6.0
  maxSoilPH: number;      // default: 8.0
  maxTemperature: number;  // default: 35%
}
