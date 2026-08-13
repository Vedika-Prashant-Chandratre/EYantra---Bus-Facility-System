import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, Marker, Popup, Polyline, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { divIcon, LatLngBoundsExpression, LatLngTuple, Marker as LeafletMarker } from 'leaflet';
import { useApp } from '../../context/AppContext';
import { Bus, TripState } from '../../types';

interface SimulatedMapProps {
  showAllFleet?: boolean;
  onSelectBus?: (bus: Bus) => void;
  selectedBusId?: string;
  busId?: string;
  tripState?: TripState;
}

const getCoordinate = (stop: { latitude?: number; longitude?: number; x: number; y: number }): LatLngTuple => {
  if (typeof stop.latitude === 'number' && typeof stop.longitude === 'number') {
    return [stop.latitude, stop.longitude];
  }

  return [18.5 + stop.y * 0.01, 73.6 + stop.x * 0.01];
};

const stopIcon = (status: 'completed' | 'current' | 'next' | 'upcoming') => {
  const palette = {
    completed: { bg: '#16a34a', ring: '#dcfce7' },
    current: { bg: '#2563eb', ring: '#dbeafe' },
    next: { bg: '#f59e0b', ring: '#fef3c7' },
    upcoming: { bg: '#64748b', ring: '#e2e8f0' },
  }[status];

  return divIcon({
    className: '',
    html: `
      <div style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:9999px;background:${palette.bg};border:2px solid white;box-shadow:0 0 0 5px ${palette.ring};color:white;font-size:11px;font-weight:800;">
        ${status === 'completed' ? '✓' : '•'}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const busIcon = (status: Bus['status'], isPrimary = true) => {
  const color =
    status === 'On Route'
      ? '#2563eb'
      : status === 'Delayed'
      ? '#f59e0b'
      : status === 'Breakdown' || status === 'Emergency'
      ? '#dc2626'
      : '#475569';

  return divIcon({
    className: '',
    html: `
      <div style="display:flex;align-items:center;justify-content:center;min-width:${isPrimary ? 38 : 30}px;height:${isPrimary ? 38 : 30}px;padding:0 8px;border-radius:9999px;background:${color};color:white;border:3px solid white;box-shadow:0 12px 24px rgba(15,23,42,0.22);font-size:${isPrimary ? 18 : 14}px;line-height:1;">
        🚌
      </div>
    `,
    iconSize: [isPrimary ? 38 : 30, isPrimary ? 38 : 30],
    iconAnchor: [isPrimary ? 19 : 15, isPrimary ? 19 : 15],
  });
};

const MapViewportSync: React.FC<{
  routeBounds: LatLngBoundsExpression;
  busLocation: LatLngTuple;
  followBus: boolean;
}> = ({ routeBounds, busLocation, followBus }) => {
  const map = useMap();
  const hasFitBoundsRef = useRef(false);

  useEffect(() => {
    if (!hasFitBoundsRef.current) {
      map.fitBounds(routeBounds, { padding: [42, 42], animate: false });
      hasFitBoundsRef.current = true;
    }
  }, [map, routeBounds]);

  useEffect(() => {
    if (followBus) {
      map.panTo(busLocation, { animate: true, duration: 0.25 });
    }
  }, [followBus, busLocation, map]);

  return null;
};

const LiveBusMarker: React.FC<{
  position: LatLngTuple;
  status: Bus['status'];
  children: React.ReactNode;
}> = ({ position, status, children }) => {
  const markerRef = useRef<LeafletMarker>(null);

  useEffect(() => {
    markerRef.current?.setLatLng(position);
  }, [position[0], position[1]]);

  return (
    <Marker ref={markerRef} position={position} icon={busIcon(status, true)}>
      {children}
    </Marker>
  );
};

export const SimulatedMap: React.FC<SimulatedMapProps> = ({
  showAllFleet = false,
  onSelectBus,
  selectedBusId,
  busId,
  tripState: tripStateProp,
}) => {
  const { buses, routes, tripState: contextTripState, getTripStateForBus } = useApp();

  const resolvedBusId = busId || selectedBusId || contextTripState.busId || 'bus-a101';
  const primaryBus = buses.find((bus) => bus.id === resolvedBusId) || buses[0];
  const activeTripState = tripStateProp ?? getTripStateForBus(primaryBus.id);
  const activeRoute = routes.find((route) => route.id === primaryBus.routeId) || routes[0];
  const stops = activeRoute.stops;
  const isActiveBus = primaryBus.id === activeTripState.busId;
  const currentStopIndex = Math.min(
    activeTripState.isTripActive
      ? (activeTripState.currentStopIndex ?? primaryBus.currentStopIndex)
      : primaryBus.currentStopIndex,
    stops.length - 1
  );
  const currentStop = stops[currentStopIndex] || stops[0];
  const nextStop = stops[Math.min(currentStopIndex + 1, stops.length - 1)] || currentStop;

  const busLocation: LatLngTuple = useMemo(() => {
    if (
      activeTripState.isTripActive &&
      typeof activeTripState.currentLatitude === 'number' &&
      typeof activeTripState.currentLongitude === 'number'
    ) {
      return [activeTripState.currentLatitude, activeTripState.currentLongitude];
    }

    if (typeof primaryBus.latitude === 'number' && typeof primaryBus.longitude === 'number') {
      return [primaryBus.latitude, primaryBus.longitude];
    }

    return getCoordinate(currentStop);
  }, [
    activeTripState.isTripActive,
    activeTripState.currentLatitude,
    activeTripState.currentLongitude,
    primaryBus.latitude,
    primaryBus.longitude,
    currentStop,
  ]);

  const routePoints = useMemo(() => stops.map((stop) => getCoordinate(stop)), [stops]);
  const travelledPath = useMemo(() => {
    const path = routePoints.slice(0, Math.max(1, currentStopIndex + 1));
    if (primaryBus.status !== 'Trip Completed') {
      path.push(busLocation);
    }
    return path;
  }, [busLocation, currentStopIndex, primaryBus.status, routePoints]);

  const routeBounds = useMemo<LatLngBoundsExpression>(() => {
    if (routePoints.length === 0) {
      return [[18.4, 73.6], [18.7, 73.9]];
    }

    return routePoints as LatLngBoundsExpression;
  }, [routePoints]);

  const stopStatus = (index: number) => {
    if (activeTripState.tripStatus === 'COMPLETED' && index === stops.length - 1) return 'completed';
    if (index < currentStopIndex) return 'completed';
    if (index === currentStopIndex && activeTripState.tripStatus !== 'NOT_STARTED') return 'current';
    if (index === currentStopIndex + 1) return 'next';
    return 'upcoming';
  };

  const statusPill =
    primaryBus.status === 'On Route'
      ? 'bg-emerald-500/15 text-emerald-700 border-emerald-200'
      : primaryBus.status === 'Delayed'
      ? 'bg-amber-500/15 text-amber-700 border-amber-200'
      : primaryBus.status === 'Breakdown' || primaryBus.status === 'Emergency'
      ? 'bg-rose-500/15 text-rose-700 border-rose-200'
      : 'bg-slate-500/10 text-slate-600 border-slate-200';

  return (
    <div className="leaflet-map-scope relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      <div className="absolute left-4 top-4 z-[10] pointer-events-none">
        <div className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md ${statusPill}`}>
          <div className="text-[10px] font-black uppercase tracking-[0.28em] opacity-80">Live map</div>
          <div className="mt-0.5 text-sm font-black">Bus {primaryBus.busNumber} · {primaryBus.status}</div>
        </div>
      </div>

      <div className="relative h-[560px] w-full sm:h-[620px]">
        <MapContainer
          center={busLocation}
          zoom={13}
          minZoom={11}
          maxZoom={18}
          zoomControl={false}
          scrollWheelZoom
          className="h-full w-full"
        >
          <ZoomControl position="bottomright" />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapViewportSync routeBounds={routeBounds} busLocation={busLocation} followBus={isActiveBus || showAllFleet} />

          {routePoints.length > 1 && (
            <>
              <Polyline positions={routePoints} pathOptions={{ color: '#2563eb', weight: 6, opacity: 0.22 }} />
              <Polyline positions={routePoints} pathOptions={{ color: '#2563eb', weight: 4, opacity: 0.78, dashArray: '10 10' }} />
              <Polyline positions={travelledPath} pathOptions={{ color: '#16a34a', weight: 5, opacity: 0.92 }} />
            </>
          )}

          {stops.map((stop, index) => {
            const position = getCoordinate(stop);
            const status = stopStatus(index) as 'completed' | 'current' | 'next' | 'upcoming';

            return (
              <Marker key={stop.id} position={position} icon={stopIcon(status)}>
                <Popup>
                  <div className="space-y-1.5">
                    <div className="text-sm font-black text-slate-900">{stop.name}</div>
                    <div className="text-xs text-slate-600">
                      {status === 'completed'
                        ? 'Completed'
                        : status === 'current'
                        ? 'Current stop'
                        : status === 'next'
                        ? 'Next stop'
                        : 'Upcoming stop'}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {showAllFleet &&
            buses.map((bus) => {
              const busRoute = routes.find((route) => route.id === bus.routeId) || activeRoute;
              const busStops = busRoute.stops;
              const busStopIndex = Math.min(bus.currentStopIndex, busStops.length - 1);
              const fallback = getCoordinate(busStops[busStopIndex] || busStops[0]);
              const busPosition: LatLngTuple = typeof bus.latitude === 'number' && typeof bus.longitude === 'number' ? [bus.latitude, bus.longitude] : fallback;

              return (
                <Marker
                  key={bus.id}
                  position={busPosition}
                  icon={busIcon(bus.status, bus.id === primaryBus.id)}
                  eventHandlers={{ click: () => onSelectBus?.(bus) }}
                >
                  <Popup>
                    <div className="space-y-1.5">
                      <div className="text-sm font-black text-slate-900">Bus {bus.busNumber}</div>
                      <div className="text-xs text-slate-600">{bus.driverName}</div>
                      <div className="text-[11px] text-slate-500">{bus.status}</div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          <LiveBusMarker position={busLocation} status={primaryBus.status}>
            <Popup>
              <div className="space-y-1.5">
                <div className="text-sm font-black text-slate-900">Bus {primaryBus.busNumber}</div>
                <div className="text-xs text-slate-600">{primaryBus.driverName}</div>
                <div className="text-[11px] text-slate-500">Current location: {activeTripState.currentLocationLabel || currentStop?.name}</div>
                <div className="text-[11px] text-slate-500">Next stop: {activeTripState.nextStopName || nextStop?.name}</div>
              </div>
            </Popup>
          </LiveBusMarker>
        </MapContainer>
      </div>
    </div>
  );
};
