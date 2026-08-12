export type UserRole = 'student' | 'driver' | 'admin';

export type BusStatus = 'At College' | 'On Route' | 'Delayed' | 'Breakdown' | 'Emergency' | 'Trip Completed';

export interface BusStop {
  id: string;
  name: string;
  x: number; // SVG map X percentage (0-100)
  y: number; // SVG map Y percentage (0-100)
  estimatedMinutesFromStart: number;
  status?: 'Departed' | 'Arriving Soon' | 'Upcoming';
}

export interface Route {
  id: string;
  name: string;
  code: string; // e.g. "Route A"
  startPoint: string;
  endPoint: string;
  stops: BusStop[];
  assignedBusId: string;
  distanceKm: number;
  totalDurationMin: number;
}

export interface Bus {
  id: string;
  busNumber: string; // e.g. "A-101"
  registrationNumber: string; // e.g. "MH 12 AB 1234"
  driverName: string;
  driverPhone: string;
  routeId: string;
  routeName: string;
  capacity: number;
  currentOccupancy: number;
  speedKmH: number;
  status: BusStatus;
  currentStopIndex: number;
  progressPercent: number; // 0 to 100 along the route
  latitude?: number;
  longitude?: number;
  lastUpdated: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  assignedBusId: string;
  assignedRouteId: string;
  status: 'Off Duty' | 'On Duty' | 'Driving';
  rating: number;
  photoUrl: string;
}

export interface Student {
  id: string;
  studentId: string; // STU2026001
  name: string;
  email: string;
  department: string;
  phone: string;
  assignedRouteId: string;
  assignedBusId: string;
  passStatus: 'Active' | 'Approved' | 'Pending' | 'Expired' | 'Rejected';
  passExpiryDate: string;
  photoUrl: string;
  signatureUrl?: string;
}

export interface Incident {
  id: string;
  busId: string;
  busNumber: string;
  driverName: string;
  routeName: string;
  type: 'ACCIDENT' | 'BREAKDOWN' | 'MEDICAL EMERGENCY' | 'OTHER ISSUE' | 'SOS';
  locationName: string;
  timestamp: string;
  description: string;
  status: 'Reported' | 'Acknowledged' | 'Resolved';
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface BusPassApplication {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  routeId: string;
  routeName: string;
  passType: 'Monthly' | 'Semester' | 'Annual';
  amount: number;
  submittedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  photoUrl: string;
  signatureUrl: string;
  rejectionReason?: string;
}

export interface PaymentRecord {
  id: string;
  transactionId: string;
  studentId: string;
  studentName: string;
  passId: string;
  amount: number;
  method: 'UPI' | 'Card' | 'Net Banking';
  date: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  read: boolean;
  targetRole?: UserRole | 'all';
  targetRouteId?: string;
}

export interface TripState {
  isTripActive: boolean;
  startTime?: string;
  endTime?: string;
  currentStopName: string;
  nextStopName: string;
  etaNextStopMin: number;
  simulationSpeed: number; // 1, 2, 5
  isPaused: boolean;
}
