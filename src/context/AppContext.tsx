import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bus, BusPassApplication, AppNotification, Driver, Incident, PaymentRecord, Route, Student, UserRole, TripState, BusStatus } from '../types';
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
  tripState: TripState;
  
  // Actions
  startTrip: (busId?: string) => void;
  pauseTrip: (busId?: string) => void;
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
  triggerDemoBreakdown: () => void;
  triggerDemoAccident: () => void;
  triggerDemoDelay: () => void;
  resetDemoData: () => void;
}

const STORAGE_KEYS = {
  ROLE: 'eyantra_role',
  BUSES: 'eyantra_buses',
  INCIDENTS: 'eyantra_incidents',
  NOTIFICATIONS: 'eyantra_notifications',
  PASS_APPS: 'eyantra_pass_apps',
  PAYMENTS: 'eyantra_payments',
  TRIP_STATE: 'eyantra_trip_state',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or fallback to mock defaults
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'student';
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

  const [tripState, setTripState] = useState<TripState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRIP_STATE);
    return saved
      ? JSON.parse(saved)
      : {
          isTripActive: true,
          startTime: '08:00 AM',
          currentStopName: 'Shivajinagar',
          nextStopName: 'Deccan Gymkhana',
          etaNextStopMin: 12,
          simulationSpeed: 1,
          isPaused: false,
        };
  });

  const currentStudent = students[0]; // Vedika Chandratre
  const currentDriver = drivers[0];   // Rahul Patil (Bus A-101)

  // Persist state updates to LocalStorage and dispatch custom cross-tab events
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

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
    localStorage.setItem(STORAGE_KEYS.TRIP_STATE, JSON.stringify(tripState));
  }, [tripState]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  // Simulation interval for advancing bus position along route
  useEffect(() => {
    if (!tripState.isTripActive || tripState.isPaused) return;

    const intervalMs = 2000 / tripState.simulationSpeed; // ticks every ~2s adjusted by speed

    const timer = setInterval(() => {
      setBuses((prevBuses) => {
        return prevBuses.map((bus) => {
          if (bus.id === 'bus-a101' && bus.status === 'On Route') {
            let nextProgress = bus.progressPercent + 2.5; // step increment
            let nextStopIndex = bus.currentStopIndex;

            if (nextProgress >= 100) {
              nextProgress = 100;
              return {
                ...bus,
                progressPercent: 100,
                status: 'Trip Completed',
                speedKmH: 0,
                lastUpdated: 'Just now',
              };
            }

            // Route A stops calculation (6 stops)
            const stopThresholds = [0, 20, 40, 60, 80, 100];
            for (let i = 0; i < stopThresholds.length; i++) {
              if (nextProgress >= stopThresholds[i]) {
                nextStopIndex = i;
              }
            }

            return {
              ...bus,
              progressPercent: nextProgress,
              currentStopIndex: nextStopIndex,
              lastUpdated: 'Just now',
            };
          }
          return bus;
        });
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [tripState.isTripActive, tripState.isPaused, tripState.simulationSpeed]);

  // Actions
  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: 'notif-' + Date.now(),
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const startTrip = (busId = 'bus-a101') => {
    setTripState((prev) => ({
      ...prev,
      isTripActive: true,
      isPaused: false,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    setBuses((prev) =>
      prev.map((b) =>
        b.id === busId
          ? { ...b, status: 'On Route', progressPercent: b.progressPercent >= 100 ? 5 : b.progressPercent, speedKmH: 34 }
          : b
      )
    );

    addNotification({
      title: 'Trip Started',
      description: `Bus A-101 trip has been started by driver ${currentDriver.name}. Live tracking active.`,
      type: 'info',
      targetRouteId: 'route-a',
    });
  };

  const pauseTrip = (busId = 'bus-a101') => {
    setTripState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
    setBuses((prev) =>
      prev.map((b) => (b.id === busId ? { ...b, speedKmH: b.speedKmH === 0 ? 30 : 0 } : b))
    );
  };

  const endTrip = (busId = 'bus-a101') => {
    setTripState((prev) => ({ ...prev, isTripActive: false, isPaused: false }));
    setBuses((prev) =>
      prev.map((b) => (b.id === busId ? { ...b, status: 'Trip Completed', speedKmH: 0 } : b))
    );

    addNotification({
      title: 'Trip Completed',
      description: 'Bus A-101 has successfully arrived at destination Kothrud Depot.',
      type: 'success',
      targetRouteId: 'route-a',
    });
  };

  const reportIncident = (type: Incident['type'], description = 'Driver reported emergency event on Route A.') => {
    const targetBus = buses.find((b) => b.id === 'bus-a101') || buses[0];

    const newIncident: Incident = {
      id: 'inc-' + Date.now(),
      busId: targetBus.id,
      busNumber: targetBus.busNumber,
      driverName: targetBus.driverName,
      routeName: targetBus.routeName,
      type,
      locationName: 'Near Shivajinagar Chowk',
      timestamp: 'Just now',
      description,
      status: 'Reported',
    };

    setIncidents((prev) => [newIncident, ...prev]);

    // Update bus status to Emergency or Breakdown
    const newStatus: BusStatus = type === 'BREAKDOWN' ? 'Breakdown' : 'Emergency';
    setBuses((prev) =>
      prev.map((b) => (b.id === targetBus.id ? { ...b, status: newStatus, speedKmH: 0 } : b))
    );

    addNotification({
      title: `CRITICAL ALERT: ${type}`,
      description: `Bus ${targetBus.busNumber} reported ${type} at Near Shivajinagar Chowk. Transport administrator notified.`,
      type: 'danger',
      targetRole: 'all',
    });
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
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id ? { ...inc, status: 'Resolved', resolvedAt: 'Just now' } : inc
      )
    );

    // Reset bus status back to On Route
    setBuses((prev) =>
      prev.map((b) => (b.id === 'bus-a101' ? { ...b, status: 'On Route', speedKmH: 28 } : b))
    );

    addNotification({
      title: 'Incident Resolved',
      description: 'The incident has been resolved. Bus A-101 has resumed normal operation.',
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
    // 2-second simulation delay
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
    setTripState((prev) => ({ ...prev, simulationSpeed: speed }));
  };

  const triggerDemoBreakdown = () => {
    reportIncident('BREAKDOWN', 'Demonstration Trigger: Engine breakdown reported on Bus A-101.');
  };

  const triggerDemoAccident = () => {
    reportIncident('ACCIDENT', 'Demonstration Trigger: Minor vehicle collision reported at University Circle.');
  };

  const triggerDemoDelay = () => {
    setBuses((prev) =>
      prev.map((b) => (b.id === 'bus-a101' ? { ...b, status: 'Delayed', speedKmH: 12 } : b))
    );
    addNotification({
      title: 'Route Delay Reported',
      description: 'Route A is experiencing a 15-minute traffic delay at Shivajinagar junction.',
      type: 'warning',
      targetRouteId: 'route-a',
    });
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.BUSES);
    localStorage.removeItem(STORAGE_KEYS.INCIDENTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.PASS_APPS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.TRIP_STATE);

    setBuses(INITIAL_BUSES);
    setIncidents(INITIAL_INCIDENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setPassApplications(INITIAL_PASS_APPLICATIONS);
    setPayments(INITIAL_PAYMENTS);
    setTripState({
      isTripActive: true,
      startTime: '08:00 AM',
      currentStopName: 'Shivajinagar',
      nextStopName: 'Deccan Gymkhana',
      etaNextStopMin: 12,
      simulationSpeed: 1,
      isPaused: false,
    });
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
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
        tripState,
        startTrip,
        pauseTrip,
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
