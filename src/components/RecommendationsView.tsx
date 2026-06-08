/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lightbulb, AlertTriangle, CheckCircle, Droplets, SprayCan, HelpCircle, Thermometer, Filter } from 'lucide-react';
import { Recommendation } from '../types';

interface RecommendationsViewProps {
  recommendations: Recommendation[];
  onSolveRecommendation: (recId: string) => void;
}

export default function RecommendationsView({
  recommendations,
  onSolveRecommendation,
}: RecommendationsViewProps) {
  const [filterType, setFilterType] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');

  const filteredRecs = recommendations.filter((r) => {
    if (filterType === 'unresolved') return !r.actionTaken;
    if (filterType === 'resolved') return r.actionTaken;
    return true;
  });

  const getIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'watering':
        return <Droplets className="h-5 w-5 text-blue-600 animate-bounce" />;
      case 'soil':
        return <Lightbulb className="h-5 w-5 text-amber-600" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSeverityBadge = (severity: Recommendation['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-red-700 bg-red-100 border-red-500/20';
      case 'high':
        return 'text-amber-800 bg-amber-100 border-amber-500/20';
      case 'medium':
        return 'text-blue-700 bg-blue-100 border-blue-500/20';
      default:
        return 'text-emerald-700 bg-emerald-50 border-emerald-500/20';
    }
  };

  const getBackgroundGradient = (severity: Recommendation['severity'], actionTaken: boolean) => {
    if (actionTaken) return 'bg-gray-50/50 border-gray-150';
    switch (severity) {
      case 'critical':
        return 'bg-gradient-to-br from-red-50/70 to-white border-red-200/60 shadow-red-50/10';
      case 'high':
        return 'bg-gradient-to-br from-amber-50/50 to-white border-amber-200/50 shadow-amber-50/10';
      default:
        return 'bg-gradient-to-br from-emerald-50/30 to-white border-emerald-100/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* View Title */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Actionable Rule Engine</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Dynamic decision support calculated instantly from IoT hygrometer moisture logs and pH sensor records.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 rounded-xl border border-gray-150 bg-white p-1 shadow-sm shrink-0">
          <button
            onClick={() => setFilterType('unresolved')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filterType === 'unresolved'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Pending ({recommendations.filter(r => !r.actionTaken).length})
          </button>
          <button
            onClick={() => setFilterType('resolved')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filterType === 'resolved'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Acknowledged ({recommendations.filter(r => r.actionTaken).length})
          </button>
          <button
            onClick={() => setFilterType('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            All Logs
          </button>
        </div>
      </div>

      {/* Main recommendation feed listing */}
      <div className="space-y-4">
        {filteredRecs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-400">
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-500 stroke-[1.2] mb-3" />
            <p className="text-xs font-black text-gray-800">Clear Operating Queue</p>
            <p className="text-[11px] text-gray-400 max-w-sm mx-auto mt-1">
              No matching recommendations found for selection. All agronomy variables are reporting healthy bounds.
            </p>
          </div>
        ) : (
          filteredRecs.map((rec) => (
            <div
              key={rec.id}
              className={`rounded-2xl border p-5 shadow-sm transition-all flex flex-col justify-between gap-4 md:flex-row md:items-center ${getBackgroundGradient(
                rec.severity,
                rec.actionTaken
              )}`}
            >
              {/* Primary text content */}
              <div className="flex gap-4 items-start">
                <div
                  className={`rounded-xl p-3 shrink-0 ${
                    rec.actionTaken
                      ? 'bg-gray-100 text-gray-400'
                      : rec.severity === 'critical'
                      ? 'bg-red-50 text-red-650'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {rec.actionTaken ? <CheckCircle className="h-5 w-5" /> : getIcon(rec.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getSeverityBadge(
                        rec.severity
                      )}`}
                    >
                      {rec.severity}
                    </span>
                    <span className="font-mono text-[10px] text-gray-400 font-bold">
                      Field: <span className="text-gray-600">{rec.fieldName}</span> ({rec.fieldId})
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Log origin: {new Date(rec.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className={`font-bold text-sm ${rec.actionTaken ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                    {rec.title}
                  </h3>
                  <p className={`text-xs ${rec.actionTaken ? 'text-gray-400' : 'text-gray-550'}`}>
                    {rec.description}
                  </p>
                  <p className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 inline-block px-1.5 py-0.2 rounded mt-1">
                    Telemetry Trigger Condition: {rec.thresholdValue}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="shrink-0 flex items-center gap-2 pt-2 md:pt-0">
                {rec.actionTaken ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 font-mono bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-500/10">
                    <CheckCircle className="h-4 w-4" />
                    Applied
                  </span>
                ) : (
                  <button
                    onClick={() => onSolveRecommendation(rec.id)}
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold text-white transition shadow-sm ${
                      rec.severity === 'critical'
                        ? 'bg-red-600 hover:bg-red-700 shadow-red-600/10'
                        : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10'
                    }`}
                  >
                    {rec.type === 'watering' ? 'Acknowledge Drip Irrigation' : 'Verify Intervention'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
