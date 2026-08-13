import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, Filter, ShieldCheck, Check, X, Eye } from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const { students, routes, buses, approvePass, rejectPass } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredStudents = students.filter((stu) => {
    const matchesSearch =
      stu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stu.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stu.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || stu.passStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-8">
      
      {/* Header */}
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-lg text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Student Transport Roster</h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage registered students, route track allocations, and digital pass verification.</p>
          </div>
        </div>

        {/* Search & Filter Inputs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student ID or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800/90 border border-slate-700 text-xs text-white pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 placeholder-slate-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800/90 border border-slate-700 text-xs text-white px-3 py-2 rounded-lg focus:outline-none"
          >
            <option value="all">All Pass Statuses</option>
            <option value="Active">Active / Approved</option>
            <option value="Pending">Pending Approval</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 rounded-l-lg">Student Details</th>
                <th className="p-4">Student ID</th>
                <th className="p-4">Department</th>
                <th className="p-4">Assigned Route</th>
                <th className="p-4">Pass Status</th>
                <th className="p-4 text-right rounded-r-lg">Pass Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.map((stu) => {
                const assignedRoute = routes.find((r) => r.id === stu.assignedRouteId);
                const assignedBus = buses.find((b) => b.id === stu.assignedBusId);
                return (
                  <tr key={stu.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                      <img src={stu.photoUrl} alt={stu.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20" />
                      <div>
                        <div className="text-sm font-bold text-slate-900">{stu.name}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{stu.email}</div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-blue-600">{stu.studentId}</td>
                    <td className="p-4 text-slate-700">{stu.department}</td>
                    <td className="p-4 text-slate-700">
                      {assignedRoute?.code || 'Route'} ({assignedBus?.busNumber || 'Bus'})
                    </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        stu.passStatus === 'Active' || stu.passStatus === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : stu.passStatus === 'Pending'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {stu.passStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => approvePass(stu.id)}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-md border border-emerald-200 transition"
                        title="Approve Pass"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => rejectPass(stu.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white rounded-md border border-rose-200 transition"
                        title="Reject Pass"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
