export type UserRole = 'student' | 'driver' | 'admin';

export type StudentGender = 'female' | 'male' | 'other';

export interface Student {
  id: string;
  prn: string; // Permanent Registration Number
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  branch: string; // e.g., 'Computer Engineering'
  year: 'FE' | 'SE' | 'TE' | 'BE';
  division: string;
  avatarSeed: string; // seed for unique colorful avatar
  avatarBg: string;
  gender: StudentGender;
  assignedRouteId: string;
  assignedBusId: string;
  stopName: string;
  stopPickupTime: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  bloodGroup: string;
  passStatus: 'ACTIVE' | 'PENDING_RENEWAL' | 'EXPIRED' | 'BLOCKED';
}

export interface RouteStop {
  id: string;
  name: string;
  landmark: string;
  morningPickup: string; // e.g., '07:20 AM'
  eveningDrop: string; // e.g., '05:40 PM'
  sequence: number;
  latitude: number;
  longitude: number;
  isMainJunction?: boolean;
}

export interface BusRoute {
  id: string;
  routeNumber: string;
  name: string;
  source: string;
  destination: string;
  totalDistanceKm: number;
  estimatedDurationMins: number;
  morningDeparture: string;
  eveningCampusDeparture: string;
  assignedBusId: string;
  stops: RouteStop[];
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  altPhone?: string;
  licenseNumber: string;
  experienceYears: number;
  rating: number;
  avatarBg: string;
  badgeNumber: string;
  assignedBusNumber: string;
}

export interface BusVehicle {
  id: string;
  busNumber: string; // e.g. 'Bus 04'
  plateNumber: string; // e.g. 'MH-15-EG-4021'
  model: string; // e.g. 'Tata Starbus 48S'
  capacity: number;
  currentOccupancy: number;
  routeId: string;
  driverId: string;
  status: 'ON_ROUTE' | 'AT_STOP' | 'AT_CAMPUS' | 'MAINTENANCE' | 'IDLE';
  currentSpeedKmH: number;
  fuelPercent: number;
  lastUpdated: string;
  currentLocationName: string;
  isAC: boolean;
  gpsActive: boolean;
}

export interface BusPass {
  id: string;
  passNumber: string; // e.g. 'KKW-2026-BUS-0421'
  studentId: string;
  academicYear: string;
  validFrom: string;
  validTill: string;
  term: 'Semester 1 & 2' | 'Semester 3 & 4' | 'Semester 5 & 6' | 'Semester 7 & 8';
  qrData: string;
  feePaid: number;
  paymentRef: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  approvedBy: string;
  approvedDate: string;
}

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
  studentId: string;
  amount: number;
  date: string;
  paymentMode: 'UPI' | 'NET_BANKING' | 'CREDIT_DEBIT_CARD' | 'COLLEGE_CHALLAN';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  term: string;
  transactionRef: string;
  pdfAvailable: boolean;
}

export interface TransitNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'DELAY' | 'ROUTE_ALERT' | 'FEE_REMINDER' | 'ANNOUNCEMENT' | 'EMERGENCY';
  routeId?: string;
  isRead: boolean;
}

export type StudentActiveTab = 
  | 'home' 
  | 'buses-routes' 
  | 'tracking' 
  | 'pass' 
  | 'route-detail' 
  | 'payments' 
  | 'notifications' 
  | 'profile';
