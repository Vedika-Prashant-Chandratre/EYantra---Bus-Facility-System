import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Bus, BusPassApplication, AppNotification, BusStop, Driver, Incident, PaymentRecord, Route, Student, UserRole, TripState, BusStatus } from '../types';
import {
  INITIAL_BUSES,
  INITIAL_DRIVERS,
  INITIAL_INCIDENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PASS_APPLICATIONS,
  INITIAL_PAYMENTS,
  INITIAL_ROUTES,
  INITIAL_STUDENTS,
} from '../data/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  selectedDriverId: string;
  selectDriver: (driverId: string) => void;
  selectedStudentId: string;
  selectStudent: (studentId: string) => void;
  currentStudent: Student;
  currentDriver: Driver;
  buses: Bus[];
  routes: Route[];
  drivers: Driver[];
  students: Student[];
  incidents: Incident[];
  notifications: AppNotification[];
  passApplications: BusPassApplication[];
  payments: PaymentRecord[];
  tripStates: Record<string, TripState>;
  tripState: TripState;
  getTripStateForBus: (busId: string) => TripState;

  startTrip: (busId?: string) => void;
  pauseTrip: (busId?: string) => void;
  resumeTrip: (busId?: string) => void;
  endTrip: (busId?: string) => void;
  reportIncident: (type: Incident['type'], description?: string) => void;
  acknowledgeIncident: (id: string) => void;
  resolveIncident: (id: string) => void;
  applyForPass: (data: Omit<BusPassApplication, 'id' | 'submittedDate' | 'status'>) => void;
  approvePass: (id: string) => void;
  rejectPass: (id: string, reason?: string) => void;
  processPayment: (method: 'UPI' | 'Card' | 'Net Banking', amount: number) => Promise<PaymentRecord>;
  sendAnnouncement: (title: string, description: string, targetRouteId?: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateBusStatus: (busId: string, status: BusStatus) => void;
  setSimulationSpeed: (speed: number) => void;
  arriveAtNextStop: (busId?: string) => void;
  departStop: (busId?: string) => void;
  advanceTrip: (busId?: string) => void;
  reportDelay: (reason?: string) => void;
  reportBreakdown: (description?: string) => void;
  reportEmergency: (type?: 'ACCIDENT' | 'MEDICAL EMERGENCY' | 'OTHER ISSUE') => void;
  triggerSOS: (description?: string) => void;
  triggerDemoBreakdown: () => void;
  triggerDemoAccident: () => void;
  triggerDemoDelay: () => void;
  resetDemoData: () => void;
}

