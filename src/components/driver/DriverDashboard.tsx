import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SimulatedMap } from '../map/SimulatedMap';
import { RouteTimeline } from '../common/RouteTimeline';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Pause,
  Play,
  Route,
  ShieldAlert,
  Square,
  Truck,
} from 'lucide-react';

export const DriverDashboard: React.FC = () => {
  const {
    selectedDriverId,
    selectDriver,
    currentDriver,
    buses,
    routes,
    tripState,
    startTrip,
    pauseTrip,
    resumeTrip,
    endTrip,
    reportDelay,
    reportBreakdown,
    reportEmergency,
    triggerSOS,
  } = useApp();
  const [reportedMessage, setReportedMessage] = useState<string | null>(null);

  const assignedBus = buses.find((bus) => bus.id === currentDriver.assignedBusId) || buses[0];
  const assignedRoute = routes.find((route) => route.id === currentDriver.assignedRouteId) || routes[0];

  const currentStopLabel = tripState.currentLocationLabel || tripState.currentStopName || assignedRoute.startPoint;
  const nextStopLabel = tripState.nextStopName || assignedRoute.endPoint;
  const distanceLabel = `${(tripState.distanceToNextStopKm ?? 0).toFixed(1)} km`;
  const etaLabel = `~${tripState.etaNextStopMin ?? 0} min`;
  const canEndTrip =
    tripState.tripStatus !== 'NOT_STARTED' &&
    tripState.tripStatus !== 'COMPLETED' &&
    (tripState.isTripActive || tripState.tripStatus === 'AT_STOP' || tripState.tripStatus === 'DELAYED');

  const showMessage = (message: string) => {
    setReportedMessage(message);
    window.setTimeout(() => setReportedMessage(null), 3500);
  };

  const handleStartTrip = () => {
    if (tripState.tripStatus === 'COMPLETED') {
      startTrip(assignedBus.id);
      showMessage('New trip started.');
      return;
    }

    if (tripState.tripStatus === 'NOT_STARTED') {
      startTrip(assignedBus.id);
      showMessage('Trip started. Student and admin views are now synced to the live route.');
      return;
    }

    if (tripState.isPaused) {
      resumeTrip(assignedBus.id);
      showMessage('Trip resumed.');
      return;
    }

    pauseTrip(assignedBus.id);
    showMessage('Trip paused safely.');
  };

  const handleEndTrip = () => {
    if (!window.confirm('End this trip now?')) return;
    endTrip(assignedBus.id);
    showMessage('Trip completed.');
  };

  const handleDelay = (reason: 'Traffic' | 'Mechanical issue' | 'Other') => {
    if (!window.confirm(`Report delay due to ${reason.toLowerCase()}?`)) return;
    reportDelay(reason);
    showMessage(`Delay reported: ${reason}.`);
  };

  const handleBreakdown = () => {
    if (!window.confirm('Report a breakdown?')) return;
    reportBreakdown('Driver reported a mechanical breakdown from the active bus.');
    showMessage('Breakdown incident created.');
  };

  const handleEmergency = (type: 'ACCIDENT' | 'MEDICAL EMERGENCY' | 'OTHER ISSUE') => {
    if (!window.confirm(`Report ${type.toLowerCase()}?`)) return;
    reportEmergency(type);
    showMessage(`${type} reported.`);
  };

  const handleSOS = () => {
    if (!window.confirm('Trigger SOS?')) return;
    triggerSOS('SOS triggered by driver from the active route.');
    showMessage('SOS dispatched.');
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-2xl">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex items-start gap-4">
              <img
                src={currentDriver.photoUrl}
                alt={currentDriver.name}
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-blue-500/40"
              />
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.3em] text-blue-200">
                  Driver console
                </div>
                <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">{currentDriver.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-blue-300" />
                    Bus {assignedBus.busNumber}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Route className="h-3.5 w-3.5 text-emerald-300" />
                    {assignedRoute.code} · {assignedRoute.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px]">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Current stop</div>
                <div className="mt-1 text-lg font-black text-white">{currentStopLabel}</div>
                <div className="mt-2 text-xs text-slate-400">Next: {nextStopLabel}</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Distance / ETA</div>
                <div className="mt-1 text-lg font-black text-white">{distanceLabel} · {etaLabel}</div>
                <div className="mt-2 text-xs text-slate-400">
                  {tripState.tripStatus === 'COMPLETED' ? 'Trip completed' : `Progress ${Math.round(tripState.routeProgressPercent ?? 0)}%`}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-300">
              <span className="font-black uppercase tracking-[0.28em] text-slate-500">Select driver</span>
              <div className="relative">
                <select
                  value={selectedDriverId}
                  onChange={(event) => selectDriver(event.target.value)}
                  className="appearance-none rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 pr-8 text-sm font-semibold text-white outline-none transition focus:border-blue-400"
                >
                  {[
                    { id: 'drv-1', label: 'Rahul Patil' },
                    { id: 'drv-2', label: 'Amit Shinde' },
                    { id: 'drv-3', label: 'Sagar More' },
                  ].map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleStartTrip}
                disabled={false}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {tripState.tripStatus === 'NOT_STARTED' || tripState.tripStatus === 'COMPLETED' ? (
                  <Play className="h-3.5 w-3.5 shrink-0" />
                ) : tripState.isPaused ? (
                  <Play className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <Pause className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="whitespace-nowrap">
                  {tripState.tripStatus === 'NOT_STARTED' || tripState.tripStatus === 'COMPLETED'
                    ? 'Start Trip'
                    : tripState.isPaused
                    ? 'Resume Trip'
                    : 'Pause Trip'}
                </span>
              </button>
              <button
                onClick={handleEndTrip}
                disabled={!canEndTrip}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-600 bg-slate-800 px-4 text-xs font-bold text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Square className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">End Trip</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {reportedMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>{reportedMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="space-y-6">
          <SimulatedMap busId={assignedBus.id} tripState={tripState} />

          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-rose-700">
                <ShieldAlert className="h-3.5 w-3.5" /> Safety actions
              </div>
              <div className="mt-3 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600">Report delay</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Traffic', 'Mechanical issue', 'Other'] as const).map((reason) => (
                    <button
                      key={reason}
                      onClick={() => handleDelay(reason)}
                      className="h-8 rounded-lg border border-rose-200 bg-white px-2 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-100 whitespace-nowrap"
                    >
                      {reason}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={handleBreakdown}
                    className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-rose-300 bg-white px-2 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    <span className="whitespace-nowrap">Breakdown</span>
                  </button>
                  <button
                    onClick={() => handleEmergency('ACCIDENT')}
                    className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-rose-300 bg-white px-2 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    <span className="whitespace-nowrap">Emergency</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {(['ACCIDENT', 'MEDICAL EMERGENCY', 'OTHER ISSUE'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleEmergency(type)}
                      className="h-8 rounded-lg border border-rose-200 bg-white px-1.5 text-[10px] font-semibold leading-tight text-rose-700 transition hover:bg-rose-100"
                    >
                      {type === 'MEDICAL EMERGENCY' ? 'Medical' : type === 'OTHER ISSUE' ? 'Other' : 'Accident'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSOS}
                  className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-3 text-xs font-black tracking-wide text-white shadow transition hover:bg-rose-700"
                >
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>SOS</span>
                </button>
              </div>
            </div>
        </div>

        <RouteTimeline route={assignedRoute} tripState={tripState} />
      </div>
    </div>
  );
};
