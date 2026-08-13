import React from 'react';
import { Route, TripState } from '../../types';

type TimelineStatus = 'completed' | 'current' | 'next' | 'upcoming';

interface RouteTimelineProps {
  route: Route;
  tripState: TripState;
  className?: string;
  title?: string;
}

const getStopStatus = (index: number, tripState: TripState, totalStops: number): TimelineStatus => {
  if (tripState.tripStatus === 'COMPLETED') {
    return 'completed';
  }

  if (tripState.tripStatus === 'NOT_STARTED' && index === 0) {
    return 'current';
  }

  if (index < (tripState.currentStopIndex ?? 0)) {
    return 'completed';
  }

  if (index === (tripState.currentStopIndex ?? 0)) {
    return tripState.tripStatus === 'NOT_STARTED' ? 'next' : 'current';
  }

  if (index === Math.min((tripState.currentStopIndex ?? 0) + 1, totalStops - 1)) {
    return 'next';
  }

  return 'upcoming';
};

export const RouteTimeline: React.FC<RouteTimelineProps> = ({ route, tripState, className = '', title = 'Route Details' }) => {
  const stops = route.stops;
  const progressPercent = Math.max(0, Math.min(100, tripState.routeProgressPercent ?? 0));
  const completedHeight = progressPercent;

  return (
    <div className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-600">{title}</div>
            <h2 className="mt-1 text-lg font-black text-slate-900">{route.code} · {route.name}</h2>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600">
            {tripState.tripStatus === 'COMPLETED'
              ? 'Trip completed'
              : tripState.tripStatus === 'NOT_STARTED'
              ? 'Waiting to start'
              : `Progress ${Math.round(progressPercent)}%`}
          </div>
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="relative pl-7">
          <div className="absolute left-3 top-0 h-full w-px bg-slate-200" />
          <div
            className="absolute left-3 top-0 w-px bg-gradient-to-b from-emerald-500 via-blue-500 to-blue-700 transition-all duration-700 ease-out"
            style={{ height: `${completedHeight}%` }}
          />

          {stops.map((stop, index) => {
            const status = getStopStatus(index, tripState, stops.length);
            const isDestination = index === stops.length - 1;
            const isCurrent = status === 'current';
            const isNext = status === 'next';
            const isCompleted = status === 'completed';

            return (
              <div key={stop.id} className="relative pb-7 last:pb-0">
                <div
                  className={`absolute -left-7 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[11px] font-black transition-all duration-500 ${
                    isCurrent
                      ? 'scale-110 border-blue-600 bg-blue-600 text-white shadow-[0_0_0_6px_rgba(37,99,235,0.12)] animate-pulse'
                      : isNext
                      ? 'border-amber-500 bg-amber-500 text-white shadow-[0_0_0_6px_rgba(245,158,11,0.12)]'
                      : isCompleted
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 bg-white text-slate-400'
                  }`}
                >
                  {isCompleted ? '✓' : isCurrent ? '●' : index + 1}
                </div>

                <div className={`flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 transition-all duration-500 ${
                  isCurrent
                    ? 'border-blue-200 bg-blue-50/80'
                    : isNext
                    ? 'border-amber-200 bg-amber-50/70'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/70'
                    : 'border-transparent bg-transparent'
                }`}>
                  <div>
                    <div className={`text-sm font-black transition-colors duration-500 ${isCurrent ? 'text-blue-700' : isCompleted ? 'text-emerald-700' : 'text-slate-900'}`}>
                      {stop.name}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      {isCurrent
                        ? tripState.tripStatus === 'NOT_STARTED'
                          ? 'Awaiting departure'
                          : tripState.currentLocationLabel || 'Current stop'
                        : isNext
                        ? 'Next stop'
                        : isDestination
                        ? 'Destination'
                        : isCompleted
                        ? 'Completed'
                        : 'Upcoming'}
                    </div>
                  </div>

                  <div className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.24em] transition-colors duration-500 ${
                    isCurrent
                      ? 'border-blue-200 bg-blue-100 text-blue-700'
                      : isNext
                      ? 'border-amber-200 bg-amber-100 text-amber-700'
                      : isCompleted
                      ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}>
                    {isCurrent ? 'Current' : isNext ? 'Next' : isDestination ? 'Destination' : isCompleted ? 'Completed' : 'Upcoming'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
