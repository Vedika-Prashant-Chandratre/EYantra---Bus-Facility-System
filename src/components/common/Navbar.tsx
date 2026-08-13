import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bus, Bell, Shield, User, Truck, CheckCheck, Sparkles, X } from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { role, setRole, notifications, markNotificationRead, markAllNotificationsRead, currentStudent, currentDriver } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'student') setActiveTab('home');
    if (newRole === 'driver') setActiveTab('driver-dashboard');
    if (newRole === 'admin') setActiveTab('admin-dashboard');
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-[60] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bus className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                EYantra
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest">
                <Sparkles className="w-2.5 h-2.5" /> Demo Mode
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block font-medium">
              Smart College Bus Tracking, Pass & Management System
            </p>
          </div>
        </div>

        {/* Role Switcher Pills & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Quick Role Toggle Bar */}
          <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => handleRoleChange('student')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'student'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Student</span>
            </button>

            <button
              onClick={() => handleRoleChange('driver')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'driver'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Driver</span>
            </button>

            <button
              onClick={() => handleRoleChange('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'admin'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin</span>
            </button>
          </div>

          {/* User Profile Badge */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800">
            <img
              src={
                role === 'student'
                  ? currentStudent.photoUrl
                  : role === 'driver'
                  ? currentDriver.photoUrl
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
              }
              alt="User"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-200">
                {role === 'student'
                  ? currentStudent.name
                  : role === 'driver'
                  ? currentDriver.name
                  : 'Transport Controller'}
              </div>
              <div className="text-[10px] text-slate-400 capitalize">
                {role === 'student'
                  ? `${currentStudent.name.split(' ')[0]} • ${currentStudent.studentId}`
                  : role === 'driver'
                  ? currentDriver.name
                  : 'Transport Admin'}
              </div>
            </div>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition border border-slate-700/60"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 text-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-xs text-slate-900">Live Transport Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                      >
                        <CheckCheck className="w-3 h-3" /> Mark read
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">No recent notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3.5 transition cursor-pointer hover:bg-slate-50 ${
                          !n.read ? 'bg-blue-50/50 border-l-2 border-blue-600' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`text-xs font-bold ${
                              n.type === 'danger'
                                ? 'text-rose-600'
                                : n.type === 'warning'
                                ? 'text-amber-600'
                                : n.type === 'success'
                                ? 'text-emerald-600'
                                : 'text-blue-600'
                            }`}
                          >
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-snug">{n.description}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      if (role === 'student') setActiveTab('notifications');
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View All Notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
