import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SimulatedMap } from '../map/SimulatedMap';
import { Bus as BusIcon, Phone, User, Clock, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { Bus, BusStatus } from '../../types';

export const LiveFleetMap: React.FC = () => {
  const { buses, updateBusStatus } = useApp();
  const [selectedBus, setSelectedBus] = useState<Bus>(buses[0]);

  return (
    <div className="space-y-6 pb-8">
      
      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">Central Live Fleet Map</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              ALL BUSES MONITORING
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Click any bus on the map or select from list below to view telemetry and driver controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {buses.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBus(b)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                selectedBus.id === b.id
                  ? 'bg-blue-600 border-blue-400 text-white shadow'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Bus {b.busNumber}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Vector Map */}
        <div className="lg:col-span-2">
          <SimulatedMap
            showAllFleet={true}
            onSelectBus={(bus) => setSelectedBus(bus)}
            selectedBusId={selectedBus.id}
          />
        </div>

        {/* Selected Bus Telemetry Inspector Drawer */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl text-white space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                <BusIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">BUS {selectedBus.busNumber}</h2>
                <span className="text-xs font-mono text-slate-400">{selectedBus.registrationNumber}</span>
              </div>
            </div>

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                selectedBus.status === 'On Route'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : selectedBus.status === 'Breakdown' || selectedBus.status === 'Emergency'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {selectedBus.status}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400 font-semibold">Assigned Driver:</span>
              <strong className="text-white font-bold">{selectedBus.driverName}</strong>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400 font-semibold">Driver Contact:</span>
              <a href={`tel:${selectedBus.driverPhone}`} className="text-blue-400 font-bold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span>{selectedBus.driverPhone}</span>
              </a>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400 font-semibold">Assigned Route:</span>
              <strong className="text-blue-400 font-bold">{selectedBus.routeName}</strong>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400 font-semibold">Speed:</span>
              <strong className="text-emerald-400 font-bold">{selectedBus.speedKmH} km/h</strong>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400 font-semibold">Occupancy:</span>
              <strong className="text-amber-400 font-bold">{selectedBus.currentOccupancy} / {selectedBus.capacity} Passengers</strong>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400 font-semibold">Last GPS Ping:</span>
              <span className="text-slate-300 font-mono">{selectedBus.lastUpdated}</span>
            </div>
          </div>

          {/* Quick Override Bus Status Command */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Admin Override Bus Status</label>
            <div className="grid grid-cols-2 gap-2">
              {(['At College', 'On Route', 'Delayed', 'Breakdown'] as BusStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => updateBusStatus(selectedBus.id, status)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition border ${
                    selectedBus.status === status
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
