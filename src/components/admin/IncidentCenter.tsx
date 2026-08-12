import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, ShieldAlert, CheckCircle2, Clock, MapPin, User, Phone, Check } from 'lucide-react';

export const IncidentCenter: React.FC = () => {
  const { incidents, acknowledgeIncident, resolveIncident } = useApp();
  const [viewTab, setViewTab] = useState<'active' | 'resolved'>('active');

  const activeIncidents = incidents.filter((i) => i.status !== 'Resolved');
  const resolvedIncidents = incidents.filter((i) => i.status === 'Resolved');

  return (
    <div className="space-y-6 pb-8">
      
      {/* Header */}
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-lg text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Emergency & Incident Control Center</h1>
            <p className="text-xs text-slate-400 mt-0.5">Real-time driver SOS alerts, breakdowns, accidents & resolution logging.</p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="bg-slate-800/80 p-1 rounded-lg border border-slate-700 flex items-center gap-1">
          <button
            onClick={() => setViewTab('active')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              viewTab === 'active' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Active Incidents ({activeIncidents.length})
          </button>
          <button
            onClick={() => setViewTab('resolved')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              viewTab === 'resolved' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Resolved History ({resolvedIncidents.length})
          </button>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {viewTab === 'active' ? (
          activeIncidents.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No Active Emergency Incidents</h3>
              <p className="text-xs text-slate-500 mt-1">All college buses are operating normally with zero reported issues.</p>
            </div>
          ) : (
            activeIncidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-white border-2 border-rose-500 rounded-xl p-6 shadow-sm text-slate-800 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white animate-pulse">
                      CRITICAL • {inc.type}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">BUS {inc.busNumber}</h3>
                  </div>

                  <span className="text-xs text-slate-500 font-mono font-semibold">Reported: {inc.timestamp}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block font-semibold">Driver Name:</span>
                    <strong className="text-slate-900 text-sm font-bold">{inc.driverName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">Route Assignment:</span>
                    <strong className="text-blue-600 text-sm font-bold">{inc.routeName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">GPS Location:</span>
                    <strong className="text-amber-700 text-sm font-bold">{inc.locationName}</strong>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-500 block mb-1">Driver Description:</span>
                  <p>{inc.description}</p>
                </div>

                {/* Command Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  {inc.status === 'Reported' && (
                    <button
                      onClick={() => acknowledgeIncident(inc.id)}
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg shadow-sm transition"
                    >
                      Acknowledge Incident
                    </button>
                  )}

                  <button
                    onClick={() => resolveIncident(inc.id)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Resolve & Clear Alert
                  </button>
                </div>
              </div>
            ))
          )
        ) : (
          resolvedIncidents.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-xs shadow-sm">
              No historical resolved incidents.
            </div>
          ) : (
            resolvedIncidents.map((inc) => (
              <div key={inc.id} className="bg-white border border-slate-200 rounded-xl p-5 text-slate-800 text-xs space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700">RESOLVED: {inc.type} (Bus {inc.busNumber})</span>
                  <span className="text-slate-500">{inc.resolvedAt}</span>
                </div>
                <p className="text-slate-600">{inc.description}</p>
              </div>
            ))
          )
        )}
      </div>

    </div>
  );
};
