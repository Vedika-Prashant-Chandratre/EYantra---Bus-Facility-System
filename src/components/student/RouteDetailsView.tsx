import React from 'react';
import { useApp } from '../../context/AppContext';
import { RouteTimeline } from '../common/RouteTimeline';
import { StudentSelector } from '../common/StudentSelector';
import { MapPin, Phone } from 'lucide-react';

export const RouteDetailsView: React.FC = () => {
  const { routes, buses, currentStudent, getTripStateForBus } = useApp();

  const assignedRoute = routes.find((route) => route.id === currentStudent.assignedRouteId) || routes[0];
  const assignedBus = buses.find((bus) => bus.id === currentStudent.assignedBusId) || buses[0];
  const studentTripState = getTripStateForBus(assignedBus.id);

  return (
    <div className="space-y-6 pb-8">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-2xl">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300">Assigned bus route</div>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                {assignedRoute.code} · {assignedRoute.name}
              </h1>
              <p className="mt-2 text-xs text-slate-300">
                Terminal: {assignedRoute.startPoint} · Destination: {assignedRoute.endPoint}
              </p>
            </div>

            <StudentSelector className="border-slate-700 bg-slate-900 text-white [&_span]:text-slate-400 [&_select]:border-slate-700 [&_select]:bg-slate-950 [&_select]:text-white" />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-xs">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Bus</div>
              <div className="mt-1 text-sm font-black text-white">{assignedBus.busNumber}</div>
              <div className="mt-1 text-slate-400">{assignedBus.registrationNumber}</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-xs">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Driver</div>
              <div className="mt-1 text-sm font-black text-white">{assignedBus.driverName}</div>
              <a href={`tel:${assignedBus.driverPhone}`} className="mt-1 inline-flex items-center gap-1 text-slate-300 transition hover:text-white">
                <Phone className="h-3.5 w-3.5" /> {assignedBus.driverPhone}
              </a>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-xs">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Live status</div>
              <div className="mt-1 text-sm font-black text-white">{studentTripState.tripStatus}</div>
              <div className="mt-1 text-slate-400">ETA ~{studentTripState.etaNextStopMin ?? 0} min</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-slate-500">
          <MapPin className="h-4 w-4 text-blue-600" /> Route overview
        </div>
        <p className="mt-2 text-sm text-slate-600">
          The route timeline below follows the same live trip state used by the driver and student tracking screens.
        </p>
      </div>

      <RouteTimeline route={assignedRoute} tripState={studentTripState} />
    </div>
  );
};
