import React from 'react';
import { useApp } from '../../context/AppContext';
import { SimulatedMap } from '../map/SimulatedMap';
import { RouteTimeline } from '../common/RouteTimeline';
import { StudentSelector } from '../common/StudentSelector';
import { MapPin, Phone, Clock } from 'lucide-react';

export const LiveTrackingView: React.FC = () => {
  const { buses, routes, currentStudent, getTripStateForBus } = useApp();

  const assignedBus = buses.find((bus) => bus.id === currentStudent.assignedBusId) || buses[0];
  const assignedRoute = routes.find((route) => route.id === currentStudent.assignedRouteId) || routes[0];
  const studentTripState = getTripStateForBus(assignedBus.id);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950 p-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-black text-white">Live GPS Bus Tracking</h1>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
              Live
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Tracking bus <strong className="text-white">{assignedBus.busNumber}</strong> on {assignedRoute.name}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <StudentSelector />
          <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs">
            <span className="text-slate-400 font-medium">Driver:</span>
            <strong className="text-slate-200">{assignedBus.driverName}</strong>
            <a href={`tel:${assignedBus.driverPhone}`} className="ml-1 font-mono text-blue-400 hover:text-blue-300">
              ({assignedBus.driverPhone})
            </a>
          </div>
        </div>
      </div>

      <SimulatedMap busId={assignedBus.id} tripState={studentTripState} />

      <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-3">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-blue-600" /> ETA
          </div>
          <div className="mt-1 text-lg font-black text-slate-900">~{studentTripState.etaNextStopMin ?? 0} min</div>
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-amber-600" /> Current stop
          </div>
          <div className="mt-1 text-lg font-black text-slate-900">{studentTripState.currentStopName || assignedRoute.startPoint}</div>
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" /> Next stop
          </div>
          <div className="mt-1 text-lg font-black text-slate-900">{studentTripState.nextStopName || assignedRoute.endPoint}</div>
        </div>
      </div>

      <RouteTimeline route={assignedRoute} tripState={studentTripState} title="Route Tracking Timeline" />
    </div>
  );
};
