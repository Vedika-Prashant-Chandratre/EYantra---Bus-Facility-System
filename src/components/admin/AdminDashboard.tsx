import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bus, Users, MapPin, AlertTriangle, ShieldCheck, DollarSign, Activity, Megaphone, Plus, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveTab }) => {
  const { buses, routes, students, incidents, passApplications, payments } = useApp();

  const activeIncidents = incidents.filter((i) => i.status !== 'Resolved');
  const activeBusesCount = buses.filter((b) => b.status === 'On Route').length;
  const pendingPassesCount = passApplications.filter((p) => p.status === 'Pending').length;

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  // Chart Data
  const routeOccupancyData = routes.map((r) => {
    const bus = buses.find((b) => b.routeId === r.id);
    return {
      name: r.code,
      occupancy: bus ? bus.currentOccupancy : 30,
      capacity: bus ? bus.capacity : 40,
    };
  });

  const statusDistribution = [
    { name: 'On Route', value: buses.filter((b) => b.status === 'On Route').length, color: '#10b981' },
    { name: 'At College', value: buses.filter((b) => b.status === 'At College').length, color: '#3b82f6' },
    { name: 'Delayed', value: buses.filter((b) => b.status === 'Delayed').length, color: '#f59e0b' },
    { name: 'Breakdown / Emergency', value: buses.filter((b) => b.status === 'Breakdown' || b.status === 'Emergency').length, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6 pb-8">
      
      {/* Header & Title */}
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-lg text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">EYantra Transport Control Center</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              SYSTEM ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time college fleet monitoring, emergency dispatch, and pass administration hub.
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('admin-announcements')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            <Megaphone className="w-4 h-4" /> Broadcast Announcement
          </button>
          <button
            onClick={() => setActiveTab('admin-passes')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2 px-4 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Pending Passes ({pendingPassesCount})
          </button>
        </div>
      </div>

      {/* Critical Incidents Warning Banner if active */}
      {activeIncidents.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-900 flex items-center justify-between shadow-xs animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                CRITICAL INCIDENT DETECTED ({activeIncidents.length} OPEN)
              </div>
              <div className="text-xs text-rose-700 mt-0.5">
                {activeIncidents[0].type} reported on Bus {activeIncidents[0].busNumber} by driver {activeIncidents[0].driverName}
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('admin-incidents')}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shrink-0"
          >
            Resolve in Incident Center →
          </button>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Bus className="w-3.5 h-3.5 text-emerald-600" /> Active Buses
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{activeBusesCount} / {buses.length}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5 font-semibold">On Route Now</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Bus className="w-3.5 h-3.5 text-blue-600" /> Total Fleet
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">12 Buses</div>
          <div className="text-[10px] text-slate-500 mt-0.5">4 Backup Buses</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Active Routes
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{routes.length} Routes</div>
          <div className="text-[10px] text-slate-500 mt-0.5">15 Main Stops</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-amber-600" /> Commuters
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">1,248</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Registered Students</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-cyan-600" /> Today's Trips
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">24 Trips</div>
          <div className="text-[10px] text-emerald-600 mt-0.5 font-semibold">100% On Schedule</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Incidents
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-1">{activeIncidents.length} Open</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Requires Attention</div>
        </div>

      </div>

      {/* Analytics Charts & Fleet Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Route Capacity Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Route Passenger Occupancy</h2>
            <span className="text-xs text-slate-500 font-semibold">Live Capacity</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routeOccupancyData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a' }}
                />
                <Bar dataKey="occupancy" fill="#2563eb" radius={[6, 6, 0, 0]} name="Occupied Seats" />
                <Bar dataKey="capacity" fill="#e2e8f0" radius={[6, 6, 0, 0]} name="Total Capacity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Status Distribution Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bus Fleet Operational Status</h2>
            <span className="text-xs text-emerald-600 font-semibold">Live Distribution</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            {statusDistribution.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600">{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
