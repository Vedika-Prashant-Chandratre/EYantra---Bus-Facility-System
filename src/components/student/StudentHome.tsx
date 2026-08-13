import React from 'react';
import { useApp } from '../../context/AppContext';
import { StudentSelector } from '../common/StudentSelector';
import { Navigation, MapPin, Phone, User, Clock, AlertTriangle, ArrowRight, ShieldCheck, Bus as BusIcon, Sparkles } from 'lucide-react';

interface StudentHomeProps {
  setActiveTab: (tab: string) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({ setActiveTab }) => {
  const { currentStudent, buses, routes, drivers, incidents, getTripStateForBus } = useApp();

  const assignedBus = buses.find((b) => b.id === currentStudent.assignedBusId) || buses[0];
  const assignedRoute = routes.find((r) => r.id === currentStudent.assignedRouteId) || routes[0];
  const assignedDriver = drivers.find((d) => d.assignedBusId === assignedBus.id) || drivers.find((d) => d.name === assignedBus.driverName) || drivers[0];
  const studentTripState = getTripStateForBus(assignedBus.id);
  const activeIncident = incidents.find((i) => i.busId === assignedBus.id && i.status !== 'Resolved');
  const currentStopName = studentTripState.currentLocationLabel || studentTripState.currentStopName || assignedRoute.stops[assignedBus.currentStopIndex]?.name || assignedRoute.startPoint;
  const nextStopName = studentTripState.nextStopName || assignedRoute.stops[Math.min(assignedBus.currentStopIndex + 1, assignedRoute.stops.length - 1)]?.name || assignedRoute.endPoint;
  const etaMinutes = studentTripState.etaNextStopMin ?? 0;
  const distanceToNext = studentTripState.distanceToNextStopKm ?? 0;
  const availableSeats = Math.max(0, assignedBus.capacity - assignedBus.currentOccupancy);
  const occupancyPercent = Math.round((assignedBus.currentOccupancy / (assignedBus.capacity || 1)) * 100);

  return (
    <div className="space-y-6 pb-8">
      
      {/* Header Banner & Greeting */}
      <div className="bg-[#0F172A] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> EYantra Student Transport
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Good Evening, {currentStudent.name.split(' ')[0]} 👋
            </h1>
            <div className="mt-2 text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Student ID: <strong className="text-white font-mono">{currentStudent.studentId}</strong></span>
              <span>•</span>
              <span>Dept: <strong className="text-white">{currentStudent.department}</strong></span>
              <span>•</span>
              <span>Track: <strong className="text-blue-300 font-semibold">{assignedRoute.code}</strong></span>
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <StudentSelector className="border-slate-700 bg-slate-900/90 [&_span]:text-slate-400 [&_select]:border-slate-700 [&_select]:bg-slate-950 [&_select]:text-white" />
            <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Digital Bus Pass</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span>Active & Verified</span>
                  <span className="text-slate-400 text-[10px]">({currentStudent.passExpiryDate})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Alert Banner if breakdown or accident reported */}
      {activeIncident && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-900 flex items-start gap-3 shadow-xs animate-pulse">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-700">
              URGENT TRANSPORT NOTICE: {activeIncident.type} REPORTED
            </div>
            <p className="text-xs font-medium text-rose-800 mt-1">
              Bus {assignedBus.busNumber} has reported a {activeIncident.type.toLowerCase()} at {activeIncident.locationName}. Administrator has been notified and backup vehicle is on standby.
            </p>
          </div>
        </div>
      )}

      {/* Prominent Bus Status Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <BusIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  BUS {assignedBus.busNumber}
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  {assignedBus.registrationNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {assignedBus.routeName}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
              assignedBus.status === 'On Route'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : assignedBus.status === 'Breakdown' || assignedBus.status === 'Emergency'
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}
          >
            ● {studentTripState.tripStatus === 'NOT_STARTED' ? 'Awaiting Departure' : assignedBus.status}
          </span>
        </div>

        {/* Status Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> Estimated Arrival
            </div>
            <div className="text-lg font-bold text-blue-600 mt-1">
              {studentTripState.tripStatus === 'NOT_STARTED' ? 'Waiting' : `~${etaMinutes} min`}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{studentTripState.tripStatus === 'NOT_STARTED' ? 'Driver has not started the trip yet' : `Distance to next stop: ${distanceToNext.toFixed(1)} km`}</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" /> Next Stop
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1 truncate">{nextStopName}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{studentTripState.tripStatus === 'NOT_STARTED' ? 'Trip will update after START TRIP' : `Current: ${currentStopName}`}</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" /> Assigned Driver
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1 truncate">{assignedDriver.name}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Lic: {assignedDriver.licenseNumber}</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BusIcon className="w-3.5 h-3.5 text-emerald-600" /> Seat Capacity
            </div>
            <div className="text-lg font-bold text-emerald-700 mt-1">
              {assignedBus.currentOccupancy} / {assignedBus.capacity}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{availableSeats} Seats Available</div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab('live-tracking')}
            className="w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm flex items-center justify-center gap-2 transition"
          >
            <Navigation className="w-4 h-4" />
            <span>Track Bus in Real-Time</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('route-details')}
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-6 rounded-lg border border-slate-300 shadow-sm flex items-center justify-center gap-2 transition"
          >
            <MapPin className="w-4 h-4 text-slate-500" />
            <span>View Full Route Stops</span>
          </button>
        </div>
      </div>

      {/* Today's Detailed Bus Information & Driver Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Driver Contact & Capacity Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" /> Today's Driver Information
          </h3>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <img
              src={assignedDriver.photoUrl}
              alt={assignedDriver.name}
              className="w-14 h-14 rounded-xl object-cover ring-2 ring-blue-500/30"
            />
            <div className="flex-1">
              <h4 className="text-base font-bold text-slate-900">{assignedDriver.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">Assigned to {assignedRoute.code} (Bus {assignedBus.busNumber})</p>
              <div className="mt-2 flex items-center gap-2">
                <a
                  href={`tel:${assignedDriver.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-lg border border-blue-200 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{assignedDriver.phone}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bus Occupancy Progress */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Current Occupancy</span>
              <span className="text-blue-600">{assignedBus.currentOccupancy} / {assignedBus.capacity} Seats Occupied</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${occupancyPercent}%` }} />
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Estimated {availableSeats} seats available for boarding at {currentStopName} stop.
            </p>
          </div>
        </div>

        {/* Quick Shortcut Hub */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Student Quick Tools
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveTab('bus-pass')}
              className="bg-slate-50 hover:bg-slate-100 p-4 rounded-xl border border-slate-200 text-left transition space-y-2 group"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="font-bold text-xs text-slate-900">Digital Pass</div>
              <div className="text-[10px] text-slate-500">View pass & QR code</div>
            </button>

            <button
              onClick={() => setActiveTab('payment')}
              className="bg-slate-50 hover:bg-slate-100 p-4 rounded-xl border border-slate-200 text-left transition space-y-2 group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="font-bold text-xs text-slate-900">Pay Bus Fee</div>
              <div className="text-[10px] text-slate-500">₹4,500 monthly fee</div>
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Transport Helpdesk</div>
              <div className="text-[11px] text-slate-500">support@eyantra.college.edu</div>
            </div>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200">
              24x7 Active
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
