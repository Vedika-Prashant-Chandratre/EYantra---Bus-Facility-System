import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Phone, ShieldCheck } from 'lucide-react';

export const DriverManagement: React.FC = () => {
  const { drivers } = useApp();

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-lg text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Bus Driver Roster</h1>
            <p className="text-xs text-slate-400 mt-0.5">Driver license details, active route allocations, and performance records.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 rounded-l-lg">Driver Name</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4">License Number</th>
                <th className="p-4">Assigned Bus</th>
                <th className="p-4 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {drivers.map((drv) => (
                <tr key={drv.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                    <img src={drv.photoUrl} alt={drv.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20" />
                    <span>{drv.name}</span>
                  </td>
                  <td className="p-4 font-mono text-blue-600">{drv.phone}</td>
                  <td className="p-4 font-mono text-slate-700">{drv.licenseNumber}</td>
                  <td className="p-4 font-bold text-slate-800">Bus A-101</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {drv.status}
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
