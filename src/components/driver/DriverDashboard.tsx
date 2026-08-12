import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SimulatedMap } from '../map/SimulatedMap';
import { EmergencyModal } from './EmergencyModal';
import { Truck, Play, Pause, Square, AlertTriangle, ShieldAlert, Phone, Navigation, CheckCircle2, User, Clock, MapPin } from 'lucide-react';
import { Incident } from '../../types';

export const DriverDashboard: React.FC = () => {
  const { currentDriver, buses, routes, tripState, startTrip, pauseTrip, endTrip, reportIncident } = useApp();
  const [selectedEmergency, setSelectedEmergency] = useState<Incident['type'] | null>(null);
  const [reportedMessage, setReportedMessage] = useState<string | null>(null);

  const assignedBus = buses.find((b) => b.id === currentDriver.assignedBusId) || buses[0];
  const assignedRoute = routes.find((r) => r.id === currentDriver.assignedRouteId) || routes[0];

  const handleConfirmEmergency = (desc: string) => {
    if (selectedEmergency) {
      reportIncident(selectedEmergency, desc);
      setReportedMessage(`Incident (${selectedEmergency}) reported successfully. Administrator notified.`);
      setSelectedEmergency(null);
      setTimeout(() => setReportedMessage(null), 5000);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      
      {/* Top Banner & Driver Assignment Info */}
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-lg text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentDriver.photoUrl}
            alt={currentDriver.name}
            className="w-16 h-16 rounded-xl object-cover ring-2 ring-indigo-500/40 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{currentDriver.name}</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                DRIVER CONSOLE
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3">
              <span>Assigned Bus: <strong className="text-white font-mono">{assignedBus.busNumber} ({assignedBus.registrationNumber})</strong></span>
              <span>•</span>
              <span>Route: <strong className="text-blue-300 font-semibold">{assignedRoute.code} ({assignedRoute.name})</strong></span>
            </div>
          </div>
        </div>

        {/* Trip Status Indicator */}
        <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 shrink-0 text-center sm:text-right">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trip Operational Status</div>
          <div className="text-sm font-bold mt-1 flex items-center justify-center sm:justify-end gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                assignedBus.status === 'On Route'
                  ? 'bg-emerald-400 animate-ping'
                  : assignedBus.status === 'Trip Completed'
                  ? 'bg-blue-400'
                  : 'bg-amber-400'
              }`}
            />
            <span
              className={
                assignedBus.status === 'On Route'
                  ? 'text-emerald-400'
                  : assignedBus.status === 'Trip Completed'
                  ? 'text-blue-400'
                  : 'text-amber-400'
              }
            >
              {assignedBus.status}
            </span>
          </div>
        </div>
      </div>

      {reportedMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{reportedMessage}</span>
        </div>
      )}

      {/* Prominent Trip Control Buttons */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-slate-800 space-y-4">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-600" /> Today's Trip Commands (College → Kothrud)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => startTrip('bus-a101')}
            disabled={assignedBus.status === 'On Route' && !tripState.isPaused}
            className="py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>START TRIP</span>
          </button>

          <button
            onClick={() => pauseTrip('bus-a101')}
            disabled={assignedBus.status !== 'On Route'}
            className="py-3.5 px-6 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition flex items-center justify-center gap-2"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>{tripState.isPaused ? 'RESUME TRIP' : 'PAUSE TRIP'}</span>
          </button>

          <button
            onClick={() => endTrip('bus-a101')}
            disabled={assignedBus.status === 'Trip Completed'}
            className="py-3.5 px-6 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition flex items-center justify-center gap-2"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>END TRIP</span>
          </button>
        </div>
      </div>

      {/* Driver Emergency / SOS Section */}
      <div className="bg-rose-50 rounded-xl border border-rose-200 p-6 shadow-xs text-rose-950 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-600 animate-pulse" />
            <div>
              <h2 className="text-sm font-bold text-rose-900">DRIVER EMERGENCY & SOS SYSTEM</h2>
              <p className="text-xs text-rose-700">Tap any button to dispatch an emergency SOS to Administrator & Students.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(['ACCIDENT', 'BREAKDOWN', 'MEDICAL EMERGENCY', 'OTHER ISSUE', 'SOS'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedEmergency(type)}
              className="py-3 px-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow-sm transition flex flex-col items-center justify-center gap-1.5 hover:scale-105"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Driver Live Route Map View */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Route Map View</h3>
        <SimulatedMap />
      </div>

      {/* Emergency Confirmation Modal */}
      {selectedEmergency && (
        <EmergencyModal
          type={selectedEmergency}
          onClose={() => setSelectedEmergency(null)}
          onConfirm={handleConfirmEmergency}
        />
      )}

    </div>
  );
};
