import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, RotateCcw, Bus as BusIcon, MapPin, Navigation, Compass, AlertTriangle, ShieldCheck, User, Phone, Zap } from 'lucide-react';
import { Bus } from '../../types';

interface SimulatedMapProps {
  showAllFleet?: boolean;
  onSelectBus?: (bus: Bus) => void;
  selectedBusId?: string;
}

export const SimulatedMap: React.FC<SimulatedMapProps> = ({
  showAllFleet = false,
  onSelectBus,
  selectedBusId,
}) => {
  const { buses, routes, tripState, startTrip, pauseTrip, resetDemoData, currentDriver } = useApp();
  const [hoveredStop, setHoveredStop] = useState<string | null>(null);

  const primaryBus = buses.find((b) => b.id === (selectedBusId || 'bus-a101')) || buses[0];
  const activeRoute = routes.find((r) => r.id === primaryBus.routeId) || routes[0];

  // Map SVG Dimensions
  const stops = activeRoute.stops;

  // Calculate simulated bus coordinates based on progressPercent along SVG polyline
  const calculateBusCoords = (progressPct: number) => {
    if (!stops || stops.length === 0) return { x: 15, y: 70 };
    if (progressPct <= 0) return { x: stops[0].x, y: stops[0].y };
    if (progressPct >= 100) return { x: stops[stops.length - 1].x, y: stops[stops.length - 1].y };

    const segmentCount = stops.length - 1;
    const totalProgress = (progressPct / 100) * segmentCount;
    const segmentIndex = Math.min(Math.floor(totalProgress), segmentCount - 1);
    const segmentFraction = totalProgress - segmentIndex;

    const startStop = stops[segmentIndex];
    const endStop = stops[segmentIndex + 1];

    const x = startStop.x + (endStop.x - startStop.x) * segmentFraction;
    const y = startStop.y + (endStop.y - startStop.y) * segmentFraction;

    return { x, y };
  };

  const busCoords = calculateBusCoords(primaryBus.progressPercent);

  // SVG Road Polyline Points String
  const polylinePoints = stops.map((s) => `${s.x},${s.y}`).join(' ');

  // Current ETA calculation
  const remainingStops = stops.length - 1 - primaryBus.currentStopIndex;
  const etaMinutes = Math.max(2, remainingStops * 4);
  const nextStop = stops[Math.min(primaryBus.currentStopIndex + 1, stops.length - 1)];

  return (
    <div className="relative w-full bg-slate-100 rounded-2xl border border-slate-300 shadow-sm overflow-hidden group">
      
      {/* Top Map HUD Header Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Status Badge */}
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md border border-slate-200 px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-md">
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                primaryBus.status === 'On Route'
                  ? 'bg-emerald-400'
                  : primaryBus.status === 'Breakdown' || primaryBus.status === 'Emergency'
                  ? 'bg-rose-400'
                  : 'bg-amber-400'
              } opacity-75`}
            />
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                primaryBus.status === 'On Route'
                  ? 'bg-emerald-500'
                  : primaryBus.status === 'Breakdown' || primaryBus.status === 'Emergency'
                  ? 'bg-rose-500'
                  : 'bg-amber-500'
              }`}
            />
          </span>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live Tracking GPS</div>
            <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <span>Bus {primaryBus.busNumber}</span>
              <span className="text-slate-400">•</span>
              <span
                className={`text-[11px] font-extrabold ${
                  primaryBus.status === 'On Route'
                    ? 'text-emerald-600'
                    : primaryBus.status === 'Breakdown' || primaryBus.status === 'Emergency'
                    ? 'text-rose-600'
                    : 'text-amber-600'
                }`}
              >
                {primaryBus.status}
              </span>
            </div>
          </div>
        </div>

        {/* Live Simulation Controls */}
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md border border-slate-200 p-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
          <button
            onClick={() => startTrip('bus-a101')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Start Simulation</span>
          </button>

          <button
            onClick={() => pauseTrip('bus-a101')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition shadow-xs"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">{tripState.isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            onClick={resetDemoData}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition border border-slate-300"
            title="Reset Route"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Custom Vector Map Canvas */}
      <div className="relative w-full aspect-[16/9] min-h-[360px] sm:min-h-[420px] bg-[#E2E8F0] p-4">
        
        {/* Background Grid Pattern */}
        <svg className="w-full h-full absolute inset-0 opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Map SVG Layer */}
        <svg className="w-full h-full relative z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          
          {/* River / Geographic Feature */}
          <path
            d="M 0,45 Q 30,60 50,40 T 100,55"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Secondary Roads Grid */}
          <path d="M 20,0 L 20,100 M 50,0 L 50,100 M 80,0 L 80,100" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2,2" />
          <path d="M 0,30 L 100,30 M 0,70 L 100,70" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2,2" />

          {/* Main Bus Route Path Outer Glow */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.2"
            className="blur-xs"
          />

          {/* Main Bus Route Path */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="3,1.5"
          />

          {/* Bus Route Traveled Track */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${primaryBus.progressPercent}, 100`}
          />

          {/* Bus Stop Nodes */}
          {stops.map((stop, idx) => {
            const isPassed = idx <= primaryBus.currentStopIndex;
            const isNext = idx === primaryBus.currentStopIndex + 1;
            const isHovered = hoveredStop === stop.id;

            return (
              <g
                key={stop.id}
                onMouseEnter={() => setHoveredStop(stop.id)}
                onMouseLeave={() => setHoveredStop(null)}
                className="cursor-pointer transition-transform"
              >
                {/* Pulse Ring for Next Stop */}
                {isNext && (
                  <circle cx={stop.x} cy={stop.y} r="3.5" fill="none" stroke="#d97706" strokeWidth="0.8" className="animate-ping" />
                )}

                {/* Stop Outer Circle */}
                <circle
                  cx={stop.x}
                  cy={stop.y}
                  r={isHovered ? '2.8' : '2.2'}
                  fill={isPassed ? '#10b981' : isNext ? '#f59e0b' : '#64748b'}
                  stroke="#ffffff"
                  strokeWidth="0.8"
                />

                {/* Stop Center Dot */}
                <circle cx={stop.x} cy={stop.y} r="0.8" fill="#ffffff" />

                {/* Stop Label */}
                <text
                  x={stop.x}
                  y={stop.y + 4.5}
                  fontSize="2.4"
                  fontWeight="bold"
                  fill={isPassed ? '#047857' : isNext ? '#b45309' : '#475569'}
                  textAnchor="middle"
                  className="select-none font-sans"
                >
                  {stop.name}
                </text>
              </g>
            );
          })}

          {/* Student Location Pin (Shivajinagar Area) */}
          <g transform="translate(48, 38)">
            <circle cx="0" cy="0" r="4" fill="none" stroke="#db2777" strokeWidth="0.5" className="animate-ping" />
            <circle cx="0" cy="0" r="1.8" fill="#db2777" stroke="#ffffff" strokeWidth="0.5" />
            <text x="0" y="-3" fontSize="2" fontWeight="extrabold" fill="#be185d" textAnchor="middle">
              Vedika (You)
            </text>
          </g>

          {/* Multi-Bus Fleet Render for Admin view */}
          {showAllFleet &&
            buses.map((busItem) => {
              if (busItem.id === primaryBus.id) return null; // rendered below with priority
              const coords = calculateBusCoords(busItem.progressPercent);
              return (
                <g
                  key={busItem.id}
                  onClick={() => onSelectBus && onSelectBus(busItem)}
                  className="cursor-pointer hover:scale-125 transition-transform"
                >
                  <circle cx={coords.x} cy={coords.y} r="2.2" fill="#4f46e5" stroke="#ffffff" strokeWidth="0.6" />
                  <text x={coords.x} y={coords.y - 3} fontSize="2" fontWeight="bold" fill="#3730a3" textAnchor="middle">
                    Bus {busItem.busNumber}
                  </text>
                </g>
              );
            })}

          {/* Primary Moving Bus Marker */}
          <g
            transform={`translate(${busCoords.x}, ${busCoords.y})`}
            className="transition-all duration-500 ease-out cursor-pointer"
          >
            {/* Animated Pulsing Radar Outer Ring */}
            <circle
              cx="0"
              cy="0"
              r="6"
              fill="none"
              stroke={
                primaryBus.status === 'On Route'
                  ? '#2563eb'
                  : primaryBus.status === 'Breakdown' || primaryBus.status === 'Emergency'
                  ? '#dc2626'
                  : '#d97706'
              }
              strokeWidth="0.6"
              className="animate-ping"
            />

            {/* Bus Base Disc */}
            <circle
              cx="0"
              cy="0"
              r="3.2"
              fill={
                primaryBus.status === 'On Route'
                  ? '#2563eb'
                  : primaryBus.status === 'Breakdown' || primaryBus.status === 'Emergency'
                  ? '#dc2626'
                  : '#d97706'
              }
              stroke="#ffffff"
              strokeWidth="0.8"
              className="shadow-lg"
            />

            {/* Bus Inner Symbol */}
            <text x="0" y="0.8" fontSize="2" fontWeight="extrabold" fill="#ffffff" textAnchor="middle">
              🚌
            </text>

            {/* Bus Number Callout Tag */}
            <g transform="translate(0, -5)">
              <rect x="-8" y="-3.5" width="16" height="4.5" rx="1.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.4" />
              <text x="0" y="-0.5" fontSize="2" fontWeight="black" fill="#38bdf8" textAnchor="middle">
                A-101 • {primaryBus.speedKmH} km/h
              </text>
            </g>
          </g>
        </svg>

        {/* Hover Stop Tooltip Overlay */}
        {hoveredStop && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 bg-white border border-slate-200 text-slate-800 px-3 py-1.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Stop: {stops.find((s) => s.id === hoveredStop)?.name}</span>
          </div>
        )}
      </div>

      {/* Bottom Telemetry HUD Bar */}
      <div className="p-4 bg-white border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-800">
        
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Navigation className="w-3 h-3 text-blue-600" /> Next Bus Stop
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
            {nextStop ? nextStop.name : 'Destination Reached'}
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" /> Est. Arrival Time
          </div>
          <div className="text-xs sm:text-sm font-bold text-amber-600 mt-0.5">
            {primaryBus.status === 'Trip Completed' ? 'Arrived' : `${etaMinutes} minutes`}
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3 h-3 text-emerald-600" /> Current Speed
          </div>
          <div className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5">
            {primaryBus.speedKmH} km/h
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <User className="w-3 h-3 text-indigo-600" /> Assigned Driver
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5 flex items-center justify-between">
            <span>{primaryBus.driverName}</span>
            <a
              href={`tel:${primaryBus.driverPhone}`}
              className="text-xs text-blue-600 hover:text-blue-700 p-0.5"
              title="Call Driver"
            >
              <Phone className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
