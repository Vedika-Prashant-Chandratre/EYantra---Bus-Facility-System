import React from 'react';
import { useApp } from '../../context/AppContext';
import { StudentAvatar } from '../common/StudentAvatar';
import {
  Bus,
  MapPin,
  Clock,
  Phone,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Bell,
  Sparkles,
  Route,
  Navigation,
} from 'lucide-react';

export const StudentHome: React.FC = () => {
  const {
    currentStudent,
    currentBus,
    currentRoute,
    currentDriver,
    activePass,
    notifications,
    setStudentTab,
    busProgressPercent,
    currentSpeed,
    showToast,
  } = useApp();

  const activeAlert = notifications.find((n) => !n.isRead);

  return (
    <div className="space-y-8">
      {/* Student Welcome Header Card - Light Theme & Generously Spaced */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-sky-50/70 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5 sm:gap-6">
            {/* Student Avatar instead of photo */}
            <StudentAvatar
              name={currentStudent.name}
              seed={currentStudent.avatarSeed}
              gender={currentStudent.gender}
              bgColor={currentStudent.avatarBg}
              size="xl"
              showBadge={true}
              status="active"
            />

            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome, {currentStudent.name}
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Pass Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {currentStudent.branch} ({currentStudent.year} · Div {currentStudent.division}) · PRN:{' '}
                <span className="font-mono text-slate-800 font-bold">{currentStudent.prn}</span> · Roll: {currentStudent.rollNo}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  {currentStudent.stopName}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Scheduled Pickup: <strong className="text-slate-900">{currentStudent.stopPickupTime}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Pass Badge Card */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shrink-0 gap-3">
            <div className="text-left sm:text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Digital Pass ID
              </p>
              <p className="text-xs sm:text-sm font-mono font-bold text-slate-800 mt-0.5">
                {activePass.passNumber}
              </p>
            </div>
            <button
              onClick={() => setStudentTab('pass')}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Show QR Pass</span>
            </button>
          </div>
        </div>
      </div>

      {/* Broadcast Alert Banner if present */}
      {activeAlert && (
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 text-amber-700">
              <Bell className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-bold text-amber-950">{activeAlert.title}</p>
              <p className="text-xs text-amber-800 leading-relaxed">{activeAlert.message}</p>
              <p className="text-[10px] text-amber-600 font-medium pt-1">{activeAlert.timestamp}</p>
            </div>
          </div>
          <button
            onClick={() => setStudentTab('notifications')}
            className="text-xs font-bold text-amber-900 hover:text-amber-950 shrink-0 underline"
          >
            All Notices
          </button>
        </div>
      )}

      {/* Main Grid: Today's Bus Tracking Card & Route Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Live Bus Transit Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center">
                  <Bus className="w-6 h-6 text-sky-700" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Today&apos;s Bus: {currentBus?.busNumber || 'Bus 04'}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Plate: {currentBus?.plateNumber} · {currentRoute?.routeNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Live on Route</span>
              </div>
            </div>

            {/* Current transit status and progress bar */}
            <div className="mt-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-sky-600 shrink-0" />
                  Live Location: <strong className="text-slate-900">{currentBus?.currentLocationName}</strong>
                </span>
                <span className="font-mono text-slate-500 font-semibold">
                  Speed: <strong className="text-slate-900">{currentSpeed} km/h</strong>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/60 relative">
                <div
                  className="bg-sky-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${busProgressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Start: {currentRoute?.stops[0]?.name.split('(')[0]}</span>
                <span className="text-sky-700 font-bold">
                  {busProgressPercent}% of Morning Trip Completed
                </span>
                <span>End: KK Wagh Campus</span>
              </div>
            </div>

            {/* Driver Profile Bar in Card */}
            {currentDriver && (
              <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <StudentAvatar
                    name={currentDriver.name}
                    seed={currentDriver.id}
                    gender="male"
                    bgColor="bg-sky-100 text-sky-800"
                    size="lg"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">{currentDriver.name}</p>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Assigned Driver
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Badge: {currentDriver.badgeNumber} · {currentDriver.experienceYears} Years Safe Driving Experience
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <a
                    href={`tel:${currentDriver.phone}`}
                    onClick={() => showToast(`Calling driver ${currentDriver.name}`)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Call Driver</span>
                  </a>
                  <button
                    onClick={() => setStudentTab('tracking')}
                    className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Open Live Map</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Promotion for the NEW MODULE */}
          <div className="bg-linear-to-r from-sky-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold">
                <Sparkles className="w-3 h-3" /> New System Directory
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                All Buses, Drivers & Route Stops Directory
              </h3>
              <p className="text-xs sm:text-sm text-sky-100 max-w-xl leading-relaxed">
                Explore all 6 routes, 38+ stops across Nashik, driver phone contacts, vehicle models, and morning & evening schedules.
              </p>
            </div>

            <button
              onClick={() => setStudentTab('buses-routes')}
              className="px-5 py-3 rounded-xl bg-white text-sky-700 hover:bg-sky-50 font-bold text-xs sm:text-sm shrink-0 flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>Explore Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Route stops preview & Quick Links */}
        <div className="space-y-8">
          {/* Assigned Route Stops Preview */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Route className="w-4 h-4 text-sky-600" />
                {currentRoute?.routeNumber} Stops Preview
              </h3>
              <button
                onClick={() => setStudentTab('buses-routes')}
                className="text-xs font-bold text-sky-600 hover:text-sky-700"
              >
                View All
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {currentRoute?.stops.slice(0, 5).map((stop) => {
                const isStudentStop =
                  currentStudent.stopName.toLowerCase().includes(stop.name.toLowerCase().slice(0, 10));

                return (
                  <div
                    key={stop.id}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                      isStudentStop
                        ? 'bg-sky-50 border-sky-200 text-sky-950 font-semibold'
                        : 'bg-slate-50 border-slate-200/70 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-[10px] font-bold flex items-center justify-center text-slate-700 shrink-0">
                        {stop.sequence}
                      </span>
                      <div className="truncate">
                        <p className="truncate font-semibold">{stop.name}</p>
                        {isStudentStop && (
                          <span className="text-[10px] text-sky-700 font-bold">
                            ★ Your Pickup Stop
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-600 shrink-0 ml-2">
                      {stop.morningPickup}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setStudentTab('route-detail')}
              className="mt-4 w-full py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors text-center"
            >
              See Complete Stop Timeline
            </button>
          </div>

          {/* Quick Help & Emergency Transport Helpline */}
          <div className="bg-slate-50 rounded-3xl border border-slate-200/90 p-6 text-xs text-slate-600 space-y-3.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Campus Transport Support</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              For bus delays exceeding 15 minutes, route change queries, or lost items on board:
            </p>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1.5 shadow-2xs">
              <p className="font-bold text-slate-800 text-xs">Coordinator Office: Transport Cell</p>
              <p className="text-[11px] text-slate-500">K.K. Wagh Engineering College, Nashik</p>
              <p className="font-mono font-bold text-xs text-sky-700 pt-0.5">Helpline: +91 0253 2512876</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
