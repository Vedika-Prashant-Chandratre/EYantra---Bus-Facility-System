import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Clock, Bus as BusIcon, User, Phone, CheckCircle2, Navigation } from 'lucide-react';

export const RouteDetailsView: React.FC = () => {
  const { routes, buses, currentStudent } = useApp();

  const assignedRoute = routes.find((r) => r.id === currentStudent.assignedRouteId) || routes[0];
  const assignedBus = buses.find((b) => b.id === currentStudent.assignedBusId) || buses[0];

  return (
    <div className="space-y-6 pb-8">
      
      {/* Route Header */}
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-lg text-white space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest">ASSIGNED BUS ROUTE</div>
            <h1 className="text-2xl font-bold text-white mt-0.5">{assignedRoute.code} – {assignedRoute.name}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Terminal: {assignedRoute.startPoint} ➔ Destination: {assignedRoute.endPoint}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/90 p-3 rounded-xl border border-slate-700 text-xs font-semibold">
            <span className="text-slate-400">Total Distance:</span>
            <span className="text-blue-300 font-bold">{assignedRoute.distanceKm} km</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Duration:</span>
            <span className="text-amber-400 font-bold">{assignedRoute.totalDurationMin} min</span>
          </div>
        </div>

        {/* Driver & Bus Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Assigned Bus:</span>
            <strong className="text-slate-100 text-sm font-bold">{assignedBus.busNumber} ({assignedBus.registrationNumber})</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Bus Driver:</span>
            <strong className="text-slate-100 text-sm font-bold">{assignedBus.driverName}</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Contact Number:</span>
            <a href={`tel:${assignedBus.driverPhone}`} className="text-blue-300 hover:text-blue-200 font-bold flex items-center gap-1 mt-0.5">
              <Phone className="w-3.5 h-3.5" />
              <span>{assignedBus.driverPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Stops Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" /> Route Stops & Arrival Schedule
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 rounded-l-lg">#</th>
                <th className="p-3.5">Stop Name</th>
                <th className="p-3.5">Estimated Arrival</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {assignedRoute.stops.map((stop, index) => {
                const isPassed = index <= assignedBus.currentStopIndex;
                const isNext = index === assignedBus.currentStopIndex + 1;

                return (
                  <tr key={stop.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-bold text-slate-400">{index + 1}</td>
                    <td className="p-3.5 text-slate-900 font-bold flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isPassed ? 'bg-emerald-500' : isNext ? 'bg-amber-500' : 'bg-slate-300'}`} />
                      {stop.name}
                    </td>
                    <td className="p-3.5 text-slate-600 font-mono">
                      {stop.estimatedMinutesFromStart === 0
                        ? '08:00 AM (Departed)'
                        : `${stop.estimatedMinutesFromStart} min from start`}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          isPassed
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isNext
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {isPassed ? 'Departed' : isNext ? 'Arriving Soon' : 'Upcoming'}
                      </span>
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
