import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Bus as BusIcon, User, Clock, AlertTriangle } from 'lucide-react';

export const RouteMonitoring: React.FC = () => {
  const { routes, buses } = useApp();

  return (
    <div className="space-y-6 pb-8">
      
      {/* Header */}
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-lg text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Route Network & Fleet Overview</h1>
            <p className="text-xs text-slate-400 mt-0.5">Live monitoring of active college bus routes, driver assignments, and ETAs.</p>
          </div>
        </div>
      </div>

      {/* Route Monitoring Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 rounded-l-lg">Route Code & Name</th>
                <th className="p-4">Assigned Bus</th>
                <th className="p-4">Assigned Driver</th>
                <th className="p-4">Status</th>
                <th className="p-4">Occupancy</th>
                <th className="p-4 rounded-r-lg">Est. Arrival</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {routes.map((route) => {
                const bus = buses.find((b) => b.routeId === route.id) || buses[0];

                return (
                  <tr key={route.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="text-sm font-bold text-slate-900">{route.code}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{route.name}</div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-700">{bus.busNumber}</td>
                    <td className="p-4 text-slate-700">{bus.driverName}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          bus.status === 'On Route'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : bus.status === 'Breakdown' || bus.status === 'Emergency'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {bus.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-800">{bus.currentOccupancy} / {bus.capacity} Seats</td>
                    <td className="p-4 font-mono text-amber-700 font-bold">
                      {bus.status === 'On Route' ? '12 min' : 'At Terminal'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
