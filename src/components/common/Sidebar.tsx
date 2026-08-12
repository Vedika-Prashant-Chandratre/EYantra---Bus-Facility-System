import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Navigation,
  MapPin,
  CreditCard,
  CreditCard as PassIcon,
  Bell,
  User,
  Truck,
  AlertTriangle,
  LayoutDashboard,
  Map,
  Users,
  Bus as BusIcon,
  UserCheck,
  FileCheck,
  DollarSign,
  Megaphone,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { role, incidents } = useApp();

  const activeIncidentsCount = incidents.filter((i) => i.status !== 'Resolved').length;

  const studentNavItems = [
    { id: 'home', label: 'Home Dashboard', icon: Home },
    { id: 'live-tracking', label: 'Live Bus Tracking', icon: Navigation, badge: 'LIVE' },
    { id: 'route-details', label: 'Route & Stops', icon: MapPin },
    { id: 'bus-pass', label: 'Digital Bus Pass', icon: PassIcon },
    { id: 'payment', label: 'Fee Payment', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const driverNavItems = [
    { id: 'driver-dashboard', label: 'Driver Console', icon: Truck },
    { id: 'live-tracking', label: 'Route Map', icon: Navigation, badge: 'GPS' },
    { id: 'driver-emergency', label: 'Emergency / SOS', icon: AlertTriangle, danger: true },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Control Overview', icon: LayoutDashboard },
    { id: 'admin-fleet-map', label: 'Live Fleet Map', icon: Map },
    { id: 'admin-incidents', label: 'Incident Center', icon: AlertTriangle, badge: activeIncidentsCount > 0 ? `${activeIncidentsCount}` : undefined, danger: activeIncidentsCount > 0 },
    { id: 'admin-routes', label: 'Route Monitoring', icon: MapPin },
    { id: 'admin-students', label: 'Student Directory', icon: Users },
    { id: 'admin-buses', label: 'Bus Fleet Management', icon: BusIcon },
    { id: 'admin-drivers', label: 'Driver Roster', icon: UserCheck },
    { id: 'admin-passes', label: 'Pass Approvals', icon: FileCheck },
    { id: 'admin-payments', label: 'Payments & Revenue', icon: DollarSign },
    { id: 'admin-announcements', label: 'Broadcast Message', icon: Megaphone },
  ];

  const currentItems =
    role === 'student'
      ? studentNavItems
      : role === 'driver'
      ? driverNavItems
      : adminNavItems;

  return (
    <aside className="w-60 bg-white border-r border-slate-200 text-slate-700 hidden md:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4 space-y-6 shadow-sm">
      
      {/* Role Header Indicator */}
      <div className="px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Workspace</div>
          <div className="text-xs font-bold text-slate-800 capitalize">
            {role === 'student' ? 'Student Portal' : role === 'driver' ? 'Driver Operations' : 'Transport Admin'}
          </div>
        </div>
        <span
          className={`w-2 h-2 rounded-full ${
            role === 'student' ? 'bg-blue-600' : role === 'driver' ? 'bg-indigo-600' : 'bg-emerald-600'
          } animate-ping`}
        />
      </div>

      {/* Navigation Group */}
      <nav className="space-y-1 flex-1">
        {currentItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-blue-600' : item.danger ? 'text-rose-500' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.danger
                      ? 'bg-rose-100 text-rose-700 animate-pulse'
                      : isActive
                      ? 'bg-blue-200/60 text-blue-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Demo Guidance Card */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
        <p className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> EYantra Live Sync
        </p>
        Actions taken in Driver or Admin views immediately update the Student live map and notification feed.
      </div>
    </aside>
  );
};
