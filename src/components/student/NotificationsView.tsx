import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  return (
    <div className="space-y-6 pb-8">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Transport Alerts & Notifications</h1>
            <p className="text-xs text-slate-400 mt-0.5">Real-time updates on route departures, delays, and pass approvals.</p>
          </div>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 px-3.5 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
        >
          <CheckCheck className="w-4 h-4 text-blue-400" /> Mark All Read
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className={`p-5 rounded-2xl border transition shadow-md cursor-pointer ${
              !n.read
                ? 'bg-slate-900 border-blue-500/80'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    n.type === 'danger'
                      ? 'bg-rose-500'
                      : n.type === 'warning'
                      ? 'bg-amber-500'
                      : n.type === 'success'
                      ? 'bg-emerald-500'
                      : 'bg-blue-500'
                  }`}
                />
                <h3 className="text-sm font-bold text-white">{n.title}</h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">{n.timestamp}</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{n.description}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
