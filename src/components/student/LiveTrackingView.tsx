import React from 'react';
import { useApp } from '../../context/AppContext';
import { SimulatedMap } from '../map/SimulatedMap';
import { MapPin, Clock, Phone, AlertCircle, ShieldCheck } from 'lucide-react';

export const LiveTrackingView: React.FC = () => {
  const { buses, routes, currentStudent } = useApp();

  const assignedBus = buses.find((b) => b.id === currentStudent.assignedBusId) || buses[0];
  const assignedRoute = routes.find((r) => r.id === currentStudent.assignedRouteId) || routes[0];

  return (
    <div className="space-y-6 pb-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">Live GPS Bus Tracking</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live • Updated just now
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking Bus <strong className="text-white">{assignedBus.busNumber}</strong> on {assignedRoute.name}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">Driver:</span>
          <strong className="text-slate-200">{assignedBus.driverName}</strong>
          <a href={`tel:${assignedBus.driverPhone}`} className="text-blue-400 hover:text-blue-300 ml-1 font-mono">
            ({assignedBus.driverPhone})
          </a>
        </div>
      </div>

      {/* Main Vector Map Simulation Canvas */}
      <SimulatedMap />

      {/* Stop Sequence Progress Tracker */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl text-white space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-400" /> Route Stops Timeline
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {assignedRoute.stops.map((stop, idx) => {
            const isPassed = idx <= assignedBus.currentStopIndex;
            const isCurrent = idx === assignedBus.currentStopIndex;
            const isNext = idx === assignedBus.currentStopIndex + 1;

            return (
              <div key={stop.id} className="relative flex items-center justify-between gap-4">
                {/* Timeline Dot */}
                <span
                  className={`absolute -left-6 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-amber-500 border-white text-slate-950 animate-bounce'
                      : isPassed
                      ? 'bg-emerald-500 border-emerald-300 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                >
                  {isPassed ? '✓' : idx + 1}
                </span>

                <div>
                  <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span>{stop.name}</span>
                    {isCurrent && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        BUS AT STOP
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {stop.estimatedMinutesFromStart === 0
                      ? 'Departure Terminal'
                      : `~${stop.estimatedMinutesFromStart} min from start`}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      isPassed
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                        : isNext
                        ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                        : 'bg-slate-950 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {isPassed ? 'Departed' : isNext ? 'Arriving Soon' : 'Upcoming'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
