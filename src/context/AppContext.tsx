import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  BusRoute,
  Driver,
  BusVehicle,
  BusPass,
  PaymentRecord,
  TransitNotification,
  UserRole,
  StudentActiveTab,
  StudentGender,
} from '../types';
import {
  MOCK_STUDENTS,
  MOCK_BUS_ROUTES,
  MOCK_DRIVERS,
  MOCK_BUS_FLEET,
  MOCK_BUS_PASS,
  MOCK_PAYMENTS,
  MOCK_NOTIFICATIONS,
} from '../data/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentStudent: Student;
  setCurrentStudentId: (id: string) => void;
  allStudents: Student[];
  studentTab: StudentActiveTab;
  setStudentTab: (tab: StudentActiveTab) => void;
  routes: BusRoute[];
  drivers: Driver[];
  fleet: BusVehicle[];
  currentBus: BusVehicle | undefined;
  currentRoute: BusRoute | undefined;
  currentDriver: Driver | undefined;
  activePass: BusPass;
  payments: PaymentRecord[];
  notifications: TransitNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateStudentAvatar: (seed: string, gender: StudentGender, bg: string) => void;
  // Simulation State
  busProgressPercent: number;
  currentSpeed: number;
  isSimulating: boolean;
  toggleSimulation: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Selected Route or Bus for detailed inspector
  selectedRouteId: string | null;
  setSelectedRouteId: (id: string | null) => void;
  selectedBusId: string | null;
  setSelectedBusId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('student');
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [currentStudentId, setCurrentStudentId] = useState<string>('std-01');
  const [studentTab, setStudentTab] = useState<StudentActiveTab>('home');
  const [fleet, setFleet] = useState<BusVehicle[]>(MOCK_BUS_FLEET);
  const [routes] = useState<BusRoute[]>(MOCK_BUS_ROUTES);
  const [drivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [notifications, setNotifications] = useState<TransitNotification[]>(MOCK_NOTIFICATIONS);
  const [payments] = useState<PaymentRecord[]>(MOCK_PAYMENTS);
  const [activePass] = useState<BusPass>(MOCK_BUS_PASS);

  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  // Live simulation for student bus
  const [busProgressPercent, setBusProgressPercent] = useState<number>(62);
  const [currentSpeed, setCurrentSpeed] = useState<number>(36);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Find active student
  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  // Current bus & route & driver for this student
  const currentRoute = routes.find((r) => r.id === currentStudent.assignedRouteId);
  const currentBus = fleet.find((b) => b.id === currentStudent.assignedBusId);
  const currentDriver = drivers.find((d) => d.id === currentBus?.driverId);

  // Real-time ticking simulation
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setBusProgressPercent((prev) => {
        const next = prev >= 98 ? 15 : prev + 1.2;
        return Number(next.toFixed(1));
      });

      // Realistic speed fluctuation
      setCurrentSpeed((prev) => {
        const delta = (Math.random() - 0.48) * 4;
        const newSpeed = Math.max(18, Math.min(52, prev + delta));
        return Math.round(newSpeed);
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const toggleSimulation = () => {
    setIsSimulating((prev) => !prev);
    showToast(isSimulating ? 'GPS tracking paused' : 'GPS tracking live updating');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read');
  };

  const updateStudentAvatar = (seed: string, gender: StudentGender, bg: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === currentStudentId
          ? { ...s, avatarSeed: seed, gender, avatarBg: bg }
          : s
      )
    );
    showToast('Avatar profile updated successfully');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentStudent,
        setCurrentStudentId,
        allStudents: students,
        studentTab,
        setStudentTab,
        routes,
        drivers,
        fleet,
        currentBus,
        currentRoute,
        currentDriver,
        activePass,
        payments,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateStudentAvatar,
        busProgressPercent,
        currentSpeed,
        isSimulating,
        toggleSimulation,
        toastMessage,
        showToast,
        selectedRouteId,
        setSelectedRouteId,
        selectedBusId,
        setSelectedBusId,
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
