import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'ROUTE_ALERT' | 'ANNOUNCEMENT' | 'FEE_REMINDER'>('ALL');

  const filteredNotifs = notifications.filter((n) =>
    filter === 'ALL' ? true : n.category === filter
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header - Spacious */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
              <Bell className="w-3.5 h-3.5 text-sky-600" />
              Official Campus Bulletins
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Transport Advisory
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notices & Transit Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time route updates, weather advisories, timetable modifications, and fee notices.
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors shrink-0"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Notices' },
          { id: 'ROUTE_ALERT', label: 'Bus & Route Delays' },
          { id: 'ANNOUNCEMENT', label: 'Exam & Timetables' },
          { id: 'FEE_REMINDER', label: 'Pass & Fees' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === tab.id
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="space-y-3.5">
        {filteredNotifs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No notices in this category</p>
          </div>
        ) : (
          filteredNotifs.map((n) => {
            const isUnread = !n.isRead;
            return (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isUnread
                    ? 'bg-white border-sky-300 ring-2 ring-sky-100 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        n.category === 'ROUTE_ALERT'
                          ? 'bg-amber-100 text-amber-700'
                          : n.category === 'ANNOUNCEMENT'
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {n.category === 'ROUTE_ALERT' && <AlertTriangle className="w-5 h-5" />}
                      {n.category === 'ANNOUNCEMENT' && <Info className="w-5 h-5" />}
                      {n.category === 'FEE_REMINDER' && <CheckCircle2 className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                        {isUnread && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500 text-white">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {n.timestamp}
                        </span>
                        <span>•</span>
                        <span>Transport Cell KKWIEER</span>
                      </div>
                    </div>
                  </div>

                  {!n.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationAsRead(n.id);
                      }}
                      className="text-xs font-semibold text-sky-600 hover:text-sky-800 shrink-0"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
