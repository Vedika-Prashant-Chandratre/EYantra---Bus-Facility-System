import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bus as BusIcon, Plus, Edit2, ShieldAlert, Check } from 'lucide-react';
import { Bus } from '../../types';

export const BusManagement: React.FC = () => {
  const { buses } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6 pb-8">
      
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-lg text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <BusIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">College Bus Fleet Roster</h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage vehicle registration, driver allocation, and maintenance status.</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New Bus
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 rounded-l-lg">Bus Number</th>
                <th className="p-4">Registration</th>
                <th className="p-4">Capacity</th>
                <th className="p-4">Assigned Driver</th>
                <th className="p-4">Assigned Route</th>
                <th className="p-4 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {buses.map((bus) => (
                <tr key={bus.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-bold text-slate-900 text-sm">{bus.busNumber}</td>
                  <td className="p-4 font-mono font-bold text-slate-700">{bus.registrationNumber}</td>
                  <td className="p-4 text-slate-700">{bus.capacity} Seats</td>
                  <td className="p-4 text-slate-700">{bus.driverName}</td>
                  <td className="p-4 text-blue-600 font-bold">{bus.routeName}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        bus.status === 'On Route'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : bus.status === 'Breakdown'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {bus.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