const STORAGE_KEYS = {
  ROLE: 'eyantra_role',
  SELECTED_DRIVER: 'eyantra_selected_driver',
  SELECTED_STUDENT: 'eyantra_selected_student',
  BUSES: 'eyantra_buses',
  INCIDENTS: 'eyantra_incidents',
  NOTIFICATIONS: 'eyantra_notifications',
  PASS_APPS: 'eyantra_pass_apps',
  PAYMENTS: 'eyantra_payments',
  TRIP_STATES: 'eyantra_trip_states',
  TRIP_STATE: 'eyantra_trip_state',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_DRIVER_ID = 'drv-1';
const DEFAULT_STUDENT_ID = 'stu-pranit';
const DEFAULT_BUS_ID = 'bus-a101';
const DEFAULT_ROUTE_ID = 'route-a';

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

const getStopCoordinate = (stop: BusStop) => ({
  latitude: stop.latitude ?? 18 + (100 - stop.y) * 0.01,
  longitude: stop.longitude ?? 73.7 + stop.x * 0.01,
});

const createDefaultTripStateForRoute = (busId: string, route: Route): TripState => {
  const startStop = route.stops[0];
  const nextStop = route.stops[1] || route.stops[0];
  const startCoords = startStop ? getStopCoordinate(startStop) : { latitude: 19.9918, longitude: 73.7968 };

  return {
    tripStatus: 'NOT_STARTED',
    stopStatus: 'UPCOMING',
    isTripActive: false,
    isPaused: false,
    routeId: route.id,
    busId,
    currentStopId: startStop?.id,
    nextStopId: nextStop?.id,
    currentStopIndex: 0,
    currentStopName: startStop?.name ?? route.startPoint,
    nextStopName: nextStop?.name ?? route.endPoint,
    etaNextStopMin: nextStop?.estimatedTravelTimeFromPreviousStopMin ?? 4,
    distanceToNextStopKm: nextStop?.distanceFromPreviousStopKm ?? 1.2,
    routeProgressPercent: 0,
    currentLatitude: startCoords.latitude,
    currentLongitude: startCoords.longitude,
    currentLocationLabel: startStop?.name ?? route.startPoint,
    completedStops: 0,
    totalStops: route.stops.length,
    simulationSpeed: 2,
  };
};

const getRouteProgressSnapshot = (route: Route, progressPercent: number) => {
  const stops = route.stops;
  const fallback = createDefaultTripStateForRoute(DEFAULT_BUS_ID, route);

  if (stops.length === 0) {
    return {
      currentStopIndex: 0,
      nextStopIndex: 0,
      currentStop: undefined as BusStop | undefined,
      nextStop: undefined as BusStop | undefined,
      latitude: fallback.currentLatitude ?? 0,
      longitude: fallback.currentLongitude ?? 0,
      currentLocationLabel: fallback.currentLocationLabel ?? 'Unknown',
      currentStopName: fallback.currentStopName,
      nextStopName: fallback.nextStopName,
      currentStopId: fallback.currentStopId,
      nextStopId: fallback.nextStopId,
      etaNextStopMin: fallback.etaNextStopMin,
      distanceToNextStopKm: fallback.distanceToNextStopKm,
      routeProgressPercent: 0,
      completedStops: 0,
      totalStops: 0,
      isDestinationReached: false,
    };
  }

  const lastStopIndex = stops.length - 1;
  const segmentDistances = stops.slice(1).map((stop) => Math.max(stop.distanceFromPreviousStopKm ?? 1, 0.1));
  const totalDistance = segmentDistances.reduce((sum, distance) => sum + distance, 0) || route.distanceKm || 1;
  const traveledDistance = totalDistance * (clampPercent(progressPercent) / 100);

  if (traveledDistance >= totalDistance) {
    const lastStop = stops[lastStopIndex];
    const lastCoords = getStopCoordinate(lastStop);
    return {
      currentStopIndex: lastStopIndex,
      nextStopIndex: lastStopIndex,
      currentStop: lastStop,
      nextStop: lastStop,
      latitude: lastCoords.latitude,
      longitude: lastCoords.longitude,
      currentLocationLabel: lastStop.name,
      currentStopName: lastStop.name,
      nextStopName: lastStop.name,
      currentStopId: lastStop.id,
      nextStopId: lastStop.id,
      etaNextStopMin: 0,
      distanceToNextStopKm: 0,
      routeProgressPercent: 100,
      completedStops: stops.length,
      totalStops: stops.length,
      isDestinationReached: true,
    };
  }

  let traversedDistance = 0;
  let currentStopIndex = 0;
  let nextStopIndex = 1;
  let segmentFraction = 0;

  for (let index = 0; index < segmentDistances.length; index += 1) {
    const segmentDistance = segmentDistances[index];
    if (traveledDistance <= traversedDistance + segmentDistance) {
      currentStopIndex = index;
      nextStopIndex = index + 1;
      segmentFraction = (traveledDistance - traversedDistance) / segmentDistance;
      break;
    }
    traversedDistance += segmentDistance;
  }

  const currentStop = stops[currentStopIndex];
  const nextStop = stops[nextStopIndex] ?? currentStop;
  const currentCoords = getStopCoordinate(currentStop);
  const nextCoords = getStopCoordinate(nextStop);
  const currentSegmentDistance = Math.max(nextStop.distanceFromPreviousStopKm ?? 1, 0.1);
  const currentSegmentTime = Math.max(nextStop.estimatedTravelTimeFromPreviousStopMin ?? 4, 1);
  const remainingFraction = 1 - segmentFraction;
  const latitude = currentCoords.latitude + (nextCoords.latitude - currentCoords.latitude) * segmentFraction;
  const longitude = currentCoords.longitude + (nextCoords.longitude - currentCoords.longitude) * segmentFraction;

  return {
    currentStopIndex,
    nextStopIndex,
    currentStop,
    nextStop,
    latitude,
    longitude,
    currentLocationLabel: segmentFraction < 0.5 ? currentStop.name : `Near ${currentStop.name}`,
    currentStopName: currentStop.name,
    nextStopName: nextStop.name,
    currentStopId: currentStop.id,
    nextStopId: nextStop.id,
    etaNextStopMin: Math.max(1, Math.round(currentSegmentTime * remainingFraction)),
    distanceToNextStopKm: Number((currentSegmentDistance * remainingFraction).toFixed(1)),
    routeProgressPercent: clampPercent((traveledDistance / totalDistance) * 100),
    completedStops: Math.max(1, currentStopIndex + 1),
    totalStops: stops.length,
    isDestinationReached: false,
  };
};

const buildInitialTripStates = (buses: Bus[], routes: Route[]): Record<string, TripState> => {
  const states: Record<string, TripState> = {};

  buses.forEach((bus) => {
    const route = routes.find((candidate) => candidate.id === bus.routeId) || routes[0];
    const base = createDefaultTripStateForRoute(bus.id, route);

    if (bus.progressPercent > 0 || bus.status === 'On Route' || bus.status === 'Delayed') {
      const snapshot = getRouteProgressSnapshot(route, bus.progressPercent);
      states[bus.id] = {
        ...base,
        tripStatus: bus.status === 'Trip Completed' ? 'COMPLETED' : 'ACTIVE',
        stopStatus: bus.status === 'Trip Completed' ? 'COMPLETED' : 'DEPARTED',
        isTripActive: bus.status === 'On Route' || bus.status === 'Delayed',
        isPaused: false,
        currentStopId: snapshot.currentStopId,
        nextStopId: snapshot.nextStopId,
        currentStopIndex: snapshot.currentStopIndex,
        currentStopName: snapshot.currentStopName,
        nextStopName: snapshot.nextStopName,
        etaNextStopMin: snapshot.etaNextStopMin,
        distanceToNextStopKm: snapshot.distanceToNextStopKm,
        routeProgressPercent: snapshot.routeProgressPercent,
        currentLatitude: snapshot.latitude,
        currentLongitude: snapshot.longitude,
        currentLocationLabel: snapshot.currentLocationLabel,
        completedStops: snapshot.completedStops,
        totalStops: snapshot.totalStops,
      };
    } else if (bus.status === 'Trip Completed') {
      const destination = route.stops[route.stops.length - 1];
      const destinationCoords = getStopCoordinate(destination);
      states[bus.id] = {
        ...base,
        tripStatus: 'COMPLETED',
        stopStatus: 'COMPLETED',
        isTripActive: false,
        currentStopId: destination.id,
        nextStopId: destination.id,
        currentStopIndex: route.stops.length - 1,
        currentStopName: destination.name,
        nextStopName: destination.name,
        etaNextStopMin: 0,
        distanceToNextStopKm: 0,
        routeProgressPercent: 100,
        currentLatitude: destinationCoords.latitude,
        currentLongitude: destinationCoords.longitude,
        currentLocationLabel: destination.name,
        completedStops: route.stops.length,
        totalStops: route.stops.length,
      };
    } else {
      states[bus.id] = base;
    }
  });

  return states;
};

const getStopThresholdPercent = (route: Route, stopIndex: number) => {
  if (stopIndex <= 0) return 0;

  const distances = route.stops.slice(1).map((stop) => Math.max(stop.distanceFromPreviousStopKm ?? 1, 0.1));
  const totalDistance = distances.reduce((sum, distance) => sum + distance, 0) || route.distanceKm || 1;
  const completedDistance = distances.slice(0, stopIndex).reduce((sum, distance) => sum + distance, 0);

  return (completedDistance / totalDistance) * 100;
};

const loadInitialTripStates = (buses: Bus[], routes: Route[]): Record<string, TripState> => {
  const savedStates = localStorage.getItem(STORAGE_KEYS.TRIP_STATES);
  if (savedStates) {
    const parsed = JSON.parse(savedStates) as Record<string, TripState>;
    const defaults = buildInitialTripStates(buses, routes);
    return { ...defaults, ...parsed };
  }

  const legacy = localStorage.getItem(STORAGE_KEYS.TRIP_STATE);
  if (legacy) {
    const parsed = JSON.parse(legacy) as TripState;
    const defaults = buildInitialTripStates(buses, routes);
    if (parsed.busId) {
      return { ...defaults, [parsed.busId]: { ...defaults[parsed.busId], ...parsed } };
    }
    return defaults;
  }

  return buildInitialTripStates(buses, routes);
};

const isSimulating = (ts: TripState) =>
  ts.isTripActive && ts.tripStatus === 'ACTIVE' && !ts.isPaused;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const simulationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastAnnouncedStopRef = useRef<Record<string, number>>({});
  const busesRef = useRef<Bus[]>([]);
  const routesRef = useRef<Route[]>(INITIAL_ROUTES);
  const tripStatesRef = useRef<Record<string, TripState>>({});
  const addNotificationRef = useRef<(notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void>(() => {});

  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'student';
  });

  const [selectedDriverId, setSelectedDriverId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_DRIVER);
    if (saved && INITIAL_DRIVERS.some((d) => d.id === saved)) {
      return saved;
    }
    return DEFAULT_DRIVER_ID;
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_STUDENT);
    if (saved && INITIAL_STUDENTS.some((s) => s.id === saved)) {
      return saved;
    }
    return DEFAULT_STUDENT_ID;
  });

  const [buses, setBuses] = useState<Bus[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUSES);
    return saved ? JSON.parse(saved) : INITIAL_BUSES;
  });

  const [routes] = useState<Route[]>(INITIAL_ROUTES);
  const [drivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [students] = useState<Student[]>(INITIAL_STUDENTS);

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [passApplications, setPassApplications] = useState<BusPassApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PASS_APPS);
    return saved ? JSON.parse(saved) : INITIAL_PASS_APPLICATIONS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [tripStates, setTripStates] = useState<Record<string, TripState>>(() => {
    const initialBuses = localStorage.getItem(STORAGE_KEYS.BUSES)
      ? JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSES)!)
      : INITIAL_BUSES;
    return loadInitialTripStates(initialBuses, INITIAL_ROUTES);
  });

  const currentDriver = drivers.find((driver) => driver.id === selectedDriverId) || drivers[0];
  const currentBus = buses.find((bus) => bus.id === currentDriver.assignedBusId) || buses[0];
  const currentRoute = routes.find((route) => route.id === currentDriver.assignedRouteId) || routes[0];
  const currentStudent = students.find((student) => student.id === selectedStudentId) || students[0];

  const getTripStateForBus = useCallback(
    (busId: string): TripState => {
      if (tripStates[busId]) return tripStates[busId];
      const bus = buses.find((candidate) => candidate.id === busId);
      const route = routes.find((candidate) => candidate.id === bus?.routeId) || routes[0];
      return createDefaultTripStateForRoute(busId, route);
    },
    [tripStates, buses, routes]
  );

  const tripState = getTripStateForBus(currentBus.id);

  busesRef.current = buses;
  routesRef.current = routes;
  tripStatesRef.current = tripStates;

  const hasActiveSimulations = useMemo(
    () => Object.values(tripStates).some(isSimulating),
    [tripStates]
  );

  const maxSimulationSpeed = useMemo(() => {
    const speeds = (Object.values(tripStates) as TripState[])
      .filter(isSimulating)
      .map((ts) => ts.simulationSpeed);
    return speeds.length > 0 ? Math.max(...speeds) : 1;
  }, [tripStates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_DRIVER, selectedDriverId);
  }, [selectedDriverId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_STUDENT, selectedStudentId);
  }, [selectedStudentId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUSES, JSON.stringify(buses));
  }, [buses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PASS_APPS, JSON.stringify(passApplications));
  }, [passApplications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRIP_STATES, JSON.stringify(tripStates));
  }, [tripStates]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const selectDriver = (driverId: string) => {
    setSelectedDriverId(driverId);
  };

  const selectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  const clearSimulationTimer = () => {
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  addNotificationRef.current = addNotification;

  // Central simulation loop — updates all active, unpaused buses
  useEffect(() => {
    clearSimulationTimer();

    if (!hasActiveSimulations) {
      return () => clearSimulationTimer();
    }

    const intervalMs = 400;
    simulationTimerRef.current = setInterval(() => {
      const currentRoutes = routesRef.current;
      const prevTripStates = tripStatesRef.current;
      const prevBuses = busesRef.current;
      const nextTripStates = { ...prevTripStates };
      const pendingBusUpdates: Record<string, Partial<Bus>> = {};
      let changed = false;

      prevBuses.forEach((targetBus) => {
        const ts = prevTripStates[targetBus.id];
        if (!ts || !isSimulating(ts)) return;

        const route = currentRoutes.find((candidate) => candidate.id === targetBus.routeId);
        if (!route) return;

        const isDelayed = targetBus.status === 'Delayed';
        const effectiveSpeed = Math.max(ts.simulationSpeed, 1);
        const progressStep = (isDelayed ? 0.5 : 1.2) * effectiveSpeed;
        const nextProgress = clampPercent(targetBus.progressPercent + progressStep);
        const nextSnapshot = getRouteProgressSnapshot(route, nextProgress);
        const nextStopIndex = nextSnapshot.currentStopIndex;

        if (nextProgress >= 100 || nextSnapshot.isDestinationReached) {
          const destination = route.stops[route.stops.length - 1];
          const destinationCoords = getStopCoordinate(destination);

          nextTripStates[targetBus.id] = {
            ...ts,
            tripStatus: 'COMPLETED',
            stopStatus: 'COMPLETED',
            isTripActive: false,
            isPaused: false,
            endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            currentStopId: destination.id,
            nextStopId: destination.id,
            currentStopIndex: route.stops.length - 1,
            currentStopName: destination.name,
            nextStopName: destination.name,
            etaNextStopMin: 0,
            distanceToNextStopKm: 0,
            routeProgressPercent: 100,
            currentLatitude: destinationCoords.latitude,
            currentLongitude: destinationCoords.longitude,
            currentLocationLabel: destination.name,
            completedStops: route.stops.length,
            totalStops: route.stops.length,
          };

          pendingBusUpdates[targetBus.id] = {
            progressPercent: 100,
            currentStopIndex: route.stops.length - 1,
            latitude: destinationCoords.latitude,
            longitude: destinationCoords.longitude,
            status: 'Trip Completed',
            speedKmH: 0,
            lastUpdated: 'Just now',
          };

          addNotificationRef.current({
            title: 'Trip Completed',
            description: `Bus ${targetBus.busNumber} has reached ${destination.name}.`,
            type: 'success',
            targetRouteId: route.id,
          });

          changed = true;
          return;
        }

        if (nextStopIndex !== targetBus.currentStopIndex) {
          const currentStop = route.stops[nextStopIndex];
          const previousStop = route.stops[Math.max(0, nextStopIndex - 1)];
          const lastAnnounced = lastAnnouncedStopRef.current[targetBus.id] ?? -1;

          if (lastAnnounced !== nextStopIndex) {
            lastAnnouncedStopRef.current[targetBus.id] = nextStopIndex;

            addNotificationRef.current({
              title: `Bus arrived at ${currentStop.name}`,
              description: `Bus ${targetBus.busNumber} has reached ${currentStop.name}.`,
              type: 'info',
              targetRouteId: route.id,
            });

            if (previousStop && previousStop.id !== currentStop.id) {
              addNotificationRef.current({
                title: `Bus departed ${previousStop.name}`,
                description: `Bus ${targetBus.busNumber} departed ${previousStop.name}.`,
                type: 'info',
                targetRouteId: route.id,
              });
            }
          }
        }

        nextTripStates[targetBus.id] = {
          ...ts,
          tripStatus: 'ACTIVE',
          stopStatus: 'DEPARTED',
          currentStopId: nextSnapshot.currentStopId,
          nextStopId: nextSnapshot.nextStopId,
          currentStopIndex: nextSnapshot.currentStopIndex,
          currentStopName: nextSnapshot.currentStopName,
          nextStopName: nextSnapshot.nextStopName,
          etaNextStopMin: nextSnapshot.etaNextStopMin,
          distanceToNextStopKm: nextSnapshot.distanceToNextStopKm,
          routeProgressPercent: nextSnapshot.routeProgressPercent,
          currentLatitude: nextSnapshot.latitude,
          currentLongitude: nextSnapshot.longitude,
          currentLocationLabel: nextSnapshot.currentLocationLabel,
          completedStops: nextSnapshot.completedStops,
          totalStops: nextSnapshot.totalStops,
        };

        pendingBusUpdates[targetBus.id] = {
          progressPercent: nextProgress,
          currentStopIndex: nextSnapshot.currentStopIndex,
          latitude: nextSnapshot.latitude,
          longitude: nextSnapshot.longitude,
          speedKmH: isDelayed ? 18 : Math.max(40, Math.round(50 + effectiveSpeed * 4)),
          lastUpdated: 'Just now',
        };

        changed = true;
      });

      if (!changed) return;

      tripStatesRef.current = nextTripStates;
      setTripStates(nextTripStates);

      const nextBuses = prevBuses.map((bus) =>
        pendingBusUpdates[bus.id] ? { ...bus, ...pendingBusUpdates[bus.id] } : bus
      );
      busesRef.current = nextBuses;
      setBuses(nextBuses);
    }, intervalMs);

    return () => clearSimulationTimer();
  }, [hasActiveSimulations, maxSimulationSpeed]);

  const startTrip = (busId = currentBus.id) => {
    const targetBus = buses.find((bus) => bus.id === busId) || currentBus;
    const route = routes.find((candidateRoute) => candidateRoute.id === targetBus.routeId) || currentRoute;
    const startStop = route.stops[0];
    const nextStop = route.stops[1] || route.stops[0];
    const startCoords = getStopCoordinate(startStop);
    const driver = drivers.find((d) => d.assignedBusId === busId);

    lastAnnouncedStopRef.current[busId] = 0;

    setTripStates((prev) => ({
      ...prev,
      [busId]: {
        ...(prev[busId] ?? createDefaultTripStateForRoute(busId, route)),
        tripStatus: 'ACTIVE',
        stopStatus: 'DEPARTED',
        isTripActive: true,
        isPaused: false,
        startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: undefined,
        routeId: route.id,
        busId,
        currentStopId: startStop.id,
        nextStopId: nextStop.id,
        currentStopIndex: 0,
        currentStopName: startStop.name,
        nextStopName: nextStop.name,
        etaNextStopMin: nextStop.estimatedTravelTimeFromPreviousStopMin ?? 4,
        distanceToNextStopKm: nextStop.distanceFromPreviousStopKm ?? 1.2,
        routeProgressPercent: 0,
        currentLatitude: startCoords.latitude,
        currentLongitude: startCoords.longitude,
        currentLocationLabel: startStop.name,
        completedStops: 0,
        totalStops: route.stops.length,
        simulationSpeed: 2,
      },
    }));

    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId
          ? {
              ...bus,
              routeId: route.id,
              routeName: `${route.code} – ${route.name}`,
              status: 'On Route',
              progressPercent: 0,
              currentStopIndex: 0,
              latitude: startCoords.latitude,
              longitude: startCoords.longitude,
              speedKmH: 28,
              lastUpdated: 'Just now',
            }
          : bus
      )
    );

    addNotification({
      title: 'Trip Started',
      description: `Bus ${targetBus.busNumber} trip has been started by driver ${driver?.name ?? targetBus.driverName}. Live tracking is now active.`,
      type: 'info',
      targetRouteId: route.id,
    });
  };

  const pauseTrip = (busId = currentBus.id) => {
    const ts = getTripStateForBus(busId);
    if (!ts.isTripActive || ts.tripStatus === 'COMPLETED' || ts.tripStatus === 'NOT_STARTED') return;

    setTripStates((prev) => ({
      ...prev,
      [busId]: { ...ts, isPaused: true },
    }));

    setBuses((prev) =>
      prev.map((bus) => (bus.id === busId ? { ...bus, speedKmH: 0, lastUpdated: 'Just now' } : bus))
    );
  };

  const resumeTrip = (busId = currentBus.id) => {
    const ts = getTripStateForBus(busId);
    if (!ts.isTripActive || ts.tripStatus === 'COMPLETED') return;

    setTripStates((prev) => ({
      ...prev,
      [busId]: { ...ts, isPaused: false, tripStatus: 'ACTIVE', stopStatus: 'DEPARTED' },
    }));

    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId
          ? {
              ...bus,
              speedKmH: bus.status === 'Delayed' ? 12 : 28,
              lastUpdated: 'Just now',
            }
          : bus
      )
    );
  };

  const arriveAtNextStop = (busId = currentBus.id) => {
    const targetBus = buses.find((bus) => bus.id === busId) || currentBus;
    const route = routes.find((candidateRoute) => candidateRoute.id === targetBus.routeId) || currentRoute;
    const ts = getTripStateForBus(busId);
    const nextStopIndex = Math.min((ts.currentStopIndex ?? 0) + 1, route.stops.length - 1);
    const arrivedStop = route.stops[nextStopIndex];
    const arrivedSnapshot = getRouteProgressSnapshot(route, getStopThresholdPercent(route, nextStopIndex));
    const arrivedCoords = getStopCoordinate(arrivedStop);

    setTripStates((prev) => ({
      ...prev,
      [busId]: {
        ...ts,
        tripStatus: nextStopIndex === route.stops.length - 1 ? 'COMPLETED' : 'AT_STOP',
        stopStatus: nextStopIndex === route.stops.length - 1 ? 'COMPLETED' : 'ARRIVED',
        isTripActive: nextStopIndex !== route.stops.length - 1,
        isPaused: true,
        currentStopId: arrivedStop.id,
        nextStopId: route.stops[Math.min(nextStopIndex + 1, route.stops.length - 1)]?.id,
        currentStopIndex: nextStopIndex,
        currentStopName: arrivedStop.name,
        nextStopName: route.stops[Math.min(nextStopIndex + 1, route.stops.length - 1)]?.name || arrivedStop.name,
        etaNextStopMin: arrivedSnapshot.etaNextStopMin,
        distanceToNextStopKm: arrivedSnapshot.distanceToNextStopKm,
        routeProgressPercent: arrivedSnapshot.routeProgressPercent,
        currentLatitude: arrivedCoords.latitude,
        currentLongitude: arrivedCoords.longitude,
        currentLocationLabel: arrivedStop.name,
        completedStops: nextStopIndex + 1,
        totalStops: route.stops.length,
      },
    }));

    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId
          ? {
              ...bus,
              progressPercent: arrivedSnapshot.routeProgressPercent,
              currentStopIndex: nextStopIndex,
              latitude: arrivedCoords.latitude,
              longitude: arrivedCoords.longitude,
              speedKmH: 0,
              lastUpdated: 'Just now',
            }
          : bus
      )
    );

    addNotification({
      title: 'Bus Arrived at Stop',
      description: `Bus ${targetBus.busNumber} has arrived at ${arrivedStop.name}.`,
      type: 'info',
      targetRouteId: route.id,
    });
  };

  const departStop = (busId = currentBus.id) => {
    const targetBus = buses.find((bus) => bus.id === busId) || currentBus;
    const route = routes.find((candidateRoute) => candidateRoute.id === targetBus.routeId) || currentRoute;
    const ts = getTripStateForBus(busId);
    const currentStopIndex = Math.min(ts.currentStopIndex ?? 0, route.stops.length - 1);
    const currentStop = route.stops[currentStopIndex];
    const currentCoords = getStopCoordinate(currentStop);
    const nextStop = route.stops[Math.min(currentStopIndex + 1, route.stops.length - 1)] || currentStop;

    setTripStates((prev) => ({
      ...prev,
      [busId]: {
        ...ts,
        tripStatus: currentStopIndex === route.stops.length - 1 ? 'COMPLETED' : 'ACTIVE',
        stopStatus: 'DEPARTED',
        isTripActive: currentStopIndex !== route.stops.length - 1,
        isPaused: false,
        currentStopId: currentStop.id,
        nextStopId: nextStop.id,
        currentStopName: currentStop.name,
        nextStopName: nextStop.name,
        etaNextStopMin: nextStop.estimatedTravelTimeFromPreviousStopMin ?? 4,
        distanceToNextStopKm: nextStop.distanceFromPreviousStopKm ?? 1.2,
        currentLatitude: currentCoords.latitude,
        currentLongitude: currentCoords.longitude,
        currentLocationLabel: `Near ${currentStop.name}`,
        completedStops: currentStopIndex + 1,
        totalStops: route.stops.length,
      },
    }));

    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId
          ? {
              ...bus,
              status: currentStopIndex === route.stops.length - 1 ? 'Trip Completed' : 'On Route',
              currentStopIndex,
              latitude: currentCoords.latitude,
              longitude: currentCoords.longitude,
              speedKmH: currentStopIndex === route.stops.length - 1 ? 0 : 28,
              lastUpdated: 'Just now',
            }
          : bus
      )
    );
  };

  const advanceTrip = (busId = currentBus.id) => {
    const targetBus = buses.find((bus) => bus.id === busId) || currentBus;
    const route = routes.find((candidateRoute) => candidateRoute.id === targetBus.routeId) || currentRoute;
    const ts = getTripStateForBus(busId);
    const nextIndex = Math.min((ts.currentStopIndex ?? 0) + 1, route.stops.length - 1);

    if (nextIndex === route.stops.length - 1 && ts.tripStatus === 'COMPLETED') {
      return;
    }

    const thresholdPercent = getStopThresholdPercent(route, nextIndex);
    const snapshot = getRouteProgressSnapshot(route, thresholdPercent);
    const stop = route.stops[nextIndex];
    const stopCoords = getStopCoordinate(stop);

    setTripStates((prev) => ({
      ...prev,
      [busId]: {
        ...ts,
        tripStatus: nextIndex === route.stops.length - 1 ? 'COMPLETED' : 'AT_STOP',
        stopStatus: nextIndex === route.stops.length - 1 ? 'COMPLETED' : 'ARRIVED',
        isTripActive: nextIndex !== route.stops.length - 1,
        isPaused: nextIndex !== route.stops.length - 1,
        currentStopId: stop.id,
        nextStopId: route.stops[Math.min(nextIndex + 1, route.stops.length - 1)]?.id,
        currentStopIndex: nextIndex,
        currentStopName: stop.name,
        nextStopName: route.stops[Math.min(nextIndex + 1, route.stops.length - 1)]?.name || stop.name,
        etaNextStopMin: snapshot.etaNextStopMin,
        distanceToNextStopKm: snapshot.distanceToNextStopKm,
        routeProgressPercent: snapshot.routeProgressPercent,
        currentLatitude: stopCoords.latitude,
        currentLongitude: stopCoords.longitude,
        currentLocationLabel: stop.name,
        completedStops: nextIndex + 1,
        totalStops: route.stops.length,
      },
    }));

    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId
          ? {
              ...bus,
              progressPercent: thresholdPercent,
              currentStopIndex: nextIndex,
              latitude: stopCoords.latitude,
              longitude: stopCoords.longitude,
              speedKmH: nextIndex === route.stops.length - 1 ? 0 : 24,
              status: nextIndex === route.stops.length - 1 ? 'Trip Completed' : 'On Route',
              lastUpdated: 'Just now',
            }
          : bus
      )
    );
  };

  const endTrip = (busId = currentBus.id) => {
    const targetBus = buses.find((bus) => bus.id === busId) || currentBus;
    const route = routes.find((candidateRoute) => candidateRoute.id === targetBus.routeId) || currentRoute;
    const destination = route.stops[route.stops.length - 1];
    const destinationCoords = getStopCoordinate(destination);
    const ts = getTripStateForBus(busId);

    setTripStates((prev) => ({
      ...prev,
      [busId]: {
        ...ts,
        tripStatus: 'COMPLETED',
        stopStatus: 'COMPLETED',
        isTripActive: false,
        isPaused: false,
        endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        currentStopId: destination.id,
        nextStopId: destination.id,
        currentStopIndex: route.stops.length - 1,
        currentStopName: destination.name,
        nextStopName: destination.name,
        etaNextStopMin: 0,
        distanceToNextStopKm: 0,
        routeProgressPercent: 100,
        currentLatitude: destinationCoords.latitude,
        currentLongitude: destinationCoords.longitude,
        currentLocationLabel: destination.name,
        completedStops: route.stops.length,
        totalStops: route.stops.length,
      },
    }));

    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId
          ? {
              ...bus,
              status: 'Trip Completed',
              speedKmH: 0,
              progressPercent: 100,
              currentStopIndex: route.stops.length - 1,
              latitude: destinationCoords.latitude,
              longitude: destinationCoords.longitude,
              lastUpdated: 'Just now',
            }
          : bus
      )
    );

    addNotification({
      title: 'Trip Completed',
      description: `Bus ${targetBus.busNumber} has reached ${destination.name}.`,
      type: 'success',
      targetRouteId: route.id,
    });
  };

  const reportIncident = (type: Incident['type'], description = 'Driver reported emergency event on the active route.', busId = currentBus.id) => {
    const targetBus = buses.find((b) => b.id === busId) || currentBus;
    const route = routes.find((r) => r.id === targetBus.routeId) || currentRoute;
    const ts = getTripStateForBus(busId);
    const locationName = ts.currentLocationLabel || ts.currentStopName || route.stops[targetBus.currentStopIndex]?.name || route.startPoint;

    const newIncident: Incident = {
      id: 'inc-' + Date.now(),
      busId: targetBus.id,
      busNumber: targetBus.busNumber,
      driverName: targetBus.driverName,
      routeName: targetBus.routeName,
      type,
      locationName,
      timestamp: 'Just now',
      description,
      status: 'Reported',
    };

    setIncidents((prev) => [newIncident, ...prev]);

    const newStatus: BusStatus = type === 'BREAKDOWN' ? 'Breakdown' : 'Emergency';
    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === targetBus.id ? { ...bus, status: newStatus, speedKmH: 0, lastUpdated: 'Just now' } : bus
      )
    );

    setTripStates((prev) => ({
      ...prev,
      [busId]: {
        ...ts,
        tripStatus: type === 'BREAKDOWN' ? 'BREAKDOWN' : 'EMERGENCY',
        stopStatus: 'ARRIVED',
        isPaused: true,
      },
    }));

    addNotification({
      title: `CRITICAL ALERT: ${type}`,
      description: `Bus ${targetBus.busNumber} reported ${type} at ${locationName}. Transport administrator notified.`,
      type: 'danger',
      targetRole: 'all',
      targetRouteId: route.id,
    });
  };

  const reportDelay = (reason = 'Traffic', busId = currentBus.id) => {
    const targetBus = buses.find((b) => b.id === busId) || currentBus;
    const route = routes.find((r) => r.id === targetBus.routeId) || currentRoute;
    const ts = getTripStateForBus(busId);

    setTripStates((prev) => ({
      ...prev,
      [busId]: {
        ...ts,
        tripStatus: 'ACTIVE',
        stopStatus: 'DEPARTED',
        isPaused: false,
      },
    }));

    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === targetBus.id ? { ...bus, status: 'Delayed', speedKmH: 12, lastUpdated: 'Just now' } : bus
      )
    );

    addNotification({
      title: 'Route Delay Reported',
      description: `Bus ${targetBus.busNumber} is delayed due to ${reason.toLowerCase()} on ${route.name}.`,
      type: 'warning',
      targetRouteId: route.id,
    });
  };

  const reportBreakdown = (description = 'Mechanical breakdown reported by driver.') => {
    reportIncident('BREAKDOWN', description);
  };

  const reportEmergency = (type: 'ACCIDENT' | 'MEDICAL EMERGENCY' | 'OTHER ISSUE' = 'OTHER ISSUE') => {
    reportIncident(type, `Emergency escalation: ${type.toLowerCase()} reported by driver.`);
  };

  const triggerSOS = (description = 'SOS triggered by driver from the active bus.') => {
    reportIncident('SOS', description);
  };

  const acknowledgeIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id ? { ...inc, status: 'Acknowledged', acknowledgedAt: 'Just now' } : inc
      )
    );

    addNotification({
      title: 'Incident Acknowledged',
      description: 'Transport control room has acknowledged the emergency report and dispatched assistance.',
      type: 'warning',
    });
  };

  const resolveIncident = (id: string) => {
    const incident = incidents.find((inc) => inc.id === id);
    const busId = incident?.busId ?? currentBus.id;

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id ? { ...inc, status: 'Resolved', resolvedAt: 'Just now' } : inc
      )
    );

    setBuses((prev) =>
      prev.map((b) => (b.id === busId ? { ...b, status: 'On Route', speedKmH: 30 } : b))
    );

    const ts = getTripStateForBus(busId);
    setTripStates((prev) => ({
      ...prev,
      [busId]: {
        ...ts,
        tripStatus: 'ACTIVE',
        stopStatus: 'DEPARTED',
        isTripActive: true,
        isPaused: false,
      },
    }));

    addNotification({
      title: 'Incident Resolved',
      description: `The incident has been resolved. Bus ${buses.find((b) => b.id === busId)?.busNumber ?? ''} has resumed normal operation.`,
      type: 'success',
    });
  };

  const applyForPass = (data: Omit<BusPassApplication, 'id' | 'submittedDate' | 'status'>) => {
    const newApp: BusPassApplication = {
      ...data,
      id: 'app-' + Date.now(),
      submittedDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Pending',
    };

    setPassApplications((prev) => [newApp, ...prev]);

    addNotification({
      title: 'Bus Pass Application Submitted',
      description: 'Your application for Route A bus pass has been submitted and is pending Admin approval.',
      type: 'info',
    });
  };

  const approvePass = (id: string) => {
    setPassApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'Approved' } : app))
    );

    addNotification({
      title: 'Bus Pass Approved',
      description: 'Congratulations! Your digital bus pass application has been approved by the Administrator.',
      type: 'success',
    });
  };

  const rejectPass = (id: string, reason = 'Document verification failed.') => {
    setPassApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: 'Rejected', rejectionReason: reason } : app
      )
    );

    addNotification({
      title: 'Bus Pass Application Rejected',
      description: `Your application was rejected: ${reason}. Please re-submit with clear photos.`,
      type: 'danger',
    });
  };

  const processPayment = async (
    method: 'UPI' | 'Card' | 'Net Banking',
    amount: number
  ): Promise<PaymentRecord> => {
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const txnId = 'EY2026TXN' + Math.floor(100 + Math.random() * 900);
    const newPayment: PaymentRecord = {
      id: 'pay-' + Date.now(),
      transactionId: txnId,
      studentId: currentStudent.studentId,
      studentName: currentStudent.name,
      passId: 'EY-2026-001',
      amount,
      method,
      date: new Date().toLocaleString([], {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Paid',
    };

    setPayments((prev) => [newPayment, ...prev]);

    addNotification({
      title: 'Payment Successful',
      description: `Payment of ₹${amount.toLocaleString()} processed via ${method}. Transaction ID: ${txnId}.`,
      type: 'success',
    });

    return newPayment;
  };

  const sendAnnouncement = (title: string, description: string, targetRouteId?: string) => {
    addNotification({
      title: `ANNOUNCEMENT: ${title}`,
      description,
      type: 'warning',
      targetRole: 'all',
      targetRouteId,
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const updateBusStatus = (busId: string, status: BusStatus) => {
    setBuses((prev) => prev.map((b) => (b.id === busId ? { ...b, status } : b)));
  };

  const setSimulationSpeed = (speed: number) => {
    setTripStates((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((busId) => {
        next[busId] = { ...next[busId], simulationSpeed: speed };
      });
      return next;
    });
  };

  const triggerDemoBreakdown = () => {
    reportBreakdown('Demonstration Trigger: Engine breakdown reported on Bus A-101.');
  };

  const triggerDemoAccident = () => {
    reportEmergency('ACCIDENT');
  };

  const triggerDemoDelay = () => {
    reportDelay('Traffic');
  };

  const resetDemoData = () => {
    clearSimulationTimer();
    lastAnnouncedStopRef.current = {};
    setSelectedDriverId(DEFAULT_DRIVER_ID);
    setSelectedStudentId(DEFAULT_STUDENT_ID);

    localStorage.removeItem(STORAGE_KEYS.BUSES);
    localStorage.removeItem(STORAGE_KEYS.INCIDENTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.PASS_APPS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.TRIP_STATES);
    localStorage.removeItem(STORAGE_KEYS.TRIP_STATE);

    setBuses(INITIAL_BUSES);
    setIncidents(INITIAL_INCIDENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setPassApplications(INITIAL_PASS_APPLICATIONS);
    setPayments(INITIAL_PAYMENTS);
    setTripStates(buildInitialTripStates(INITIAL_BUSES, INITIAL_ROUTES));
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        selectedDriverId,
        selectDriver,
        selectedStudentId,
        selectStudent,
        currentStudent,
        currentDriver,
        buses,
        routes,
        drivers,
        students,
        incidents,
        notifications,
        passApplications,
        payments,
        tripStates,
        tripState,
        getTripStateForBus,
        startTrip,
        pauseTrip,
        resumeTrip,
        endTrip,
        reportIncident,
        acknowledgeIncident,
        resolveIncident,
        applyForPass,
        approvePass,
        rejectPass,
        processPayment,
        sendAnnouncement,
        markNotificationRead,
        markAllNotificationsRead,
        updateBusStatus,
        setSimulationSpeed,
        arriveAtNextStop,
        departStop,
        advanceTrip,
        reportDelay,
        reportBreakdown,
        reportEmergency,
        triggerSOS,
        triggerDemoBreakdown,
        triggerDemoAccident,
        triggerDemoDelay,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
