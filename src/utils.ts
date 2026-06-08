/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Field, SensorData, Recommendation, ThresholdSettings, Farmer, Crop, SystemLog } from './types';

/**
 * Calculates current recommendations and alert statuses dynamically based on 
 * the latest sensor data per field against threshold settings.
 */
export function calculateDynamicRecommendations(
  fields: Field[],
  sensors: SensorData[],
  settings: ThresholdSettings
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const field of fields) {
    // Get the latest sensor reading for this specific field
    const fieldReadings = sensors
      .filter((s) => s.fieldId === field.id)
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

    if (fieldReadings.length === 0) continue;

    const lastReading = fieldReadings[0];

    // Check 1: Soil Moisture Alert (< minSoilMoisture)
    if (lastReading.soilMoisture < settings.minSoilMoisture) {
      recommendations.push({
        id: `REC-${field.id}-MOIST`,
        fieldId: field.id,
        fieldName: field.name,
        type: 'watering',
        title: 'Critical Irrigation Required',
        description: `Soil moisture levels are at ${lastReading.soilMoisture}% (Threshold is < ${settings.minSoilMoisture}%). Activate primary drip line emitters to avoid crop water stress.`,
        severity: lastReading.soilMoisture < 20 ? 'critical' : 'high',
        thresholdValue: `< ${settings.minSoilMoisture}%`,
        actionTaken: false,
        createdAt: lastReading.dateTime,
      });
    }

    // Check 2: Soil pH Low (< minSoilPH)
    if (lastReading.soilPH < settings.minSoilPH) {
      recommendations.push({
        id: `REC-${field.id}-PH-LOW`,
        fieldId: field.id,
        fieldName: field.name,
        type: 'soil',
        title: 'Soil Alkalinity Boost Needed',
        description: `Soil pH values have dipped to ${lastReading.soilPH} (Limit is ${settings.minSoilPH}). Apply calcium carbonate (Lime) at 2 to 3 lbs per 100 sq.ft to neutralize acidity.`,
        severity: 'medium',
        thresholdValue: `< ${settings.minSoilPH}`,
        actionTaken: false,
        createdAt: lastReading.dateTime,
      });
    }

    // Check 3: Soil pH High (> maxSoilPH)
    if (lastReading.soilPH > settings.maxSoilPH) {
      recommendations.push({
        id: `REC-${field.id}-PH-HIGH`,
        fieldId: field.id,
        fieldName: field.name,
        type: 'soil',
        title: 'Soil Acidification Needed',
        description: `Soil alkaline levels are elevated at pH ${lastReading.soilPH} (Limit is ${settings.maxSoilPH}). Apply elemental sulfur or organic acidifiers to lower pH to safe ranges.`,
        severity: 'medium',
        thresholdValue: `> ${settings.maxSoilPH}`,
        actionTaken: false,
        createdAt: lastReading.dateTime,
      });
    }

    // Check 4: Temperature High (> maxTemperature)
    if (lastReading.temperature > settings.maxTemperature) {
      recommendations.push({
        id: `REC-${field.id}-TEMP`,
        fieldId: field.id,
        fieldName: field.name,
        type: 'critical',
        title: 'Extreme Heat & Evaporative Strain',
        description: `Sensor registers ${lastReading.temperature}°C ambient thermal loading (Threshold is ${settings.maxTemperature}°C). Spray fine overhead misting or provide temporary shade clothes to restrict leaf scorch.`,
        severity: 'high',
        thresholdValue: `> ${settings.maxTemperature}°C`,
        actionTaken: false,
        createdAt: lastReading.dateTime,
      });
    }
  }

  return recommendations;
}

/**
 * Returns weather report information based on geographic constraints
 */
export function getMockWeather() {
  return {
    temp: 26.8,
    humidity: 58,
    windSpeed: 12.4, // km/h
    condition: 'Sunny with Moderate Breeze',
    iconName: 'Sun',
    uvIndex: 7,
    moistureIndex: 'Moderate',
    forecast: [
      { day: 'Mon', temp: 28, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 29, condition: 'Clear', icon: 'Sun' },
      { day: 'Wed', temp: 31, condition: 'Warm Breezes', icon: 'Wind' },
      { day: 'Thu', temp: 27, condition: 'Overcast', icon: 'Cloud' },
      { day: 'Fri', temp: 25, condition: 'Light Shower', icon: 'CloudRain' },
    ],
  };
}

/**
 * Trigger simulated computer CSV/PDF download in browser
 */
export function simulateDownloadFile(
  filename: string,
  headers: string[],
  rows: string[][]
) {
  // Direct CSV Generation
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
